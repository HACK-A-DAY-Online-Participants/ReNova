import psutil
import platform


# CPU INFORMATION

def get_cpu_info():
    return {
        "physical_cores": psutil.cpu_count(logical=False),
        "total_cores": psutil.cpu_count(logical=True),
        "cpu_usage_percent": psutil.cpu_percent(interval=1)
    }


# MEMORY/RAM INFORMATION

def get_memory_info():
    mem = psutil.virtual_memory()
    return {
        "total_gb": round(mem.total / (1024**3), 2),
        "available_gb": round(mem.available / (1024**3), 2),
        "used_gb": round(mem.used / (1024**3), 2),
        "memory_usage_percent": mem.percent
    }


# DISK USAGE

def get_disk_usage():
    usage = psutil.disk_usage('/')
    return {
        "total_gb": round(usage.total / (1024**3), 2),
        "used_gb": round(usage.used / (1024**3), 2),
        "free_gb": round(usage.free / (1024**3), 2),
        "disk_usage_percent": usage.percent
    }


# DISK PARTITIONS

def get_disk_partitions():
    partitions = psutil.disk_partitions()
    result = []
    for p in partitions:
        result.append({
            "device": p.device,
            "mountpoint": p.mountpoint,
            "fstype": p.fstype,
            "opts": p.opts
        })
    return result


# NETWORK STATS

def get_network_stats():
    net = psutil.net_io_counters()
    return {
        "bytes_sent_mb": round(net.bytes_sent / (1024**2), 2),
        "bytes_received_mb": round(net.bytes_recv / (1024**2), 2),
        "packets_sent": net.packets_sent,
        "packets_received": net.packets_recv
    }


# PROCESS INFORMATION

def get_process_info():
    return {
        "total_processes": len(psutil.pids())
    }


# PRINT ALL SYSTEM INFORMATION

if __name__ == "__main__":
    print("\n==== CPU INFO ====")
    print(get_cpu_info())

    print("\n==== MEMORY INFO ====")
    print(get_memory_info())

    print("\n==== DISK USAGE ====")
    print(get_disk_usage())

    print("\n==== DISK PARTITIONS ====")
    for part in get_disk_partitions():
        print(part)

    print("\n==== NETWORK STATS ====")
    print(get_network_stats())

    print("\n==== PROCESS INFO ====")
    print(get_process_info())
