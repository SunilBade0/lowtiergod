import json, os, subprocess

def get_window_id():
    out = subprocess.check_output(['wmctrl', '-l', '-x']).decode()
    for line in out.splitlines():
        if 'steam_app_2161700' in line:
            # wmctrl returns hex string like "0x05000001"
            # OBS requires decimal integer for window id
            win_id_hex = line.split()[0]
            return int(win_id_hex, 16)
    return None

win_id = get_window_id()
if win_id:
    print(f"Window ID: {win_id}")
