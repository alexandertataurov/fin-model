#!/usr/bin/env python3
"""
Simple HTTP server for serving FinVision API documentation locally.
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path

# Configuration
PORT = 8080
DIRECTORY = Path(__file__).parent


class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom HTTP request handler with better error handling and MIME types."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIRECTORY), **kwargs)

    def end_headers(self):
        """Add CORS headers for local development."""
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def guess_type(self, path):
        """Override MIME type guessing for better file handling."""
        base, ext = os.path.splitext(path)
        if ext == ".yaml" or ext == ".yml":
            return "application/x-yaml"
        elif ext == ".json":
            return "application/json"
        elif ext == ".md":
            return "text/markdown"
        return super().guess_type(path)


def main():
    """Main function to start the server."""
    try:
        with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
            print(f"🚀 FinVision API Documentation Server")
            print(f"📍 Serving at: http://localhost:{PORT}")
            print(f"📁 Directory: {DIRECTORY}")
            print(f"📄 Files available:")
            print(f"   • Landing page: http://localhost:{PORT}/landing.html")
            print(f"   • ReDoc: http://localhost:{PORT}/index.html")
            print(f"   • Swagger UI: http://localhost:{PORT}/swagger.html")
            print(f"   • OpenAPI Spec: http://localhost:{PORT}/../openapi.yaml")
            print(
                f"   • Postman Collection: http://localhost:{PORT}/../FinVision_API.postman_collection.json"
            )
            print(f"   • Full Docs: http://localhost:{PORT}/../API_DOCUMENTATION.md")
            print(f"\n🛑 Press Ctrl+C to stop the server")
            print(f"=" * 60)

            httpd.serve_forever()

    except KeyboardInterrupt:
        print(f"\n🛑 Server stopped by user")
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Port {PORT} is already in use. Try a different port:")
            print(f"   python server.py --port {PORT + 1}")
        else:
            print(f"❌ Error starting server: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")


if __name__ == "__main__":
    # Parse command line arguments
    if len(sys.argv) > 1 and sys.argv[1] == "--port":
        try:
            PORT = int(sys.argv[2])
        except (IndexError, ValueError):
            print("Usage: python server.py [--port PORT]")
            sys.exit(1)

    main()
