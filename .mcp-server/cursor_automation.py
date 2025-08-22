#!/usr/bin/env python3
"""
Cursor Chat Automation System
Automates chat creation, prompt injection, and loop detection in Cursor IDE.
"""

import json
import subprocess
import time
import os
import threading
from dataclasses import dataclass
from typing import Dict, List, Optional, Callable
from pathlib import Path


@dataclass
class ChatSession:
    """Represents an automated chat session."""

    id: str
    role: str  # architect, executor, reviewer
    prompt_template: str
    started_at: float
    last_activity: float
    message_count: int = 0
    loop_detected: bool = False
    status: str = "running"  # running, completed, failed, looped


@dataclass
class AutomationConfig:
    """Configuration for chat automation."""

    max_iterations: int = 30
    loop_detection_threshold: int = 3
    inactivity_timeout: int = 300  # 5 minutes
    check_interval: int = 10  # seconds
    cursor_workspace: str = None


class CursorAutomation:
    """Automates Cursor IDE chat interactions."""

    def __init__(self, config: AutomationConfig):
        self.config = config
        self.sessions: Dict[str, ChatSession] = {}
        self.mcp_bus = None
        self.running = False
        self._lock = threading.RLock()

    def connect_to_mcp(self, bus_instance):
        """Connect to MCP message bus for coordination."""
        self.mcp_bus = bus_instance

    def create_chat_session(self, role: str, prompt_template: str) -> str:
        """Create a new automated chat session."""
        session_id = f"{role}_{int(time.time())}"

        session = ChatSession(
            id=session_id,
            role=role,
            prompt_template=prompt_template,
            started_at=time.time(),
            last_activity=time.time(),
        )

        with self._lock:
            self.sessions[session_id] = session

        return session_id

    def launch_cursor_with_prompt(self, session_id: str) -> bool:
        """Launch Cursor IDE with automated prompt injection."""
        if session_id not in self.sessions:
            return False

        session = self.sessions[session_id]

        try:
            # Method 1: Try using Cursor CLI if available
            cursor_cmd = self._find_cursor_command()
            if cursor_cmd:
                # Open workspace with Cursor
                if self.config.cursor_workspace:
                    subprocess.run(
                        [cursor_cmd, self.config.cursor_workspace],
                        check=False,
                        timeout=10,
                    )

                # Wait for Cursor to load
                time.sleep(3)

                # Inject prompt via clipboard and keyboard automation
                self._inject_prompt_via_clipboard(session.prompt_template)
                return True

        except Exception as e:
            print(f"Failed to launch Cursor: {e}")
            return False

        # Method 2: Use system-specific automation
        return self._inject_prompt_system_specific(session)

    def _find_cursor_command(self) -> Optional[str]:
        """Find Cursor command in system PATH."""
        for cmd in ["cursor", "code-cursor", "/usr/local/bin/cursor"]:
            try:
                subprocess.run(
                    [cmd, "--version"], capture_output=True, timeout=5
                )
                return cmd
            except (subprocess.TimeoutExpired, FileNotFoundError):
                continue
        return None

    def _inject_prompt_via_clipboard(self, prompt: str):
        """Inject prompt using clipboard and keyboard automation."""
        try:
            # Copy prompt to clipboard
            if os.name == "posix":  # Linux/macOS
                process = subprocess.Popen(
                    ["xclip", "-selection", "clipboard"],
                    stdin=subprocess.PIPE,
                    text=True,
                )
                process.communicate(input=prompt)
            elif os.name == "nt":  # Windows
                import pyperclip

                pyperclip.copy(prompt)

            # Simulate keyboard shortcuts (requires pyautogui)
            try:
                import pyautogui

                time.sleep(1)
                pyautogui.hotkey("ctrl", "l")  # Focus chat
                time.sleep(0.5)
                pyautogui.hotkey("ctrl", "v")  # Paste
                time.sleep(0.5)
                pyautogui.press("enter")  # Send
            except ImportError:
                print(
                    "pyautogui not available - manual prompt injection needed"
                )

        except Exception as e:
            print(f"Clipboard injection failed: {e}")

    def _inject_prompt_system_specific(self, session: ChatSession) -> bool:
        """Platform-specific prompt injection methods."""
        if os.name == "posix":
            return self._inject_prompt_linux(session)
        elif os.name == "nt":
            return self._inject_prompt_windows(session)
        return False

    def _inject_prompt_linux(self, session: ChatSession) -> bool:
        """Linux-specific automation using xdotool."""
        try:
            # Find Cursor window
            result = subprocess.run(
                ["xdotool", "search", "--name", "Cursor"],
                capture_output=True,
                text=True,
            )
            if result.stdout.strip():
                window_id = result.stdout.strip().split("\n")[0]

                # Activate window
                subprocess.run(["xdotool", "windowactivate", window_id])
                time.sleep(1)

                # Open chat (Cmd+L or Ctrl+L)
                subprocess.run(["xdotool", "key", "ctrl+l"])
                time.sleep(0.5)

                # Type prompt
                subprocess.run(
                    ["xdotool", "type", session.prompt_template]
                )
                time.sleep(0.5)

                # Send
                subprocess.run(["xdotool", "key", "Return"])
                return True

        except (subprocess.CalledProcessError, FileNotFoundError):
            print(
                "xdotool not available - install with: sudo apt install xdotool"
            )

        return False

    def _inject_prompt_windows(self, session: ChatSession) -> bool:
        """Windows-specific automation."""
        try:
            import pyautogui
            import pygetwindow as gw

            # Find Cursor window
            cursor_windows = [
                w
                for w in gw.getAllWindows()
                if "cursor" in w.title.lower()
            ]

            if cursor_windows:
                window = cursor_windows[0]
                window.activate()
                time.sleep(1)

                # Open chat
                pyautogui.hotkey("ctrl", "l")
                time.sleep(0.5)

                # Type and send prompt
                pyautogui.write(session.prompt_template)
                time.sleep(0.5)
                pyautogui.press("enter")
                return True

        except ImportError:
            print("Install: pip install pyautogui pygetwindow")
        except Exception as e:
            print(f"Windows automation failed: {e}")

        return False

    def monitor_sessions(self):
        """Monitor all active chat sessions for loops and completion."""
        self.running = True

        while self.running:
            try:
                current_time = time.time()

                with self._lock:
                    for session_id, session in list(self.sessions.items()):
                        if session.status != "running":
                            continue

                        # Check for inactivity timeout
                        if (
                            current_time - session.last_activity
                            > self.config.inactivity_timeout
                        ):
                            session.status = "timeout"
                            self._handle_session_timeout(session)

                        # Check for loop detection via MCP
                        if self.mcp_bus and self._detect_loop(session):
                            session.loop_detected = True
                            session.status = "looped"
                            self._handle_loop_detection(session)

                        # Check for completion
                        if self._check_completion(session):
                            session.status = "completed"
                            self._handle_session_completion(session)

                time.sleep(self.config.check_interval)

            except KeyboardInterrupt:
                self.stop_monitoring()
                break
            except Exception as e:
                print(f"Monitoring error: {e}")
                time.sleep(5)

    def _detect_loop(self, session: ChatSession) -> bool:
        """Detect conversation loops via MCP message analysis."""
        if not self.mcp_bus:
            return False

        try:
            # Pull recent messages from session's channels
            channel = f"{session.role}_loop_detection"
            messages = self.mcp_bus.pull(channel, since=0, limit=10)

            # Simple loop detection: repeated similar messages
            if (
                len(messages.get("items", []))
                >= self.config.loop_detection_threshold
            ):
                recent_msgs = [
                    msg["body"] for msg in messages["items"][-3:]
                ]
                # Check for similarity (simplified)
                if len(set(str(msg) for msg in recent_msgs)) <= 1:
                    return True

        except Exception as e:
            print(f"Loop detection error: {e}")

        return False

    def _check_completion(self, session: ChatSession) -> bool:
        """Check if session has completed successfully."""
        if not self.mcp_bus:
            return False

        try:
            # Look for completion signals in MCP messages
            channel = f"{session.role}_completion"
            messages = self.mcp_bus.pull(channel, since=0, limit=5)

            for msg in messages.get("items", []):
                if isinstance(msg.get("body"), dict):
                    if msg["body"].get("done") is True:
                        return True

        except Exception as e:
            print(f"Completion check error: {e}")

        return False

    def _handle_session_timeout(self, session: ChatSession):
        """Handle session timeout."""
        print(f"Session {session.id} timed out after inactivity")

    def _handle_loop_detection(self, session: ChatSession):
        """Handle detected conversation loop."""
        print(f"Loop detected in session {session.id} - intervening")

        # Inject loop-breaking prompt
        loop_breaker = """
        LOOP DETECTED: You seem to be repeating the same actions. 
        Please:
        1. Summarize current progress
        2. Identify the blocking issue  
        3. Propose a different approach
        4. If stuck, mark as [[NEEDS-HUMAN-REVIEW]]
        """

        try:
            self._inject_prompt_via_clipboard(loop_breaker)
        except Exception as e:
            print(f"Failed to inject loop breaker: {e}")

    def _handle_session_completion(self, session: ChatSession):
        """Handle successful session completion."""
        print(f"Session {session.id} completed successfully")

    def stop_monitoring(self):
        """Stop the monitoring loop."""
        self.running = False

    def get_session_status(self, session_id: str) -> Optional[Dict]:
        """Get current status of a session."""
        if session_id not in self.sessions:
            return None

        session = self.sessions[session_id]
        return {
            "id": session.id,
            "role": session.role,
            "status": session.status,
            "started_at": session.started_at,
            "last_activity": session.last_activity,
            "message_count": session.message_count,
            "loop_detected": session.loop_detected,
            "runtime": time.time() - session.started_at,
        }

    def list_active_sessions(self) -> List[Dict]:
        """List all active sessions."""
        with self._lock:
            return [
                self.get_session_status(sid)
                for sid in self.sessions.keys()
            ]


