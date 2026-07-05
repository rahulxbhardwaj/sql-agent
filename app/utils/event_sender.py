import requests
from app.config import EVENT_PATH

def send_event(node, status="started", message=None):
    try:
        requests.post(
            url=EVENT_PATH,
            json={
                "node": node,
                "status": status,
                "message": message,
            },
            timeout=1,
        )
    except requests.RequestException:
        pass