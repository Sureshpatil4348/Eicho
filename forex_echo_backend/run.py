from waitress import serve
from app.main import app
import os
import signal

def signal_handler(sig, frame):
    print('\n🛑 Gracefully shutting down server...')
    os._exit(0)

if __name__ == "__main__":
    # Ctrl+C handler
    signal.signal(signal.SIGINT, signal_handler)
    
    PORT = 8000

    print("Starting Professional Forex Trading Server (Waitress)...")
    print(f"Server listening on all interfaces (0.0.0.0:{PORT})")
    print("Access externally via your public IP, e.g., http://20.83.157.24:8000")
    
    serve(app, host="0.0.0.0", port=PORT)
