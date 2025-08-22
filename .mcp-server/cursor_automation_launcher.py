#!/usr/bin/env python3
"""
Cursor Automation Launcher
Usage: python cursor_automation_launcher.py
"""

from cursor_automation import CursorAutomation, AutomationConfig
import threading
import time

# Agent prompts
ARCHITECT_PROMPT = """ROLE: Architect Agent - Plan and coordinate development tasks.
Register with MCP: register_agent(name="architect", channels=["a2e", "e2a"])
Break down requests into micro-tasks and coordinate with executor.

PROTOCOL:
- Use post(channel="a2e", sender="architect", body=<envelope>) to send tasks
- Use pull(channel="e2a") to get responses
- End each message with [[END-OF-TURN]]

ENVELOPE FORMAT:
{
  "from": "architect",
  "task_id": "T-001", 
  "intent": "plan|review|question|finalize",
  "micro_task": "specific actionable step",
  "acceptance_criteria": "how to verify success",
  "max_turns": 30
}
"""

EXECUTOR_PROMPT = """ROLE: Executor Agent - Implement development tasks.
Register with MCP: register_agent(name="executor", channels=["a2e", "e2a"]) 
Execute micro-tasks safely and report results.

PROTOCOL:
- Use pull(channel="a2e") to get tasks from architect
- Use post(channel="e2a", sender="executor", body=<envelope>) to send results
- End each message with [[END-OF-TURN]]

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
  "done": false
}
"""


def main():
    print("🚀 Cursor Automation Launcher")
    print("=" * 40)

    # Configure automation
    config = AutomationConfig(
        max_iterations=30,
        loop_detection_threshold=3,
        inactivity_timeout=300,
        cursor_workspace="/home/alex/projects/fin-model",  # Update this path
    )

    # Create automation system
    automation = CursorAutomation(config)

    print("📋 Configuration:")
    print(f"  - Max iterations: {config.max_iterations}")
    print(f"  - Loop threshold: {config.loop_detection_threshold}")
    print(f"  - Timeout: {config.inactivity_timeout}s")
    print(f"  - Workspace: {config.cursor_workspace}")

    # Create chat sessions
    print("\n🎭 Creating agent sessions...")
    arch_session = automation.create_chat_session(
        "architect", ARCHITECT_PROMPT
    )
    exec_session = automation.create_chat_session(
        "executor", EXECUTOR_PROMPT
    )

    print(f"  ✅ Architect session: {arch_session}")
    print(f"  ✅ Executor session: {exec_session}")

    # Launch Cursor with prompts
    print("\n🔄 Launching Cursor instances...")

    print("  → Launching architect chat...")
    arch_success = automation.launch_cursor_with_prompt(arch_session)
    if arch_success:
        print("    ✅ Architect chat launched")
    else:
        print("    ⚠️  Manual setup required for architect")

    time.sleep(3)  # Wait between launches

    print("  → Launching executor chat...")
    exec_success = automation.launch_cursor_with_prompt(exec_session)
    if exec_success:
        print("    ✅ Executor chat launched")
    else:
        print("    ⚠️  Manual setup required for executor")

    # Start monitoring in background
    print("\n👁️  Starting session monitoring...")
    monitor_thread = threading.Thread(target=automation.monitor_sessions)
    monitor_thread.daemon = True
    monitor_thread.start()

    print("✅ Automation system running!")
    print("\n💡 Next steps:")
    if not (arch_success and exec_success):
        print("  1. Open Cursor manually")
        print("  2. Create new chat tabs")
        print("  3. Paste the prompts (copied to clipboard)")
        print(
            "  4. Start conversation with: 'Register with MCP and begin coordination'"
        )
    else:
        print("  1. Chats should be opening automatically")
        print("  2. Agents will register and begin coordination")
        print("  3. Monitor progress below")

    print("\n📊 Monitoring (Press Ctrl+C to stop):")
    print("-" * 50)

    try:
        while True:
            # Show status every 30 seconds
            time.sleep(30)
            sessions = automation.list_active_sessions()

            print(
                f"\n[{time.strftime('%H:%M:%S')}] Active sessions: {len(sessions)}"
            )
            for session in sessions:
                status_icon = {
                    "running": "🔄",
                    "completed": "✅",
                    "failed": "❌",
                    "looped": "🔄",
                    "timeout": "⏰",
                }.get(session["status"], "❓")

                print(
                    f"  {status_icon} {session['id']}: {session['status']} "
                    f"({session['runtime']:.1f}s, {session['message_count']} msgs)"
                )

                if session["loop_detected"]:
                    print(f"    ⚠️  Loop detected - intervention applied")

    except KeyboardInterrupt:
        print("\n\n🛑 Stopping automation...")
        automation.stop_monitoring()
        print("✅ Automation stopped cleanly")


def show_help():
    """Show usage help."""
    print(
        """
Cursor Automation Launcher Help
==============================

USAGE:
    python cursor_automation_launcher.py

REQUIREMENTS:
    # Linux
    sudo apt install xdotool xclip
    pip install pyautogui pyperclip
    
    # Windows  
    pip install pyautogui pygetwindow pyperclip

CONFIGURATION:
    Edit cursor_workspace path in this script:
    cursor_workspace="/path/to/your/project"

TROUBLESHOOTING:
    - If automation fails, manual setup instructions will be shown
    - Check that Cursor is installed and accessible via 'cursor' command
    - Ensure MCP server is running: python mcp_server.py
    - Grant accessibility permissions on macOS
    
MONITORING:
    - Status updates every 30 seconds
    - Loop detection and intervention
    - Automatic timeout handling
    - Session completion tracking
    """
    )


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1 and sys.argv[1] in ["--help", "-h", "help"]:
        show_help()
    else:
        main()
