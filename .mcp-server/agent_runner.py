#!/usr/bin/env python3
"""
Simple Agent Runner
Automatically creates chats and runs agents in Cursor.
"""

import asyncio
import json
import time
from pathlib import Path
from typing import Dict, List, Any


class SimpleAgentRunner:
    """Simple agent runner for Cursor automation."""

    def __init__(self):
        self.agents = {}
        self.channels = [
            "a2e",
            "e2a",
        ]  # architect to executor, executor to architect

    def get_architect_prompt(self) -> str:
        """Get the architect system prompt."""
        return """ROLE: You are the Architect agent in a two-agent collaboration system.

SETUP:
- Use MCP tools to communicate via message channels
- Always register yourself first: register_agent(name="architect", channels=["a2e", "e2a"])
- Post tasks to "a2e" channel, pull responses from "e2a" channel

PROTOCOL:
1. Break down requests into micro-tasks
2. Post structured envelopes with task_id, micro_task, acceptance_criteria
3. Wait for executor response before next step
4. End each message with [[END-OF-TURN]]

ENVELOPE FORMAT:
{
  "from": "architect",
  "task_id": "T-001", 
  "intent": "plan|review|question|finalize",
  "micro_task": "specific actionable step",
  "acceptance_criteria": "how to verify success",
  "max_turns": 30,
  "handoff_tag": "[[END-OF-TURN]]"
}

WORKFLOW:
1. Register agent
2. Post task envelope to a2e 
3. Pull response from e2a
4. Review and plan next step
5. Repeat until done or stop condition met

Be concise and focus on one micro-task at a time."""

    def get_executor_prompt(self) -> str:
        """Get the executor system prompt."""
        return """ROLE: You are the Executor agent in a two-agent collaboration system.

SETUP:
- Use MCP tools to communicate via message channels  
- Always register yourself first: register_agent(name="executor", channels=["a2e", "e2a"])
- Pull tasks from "a2e" channel, post results to "e2a" channel

PROTOCOL:
1. Pull latest task from architect
2. Execute the specific micro_task only
3. Run tests/validation where applicable
4. Post structured result envelope
5. End each message with [[END-OF-TURN]]

ENVELOPE FORMAT:
{
  "from": "executor",
  "task_id": "T-001",
  "status": "success|fail", 
  "summary": "1-3 line summary of what was done",
  "diff_unified": "code changes made",
  "commands_run": ["command1", "command2"],
  "logs_tail": "relevant output or errors",
  "tests": {"passed": 0, "failed": 0, "skipped": 0},
  "artifacts": ["paths/to/files/created"],
  "needs_input": false,
  "next_suggestion": "optional next micro-step",
  "done": false,
  "handoff_tag": "[[END-OF-TURN]]"
}

WORKFLOW:
1. Register agent
2. Pull task from a2e
3. Execute micro-task safely
4. Post result envelope to e2a
5. Wait for next task

Always be precise and include verification steps."""

    def get_starter_message(self) -> str:
        """Get the starter message to begin the conversation."""
        return """I need to set up the orchestrator system and create a simple calculator function with tests. Let me start by registering as the architect agent."""

    def create_cursor_setup_script(self) -> str:
        """Create a script to set up Cursor with the MCP server."""
        architect_prompt = self.get_architect_prompt()
        executor_prompt = self.get_executor_prompt()
        starter_message = self.get_starter_message()

        return f"""# Cursor Setup Script

## Step 1: Install Dependencies
```bash
cd .mcp-server
pip install mcp
```

## Step 2: Configure Cursor MCP
Add to `~/.cursor/mcp.json`:
```json
{{
  "mcpServers": {{
    "orchestrator": {{
      "command": "python",
      "args": ["/absolute/path/to/.mcp-server/mcp_server.py"]
    }}
  }}
}}
```

## Step 3: Start the Server
```bash
cd .mcp-server
python mcp_server.py
```

## Step 4: Create Two Chat Tabs

### Tab A (Architect):
1. Open new chat in Cursor
2. Set MCP server to "orchestrator"
3. Paste this as System Prompt:
```
{architect_prompt}
```

### Tab B (Executor):
1. Open new chat in Cursor  
2. Set MCP server to "orchestrator"
3. Paste this as System Prompt:
```
{executor_prompt}
```

## Step 5: Start Conversation
In Tab A (Architect), send this message:
```
{starter_message}
```

The agents will now communicate automatically via the MCP server!"""

    def create_quick_start_script(self) -> str:
        """Create a quick start script."""
        return """#!/bin/bash
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
"""

    def save_setup_files(self):
        """Save setup files to the project."""
        # Create setup script
        setup_script = self.create_cursor_setup_script()
        with open("CURSOR_SETUP.md", "w") as f:
            f.write(setup_script)

        # Create quick start script
        quick_start = self.create_quick_start_script()
        with open("quick_start.sh", "w") as f:
            f.write(quick_start)

        # Make quick start executable
        import os

        os.chmod("quick_start.sh", 0o755)

        print("✅ Setup files created:")
        print("  - CURSOR_SETUP.md (Cursor configuration guide)")
        print("  - quick_start.sh (Quick start script)")


def main():
    """Main function."""
    runner = SimpleAgentRunner()
    runner.save_setup_files()

    print("\n🎯 MCP Orchestrator Setup Complete!")
    print("\n📋 Next Steps:")
    print("1. Run: ./quick_start.sh")
    print("2. Follow CURSOR_SETUP.md to configure Cursor")
    print("3. Open two chat tabs and paste the prompts")
    print("4. Start the conversation!")

    print("\n📝 Prompts:")
    print("Architect:", runner.get_architect_prompt()[:100] + "...")
    print("Executor:", runner.get_executor_prompt()[:100] + "...")


if __name__ == "__main__":
    main()
