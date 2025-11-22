from flask import Flask, jsonify, request, abort
from flask_cors import CORS
import threading
import time
import csv
import math
import os
from secure_delete import SecureDelete
from pathlib import Path
import psutil
import platform
app = Flask(__name__)
CORS(app)



dfrom battery_health import get_battery_health
from system_info import (
    get_cpu_info,
    get_memory_info,
    get_disk_usage
)

# Try to import battery health modules (Windows-specific)
try:
    import wmi
    import subprocess
    HAS_BATTERY_MODULES = True
except ImportError:
    HAS_BATTERY_MODULES = False
    print("Warning: wmi or subprocess not available. Battery health checks may be limited.")
@app.route('/api/health/full', methods=['GET'])
def full_health_check():
    # Battery
    battery_percent, device_type = get_battery_health()
    if battery_percent is None:
        battery_percent = 0
        device_type = "unknown"

    # CPU, Memory, Disk
    cpu = get_cpu_info()
    memory = get_memory_info()
    disk = get_disk_usage()

    # Simple scoring logic
    storage_health = max(0, 100 - disk["disk_usage_percent"])
    performance_score = max(0, 100 - cpu["cpu_usage_percent"])

    # Overall health average
    overall_health = round(
        (battery_percent + storage_health + performance_score) / 3, 
        2
    )

    return jsonify({
        "overall_health": overall_health,
        "battery_health": battery_percent,
        "storage_health": storage_health,
        "performance_score": performance_score,
        "recommendations": [
            "Keep your system updated",
            "Avoid overloading CPU with too many apps",
            "Free storage space for better performance"
        ],
        "details": {
            "battery": {
                "health_percent": battery_percent,
                "device_type": device_type
            },
            "cpu": cpu,
            "memory": memory,
            "disk": disk
        }
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
        