#!/usr/bin/env python3
"""
Secure File/Folder Deletion Tool - Hackathon Version
HDD: DoD 5220.22-M (3-pass overwrite)
SSD: ATA Secure Erase for specific files/folders
"""

import os
import sys
import random
import subprocess
import platform
from pathlib import Path
from typing import Tuple

class SecureDelete:
    """Smart secure deletion based on drive type"""
    
    def __init__(self, verbose: bool = True):
        self.verbose = verbose
        
    def _log(self, message: str):
        if self.verbose:
            print(message)
    
    def _is_ssd(self, filepath: str) -> Tuple[bool, str]:
        """
        Detect if file is on SSD or HDD
        
        Returns:
            (is_ssd, drive_path)
        """
        path = Path(filepath).resolve()
        
        system = platform.system()
        
        if system == "Linux":
            # Get the device for this file
            stat_info = os.stat(path.parent)
            dev_id = stat_info.st_dev
            
            # Find the device name
            for device in Path('/sys/block').iterdir():
                try:
                    # Check if this is the right device
                    with open(device / 'dev', 'r') as f:
                        dev_num = f.read().strip()
                    
                    # Check if it's rotational (0 = SSD, 1 = HDD)
                    with open(device / 'queue/rotational', 'r') as f:
                        rotational = int(f.read().strip())
                    
                    if rotational == 0:
                        return (True, str(device.name))
                    else:
                        return (False, str(device.name))
                except:
                    continue
                    
        elif system == "Windows":
            # Get drive letter
            drive = path.drive
            
            try:
                # Use PowerShell to check drive type
                cmd = f'powershell "Get-PhysicalDisk | Where-Object {{$_.DeviceID -eq (Get-Partition -DriveLetter {drive[0]}).DiskNumber}} | Select-Object -ExpandProperty MediaType"'
                result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
                media_type = result.stdout.strip()
                
                is_ssd = 'SSD' in media_type or 'NVMe' in media_type
                return (is_ssd, drive)
            except:
                self._log("  Warning: Could not detect drive type, defaulting to HDD method")
                return (False, drive)
        
        elif system == "Darwin":  # macOS
            try:
                cmd = f'diskutil info {path.parent} | grep "Solid State"'
                result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
                is_ssd = 'Yes' in result.stdout
                return (is_ssd, str(path.parent))
            except:
                return (False, str(path.parent))
        
        # Default to HDD if detection fails
        return (False, "unknown")
    
    def _dod_overwrite(self, filepath: Path) -> bool:
        """
        DoD 5220.22-M standard: 3-pass overwrite
        Pass 1: 0x00 (zeros)
        Pass 2: 0xFF (ones)
        Pass 3: Random data
        """
        try:
            file_size = filepath.stat().st_size
            
            if file_size == 0:
                return True
            
            self._log(f"  Using DoD 5220.22-M (3-pass overwrite)")
            
            patterns = [b'\x00', b'\xFF', None]  # None = random
            
            with open(filepath, 'rb+') as f:
                for pass_num, pattern in enumerate(patterns, 1):
                    self._log(f"    Pass {pass_num}/3...")
                    f.seek(0)
                    
                    chunk_size = 65536  # 64KB chunks
                    bytes_written = 0
                    
                    while bytes_written < file_size:
                        write_size = min(chunk_size, file_size - bytes_written)
                        
                        if pattern is None:
                            chunk = random.randbytes(write_size)
                        else:
                            chunk = pattern * write_size
                        
                        f.write(chunk)
                        bytes_written += write_size
                    
                    f.flush()
                    os.fsync(f.fileno())
            
            return True
            
        except Exception as e:
            self._log(f"  Error during overwrite: {e}")
            return False
    
    def _ata_secure_erase_file(self, filepath: Path) -> bool:
        """
        ATA Secure Erase for SSD files
        Uses TRIM command to mark blocks for erasure
        """
        try:
            self._log(f"  Using ATA Secure Erase (TRIM)")
            
            system = platform.system()
            
            # First, delete the file to trigger TRIM
            filepath.unlink()
            
            # Force TRIM operation
            if system == "Linux":
                # Run fstrim on the mount point
                mount_point = self._get_mount_point(filepath.parent)
                subprocess.run(['fstrim', '-v', str(mount_point)], 
                             check=False, capture_output=True)
                self._log(f"    TRIM issued for mount point: {mount_point}")
                
            elif system == "Windows":
                # Windows automatically TRIMs on delete for SSDs
                # Force optimize (TRIM) on the drive
                drive = str(filepath).split(':')[0] + ':'
                subprocess.run(['defrag', drive, '/L'], 
                             check=False, capture_output=True)
                self._log(f"    TRIM issued for drive: {drive}")
                
            elif system == "Darwin":  # macOS
                # macOS automatically TRIMs on APFS
                self._log(f"    TRIM will be handled by APFS automatically")
            
            return True
            
        except Exception as e:
            self._log(f"  Error during ATA secure erase: {e}")
            return False
    
    def _get_mount_point(self, path: Path) -> Path:
        """Get the mount point for a given path"""
        path = path.resolve()
        while not os.path.ismount(path):
            path = path.parent
        return path
    
    def _obscure_filename(self, filepath: Path) -> Path:
        """Rename file to random name"""
        try:
            parent = filepath.parent
            random_name = ''.join(random.choices('0123456789abcdef', k=16))
            new_path = parent / random_name
            filepath.rename(new_path)
            return new_path
        except:
            return filepath
    
    def secure_delete_file(self, filepath: str) -> bool:
        """
        Securely delete a file using appropriate method
        """
        path = Path(filepath)
        
        if not path.exists():
            self._log(f"File not found: {filepath}")
            return False
        
        if not path.is_file():
            self._log(f"Not a file: {filepath}")
            return False
        
        self._log(f"\nSecurely deleting: {filepath}")
        
        # Detect drive type
        is_ssd, drive = self._is_ssd(filepath)
        self._log(f"Drive type: {'SSD' if is_ssd else 'HDD'} ({drive})")
        
        success = False
        
        if is_ssd:
            # SSD: Use ATA Secure Erase (TRIM)
            # Rename first to obscure filename
            path = self._obscure_filename(path)
            success = self._ata_secure_erase_file(path)
        else:
            # HDD: Use DoD 3-pass overwrite
            success = self._dod_overwrite(path)
            if success:
                # Rename to obscure original filename
                path = self._obscure_filename(path)
                # Delete the file
                try:
                    path.unlink()
                    success = True
                except Exception as e:
                    self._log(f"  Error deleting: {e}")
                    success = False
        
        if success:
            self._log(f"✓ Successfully deleted: {filepath}\n")
        else:
            self._log(f"✗ Failed to delete: {filepath}\n")
        
        return success
    
    def secure_delete_folder(self, folderpath: str) -> bool:
        """
        Securely delete a folder and all its contents
        """
        path = Path(folderpath)
        
        if not path.exists():
            self._log(f"Folder not found: {folderpath}")
            return False
        
        if not path.is_dir():
            self._log(f"Not a folder: {folderpath}")
            return False
        
        self._log(f"\n{'='*60}")
        self._log(f"Securely deleting folder: {folderpath}")
        self._log(f"{'='*60}")
        
        # Get all files recursively
        files = list(path.rglob('*'))
        files = [f for f in files if f.is_file()]
        
        self._log(f"Found {len(files)} file(s) to delete\n")
        
        # Delete all files
        success = True
        for file in files:
            if not self.secure_delete_file(str(file)):
                success = False
        
        # Remove empty directories
        try:
            for dirpath in sorted(path.rglob('*'), reverse=True):
                if dirpath.is_dir():
                    dirpath.rmdir()
            path.rmdir()
            self._log(f"✓ Folder structure removed\n")
        except Exception as e:
            self._log(f"✗ Error removing directories: {e}\n")
            success = False
        
        return success


def main():
    """CLI interface"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Secure file/folder deletion (HDD: DoD, SSD: ATA TRIM)',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python secure_delete.py file.txt
  python secure_delete.py /path/to/folder -r
  python secure_delete.py secret.doc -q
        """
    )
    
    parser.add_argument('path', help='File or folder to securely delete')
    parser.add_argument('-r', '--recursive', action='store_true',
                       help='Delete folder and all contents')
    parser.add_argument('-q', '--quiet', action='store_true',
                       help='Quiet mode (minimal output)')
    
    args = parser.parse_args()
    
    # Confirmation prompt
    if not args.quiet:
        response = input(f"⚠️  This will PERMANENTLY delete '{args.path}'. Continue? (yes/no): ")
        if response.lower() not in ['yes', 'y']:
            print("Operation cancelled.")
            return
    
    deleter = SecureDelete(verbose=not args.quiet)
    
    path = Path(args.path)
    
    if path.is_file():
        success = deleter.secure_delete_file(args.path)
    elif path.is_dir():
        if not args.recursive:
            print("Error: Use -r flag to delete folders")
            return
        success = deleter.secure_delete_folder(args.path)
    else:
        print(f"Error: Path not found: {args.path}")
        return
    
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()