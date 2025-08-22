#!/bin/bash
# Quick Start Script for MCP Orchestrator

echo "🚀 Starting MCP Orchestrator..."

# Check if Python is available
if ! command -v python &> /dev/null; then
    echo "❌ Python not found. Please install Python 3.8+"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "mcp_server.py" ]; then
    echo "❌ mcp_server.py not found. Please run from .mcp-server directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pip install mcp

# Start the server
echo "🔄 Starting MCP server..."
echo "Server will run in background. Use Ctrl+C to stop."
python mcp_server.py
