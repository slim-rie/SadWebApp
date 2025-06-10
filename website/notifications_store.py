# Shared in-memory notifications store
import os
import json

NOTIF_FILE = os.path.join(os.path.dirname(__file__), 'notifications.json')

def load_notifications():
    if os.path.exists(NOTIF_FILE):
        try:
            with open(NOTIF_FILE, 'r') as f:
                return json.load(f)
        except Exception as e:
            print('[NotificationStore] Failed to load notifications:', e)
    return []

def save_notifications():
    try:
        with open(NOTIF_FILE, 'w') as f:
            json.dump(notifications, f)
    except Exception as e:
        print('[NotificationStore] Failed to save notifications:', e)

notifications = load_notifications()  # Each notification: {'username': ..., 'email': ..., 'message': ..., 'subject': ..., 'timestamp': ..., 'read': False}
