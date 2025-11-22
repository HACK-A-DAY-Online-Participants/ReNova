import subprocess
import wmi


# LAPTOP (WMI)

def get_laptop_battery_health():
    try:
        w = wmi.WMI(namespace="root\\WMI")

        full = w.BatteryFullChargedCapacity()[0].FullChargedCapacity
        design = w.BatteryStaticData()[0].DesignedCapacity

        health = (full / design) * 100
        return round(health, 2), "laptop"
    except:
        return None, None



# ANDROID (ADB)

def adb_shell(cmd):
    result = subprocess.run(
        ["adb", "shell"] + cmd.split(),
        capture_output=True, text=True
    )
    return result.stdout.strip()


def get_android_battery_health():
    try:
        devices = subprocess.run(["adb", "devices"], capture_output=True, text=True).stdout
        if "device" not in devices.splitlines()[-1]:
            return None, None  

        charge_full = adb_shell("cat /sys/class/power_supply/battery/charge_full")
        design_full = adb_shell("cat /sys/class/power_supply/battery/charge_full_design")

        if not charge_full.isdigit() or not design_full.isdigit():
            return None, None  

        charge_full = int(charge_full)
        design_full = int(design_full)

        health = (charge_full / design_full) * 100
        return round(health, 2), "android"

    except:
        return None, None



# UNIVERSAL CHECKER

def get_battery_health():
    health, device_type = get_laptop_battery_health()
    if health is not None:
        return health, device_type

    health, device_type = get_android_battery_health()
    if health is not None:
        return health, device_type

    return None, "none"



# MAIN

if __name__ == "__main__":
    health, device = get_battery_health()

    if device == "laptop":
        print(f"Battery Health (Laptop): {health}%")

    elif device == "android":
        print(f"Battery Health (Android): {health}%")

    else:
        print("No battery device detected.")