def create_automation_script() -> str:
    """Create a standalone automation script."""
    return '''#!/usr/bin/env python3
"""
Cursor Automation Launcher
Usage: python cursor_automation_launcher.py
"""

from cursor_automation import CursorAutomation, AutomationConfig, ChatSession
import threading
import time

# Agent prompts
ARCHITECT_PROMPT = """ROLE: Architect Agent - Plan and coordinate development tasks.
Register with MCP: register_agent(name="architect", channels=["a2e", "e2a"])
Break down requests into micro-tasks and coordinate with executor.
"""

EXECUTOR_PROMPT = """ROLE: Executor Agent - Implement development tasks.
Register with MCP: register_agent(name="executor", channels=["a2e", "e2a"]) 
Execute micro-tasks safely and report results.
"""

def main():
    # Configure automation
    config = AutomationConfig(
        max_iterations=30,
        loop_detection_threshold=3,
        inactivity_timeout=300,
        cursor_workspace="/path/to/your/project"
    )
    
    # Create automation system
    automation = CursorAutomation(config)
    
    # Create chat sessions
    arch_session = automation.create_chat_session("architect", ARCHITECT_PROMPT)
    exec_session = automation.create_chat_session("executor", EXECUTOR_PROMPT)
    
    print(f"Created sessions: {arch_session}, {exec_session}")
    
    # Launch Cursor with prompts
    print("Launching Cursor with architect prompt...")
    automation.launch_cursor_with_prompt(arch_session)
    
    time.sleep(5)
    
    print("Launching Cursor with executor prompt...")
    automation.launch_cursor_with_prompt(exec_session)
    
    # Start monitoring in background
    monitor_thread = threading.Thread(target=automation.monitor_sessions)
    monitor_thread.daemon = True
    monitor_thread.start()
    
    print("Automation system running. Press Ctrl+C to stop.")
    
    try:
        while True:
            # Show status every 30 seconds
            time.sleep(30)
            sessions = automation.list_active_sessions()
            print(f"Active sessions: {len(sessions)}")
            for session in sessions:
                print(f"  {session['id']}: {session['status']} "
                      f"({session['runtime']:.1f}s)")
                      
    except KeyboardInterrupt:
        print("Stopping automation...")
        automation.stop_monitoring()

if __name__ == "__main__":
    main()
'''


if __name__ == "__main__":
    # Create launcher script
    script_content = create_automation_script()
    with open("cursor_automation_launcher.py", "w") as f:
        f.write(script_content)

    print("✅ Cursor automation system created!")
    print("📋 Features:")
    print("  - Automated chat session creation")
    print("  - Prompt injection via multiple methods")
    print("  - Loop detection and intervention")
    print("  - Session monitoring and timeout handling")
    print("  - MCP integration for coordination")

    print("\n🔧 Requirements:")
    print("  pip install pyautogui pygetwindow pyperclip  # Windows")
    print("  sudo apt install xdotool xclip              # Linux")

    print("\n🚀 Usage:")
    print("  python cursor_automation_launcher.py")
