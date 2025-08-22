#!/usr/bin/env python3
"""
Enhanced Cursor Chat Automation System
Automates chat creation, prompt injection, and loop detection with comprehensive logging.
"""

import json
import logging
import os
import subprocess
import tempfile
import threading
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Optional, Callable
from uuid import uuid4

# Configure comprehensive logging
def setup_logging():
    """Setup comprehensive logging system."""
    log_format = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    
    # Create logs directory
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    
    # Configure root logger
    logging.basicConfig(
        level=logging.INFO,
        format=log_format,
        handlers=[
            logging.FileHandler(log_dir / 'cursor_automation.log'),
            logging.StreamHandler()
        ]
    )
    
    # Create specialized loggers
    automation_logger = logging.getLogger('automation')
    clipboard_logger = logging.getLogger('clipboard')
    session_logger = logging.getLogger('sessions')
    mcp_logger = logging.getLogger('mcp')
    
    # File handlers for specialized logs
    automation_logger.addHandler(logging.FileHandler(log_dir / 'automation.log'))
    clipboard_logger.addHandler(logging.FileHandler(log_dir / 'clipboard.log'))
    session_logger.addHandler(logging.FileHandler(log_dir / 'sessions.log'))
    mcp_logger.addHandler(logging.FileHandler(log_dir / 'mcp.log'))
    
    return {
        'main': logging.getLogger(__name__),
        'automation': automation_logger,
        'clipboard': clipboard_logger,
        'sessions': session_logger,
        'mcp': mcp_logger
    }

# Initialize logging
loggers = setup_logging()
logger = loggers['main']


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
    status: str = "running"  # running, completed, failed, looped, timeout
    error_count: int = 0
    last_error: Optional[str] = None


@dataclass
class AutomationConfig:
    """Configuration for chat automation."""
    max_iterations: int = 30
    loop_detection_threshold: int = 3
    inactivity_timeout: int = 300  # 5 minutes
    check_interval: int = 10  # seconds
    cursor_workspace: str = None
    enable_gui_automation: bool = True
    log_level: str = "INFO"


class EnhancedCursorAutomation:
    """Enhanced automation system with comprehensive logging and error handling."""
    
    def __init__(self, config: AutomationConfig):
        self.config = config
        self.sessions: Dict[str, ChatSession] = {}
        self.mcp_bus = None
        self.running = False
        self._lock = threading.RLock()
        self._setup_environment()
        
        logger.info("🚀 Enhanced Cursor Automation System initialized")
        logger.info(f"Configuration: {self.config}")
        
    def _setup_environment(self):
        """Setup and validate environment."""
        env_info = {
            'os': os.name,
            'display': os.environ.get('DISPLAY', 'None'),
            'wsl': self._is_wsl_environment(),
            'xauthority': os.environ.get('XAUTHORITY', 'None'),
            'cursor_cmd': self._find_cursor_command()
        }
        
        logger.info(f"Environment info: {env_info}")
        loggers['automation'].info(f"Environment setup: {json.dumps(env_info, indent=2)}")
        
    def _is_wsl_environment(self) -> bool:
        """Detect if running in WSL."""
        try:
            with open('/proc/version', 'r') as f:
                content = f.read().lower()
                is_wsl = 'microsoft' in content or 'wsl' in content
                logger.debug(f"WSL detection: {is_wsl}")
                return is_wsl
        except Exception as e:
            logger.debug(f"WSL detection failed: {e}")
            return False
    
    def connect_to_mcp(self, bus_instance):
        """Connect to MCP message bus for coordination."""
        self.mcp_bus = bus_instance
        loggers['mcp'].info("Connected to MCP message bus")
        
    def create_chat_session(self, role: str, prompt_template: str) -> str:
        """Create a new automated chat session with logging."""
        session_id = f"{role}_{int(time.time())}"
        
        session = ChatSession(
            id=session_id,
            role=role,
            prompt_template=prompt_template,
            started_at=time.time(),
            last_activity=time.time()
        )
        
        with self._lock:
            self.sessions[session_id] = session
            
        loggers['sessions'].info(f"📝 Created session: {session_id}")
        loggers['sessions'].debug(f"Session details: role={role}, prompt_length={len(prompt_template)}")
        logger.info(f"✅ Session created: {session_id} ({role})")
            
        return session_id
    
    def launch_cursor_with_prompt(self, session_id: str) -> bool:
        """Launch Cursor IDE with comprehensive error handling and logging."""
        if session_id not in self.sessions:
            logger.error(f"❌ Session {session_id} not found")
            return False
            
        session = self.sessions[session_id]
        loggers['automation'].info(f"🚀 Launching Cursor for {session_id} ({session.role})")
        
        success = False
        
        try:
            # Step 1: Find and validate Cursor command
            cursor_cmd = self._find_cursor_command()
            if not cursor_cmd:
                loggers['automation'].warning("⚠️ Cursor command not found in PATH")
                self._log_cursor_installation_help()
                return False
                
            loggers['automation'].info(f"✅ Cursor command: {cursor_cmd}")
            
            # Step 2: Launch Cursor application
            success = self._launch_cursor_application(cursor_cmd, session)
            
            if success:
                # Step 3: Inject prompt
                time.sleep(2)  # Wait for Cursor to load
                self._inject_prompt_with_fallbacks(session)
                
                # Step 4: Update session
                session.last_activity = time.time()
                loggers['sessions'].info(f"✅ Session {session_id} launched successfully")
                
        except Exception as e:
            logger.error(f"❌ Failed to launch Cursor for {session_id}: {e}")
            loggers['automation'].error(f"Launch error details: {e}", exc_info=True)
            session.error_count += 1
            session.last_error = str(e)
            success = False
            
        return success
    
    def _find_cursor_command(self) -> Optional[str]:
        """Find Cursor command with extensive search."""
        possible_commands = [
            'cursor',
            'code-cursor', 
            '/usr/local/bin/cursor',
            '/opt/cursor/cursor',
            '/snap/bin/cursor',
            'C:\\Users\\%USERNAME%\\AppData\\Local\\Programs\\cursor\\Cursor.exe',
            '/Applications/Cursor.app/Contents/MacOS/Cursor'
        ]
        
        for cmd in possible_commands:
            try:
                # Expand environment variables
                expanded_cmd = os.path.expandvars(cmd)
                
                if os.path.exists(expanded_cmd):
                    loggers['automation'].debug(f"Found Cursor at: {expanded_cmd}")
                    return expanded_cmd
                    
                # Try running command to check if it's in PATH
                result = subprocess.run(
                    [cmd, '--version'], 
                    capture_output=True, 
                    timeout=5,
                    text=True
                )
                
                if result.returncode == 0:
                    loggers['automation'].debug(f"Found Cursor command: {cmd}")
                    loggers['automation'].debug(f"Version: {result.stdout.strip()}")
                    return cmd
                    
            except (subprocess.TimeoutExpired, FileNotFoundError, OSError):
                continue
                
        return None
    
    def _log_cursor_installation_help(self):
        """Log help for Cursor installation."""
        help_text = """
        Cursor IDE not found. Install from:
        
        🌐 Download: https://cursor.com
        
        📦 Installation methods:
        - Linux: Download AppImage or use package manager
        - Windows: Download installer from website  
        - macOS: Download DMG from website
        
        🔧 Manual PATH setup:
        - Add cursor command to your PATH
        - Or use full path to executable
        """
        
        loggers['automation'].info(help_text)
        logger.warning("⚠️ Cursor IDE installation required - see logs for details")
    
    def _launch_cursor_application(self, cursor_cmd: str, session: ChatSession) -> bool:
        """Launch Cursor application with workspace."""
        try:
            cmd_args = [cursor_cmd]
            
            if self.config.cursor_workspace and os.path.exists(self.config.cursor_workspace):
                cmd_args.append(self.config.cursor_workspace)
                loggers['automation'].info(f"📁 Opening workspace: {self.config.cursor_workspace}")
            else:
                loggers['automation'].info("📁 Opening Cursor without specific workspace")
            
            # Launch with proper environment
            env = os.environ.copy()
            
            # Handle display issues in headless/WSL environments
            if not env.get('DISPLAY') and self._is_wsl_environment():
                env['DISPLAY'] = ':0'
                loggers['automation'].debug("Set DISPLAY=:0 for WSL")
            
            result = subprocess.run(
                cmd_args,
                env=env,
                capture_output=True,
                text=True,
                timeout=15
            )
            
            loggers['automation'].debug(f"Cursor launch - Return code: {result.returncode}")
            if result.stdout:
                loggers['automation'].debug(f"Cursor stdout: {result.stdout}")
            if result.stderr:
                loggers['automation'].debug(f"Cursor stderr: {result.stderr}")
            
            return result.returncode == 0
            
        except subprocess.TimeoutExpired:
            loggers['automation'].warning("⚠️ Cursor launch timed out (15s)")
            return True  # Assume success, Cursor might be starting in background
        except Exception as e:
            loggers['automation'].error(f"Failed to launch Cursor: {e}")
            return False
    
    def _inject_prompt_with_fallbacks(self, session: ChatSession):
        """Inject prompt using multiple fallback methods."""
        loggers['clipboard'].info(f"💉 Injecting prompt for {session.id} ({len(session.prompt_template)} chars)")
        
        methods = [
            ("clipboard_linux", self._inject_via_clipboard_linux),
            ("clipboard_windows", self._inject_via_clipboard_windows), 
            ("file_fallback", self._inject_via_file_fallback),
            ("direct_input", self._inject_via_direct_input)
        ]
        
        for method_name, method_func in methods:
            try:
                loggers['clipboard'].debug(f"Trying method: {method_name}")
                
                if method_func(session.prompt_template):
                    loggers['clipboard'].info(f"✅ Success with method: {method_name}")
                    return
                    
            except Exception as e:
                loggers['clipboard'].warning(f"Method {method_name} failed: {e}")
                continue
        
        loggers['clipboard'].error("❌ All injection methods failed")
        self._create_manual_instruction_file(session)
    
    def _inject_via_clipboard_linux(self, prompt: str) -> bool:
        """Linux clipboard injection with multiple tools."""
        if os.name != 'posix':
            return False
            
        tools = [
            ['xclip', '-selection', 'clipboard'],
            ['xsel', '--clipboard', '--input'],
        ]
        
        # Add WSL-specific tools
        if self._is_wsl_environment():
            tools.append(['clip.exe'])
            
        for tool in tools:
            if self._try_clipboard_tool(tool, prompt):
                return self._simulate_paste_linux()
                
        return False
    
    def _try_clipboard_tool(self, tool_cmd: List[str], prompt: str) -> bool:
        """Try a specific clipboard tool."""
        try:
            env = os.environ.copy()
            
            # Handle X11 authentication issues
            if 'DISPLAY' not in env:
                env['DISPLAY'] = ':0'
            
            # Remove problematic XAUTHORITY if file doesn't exist
            xauth = env.get('XAUTHORITY')
            if xauth and not os.path.exists(xauth):
                env.pop('XAUTHORITY', None)
                loggers['clipboard'].debug(f"Removed invalid XAUTHORITY: {xauth}")
            
            process = subprocess.run(
                tool_cmd,
                input=prompt,
                text=True,
                env=env,
                capture_output=True,
                timeout=10
            )
            
            success = process.returncode == 0
            
            loggers['clipboard'].debug(f"Tool {tool_cmd[0]}: return_code={process.returncode}")
            if process.stderr:
                loggers['clipboard'].debug(f"Tool stderr: {process.stderr}")
                
            return success
            
        except (subprocess.TimeoutExpired, FileNotFoundError, OSError) as e:
            loggers['clipboard'].debug(f"Tool {tool_cmd[0]} error: {e}")
            return False
    
    def _simulate_paste_linux(self) -> bool:
        """Simulate paste operation on Linux."""
        if not self.config.enable_gui_automation:
            loggers['clipboard'].info("GUI automation disabled - manual paste required")
            return True
            
        try:
            # Try xdotool first
            if self._try_xdotool_paste():
                return True
                
            # Fall back to pyautogui
            return self._try_pyautogui_paste()
            
        except Exception as e:
            loggers['clipboard'].warning(f"Paste simulation failed: {e}")
            return False
    
    def _try_xdotool_paste(self) -> bool:
        """Try pasting with xdotool."""
        try:
            # Find Cursor window
            result = subprocess.run(
                ['xdotool', 'search', '--name', 'Cursor'],
                capture_output=True,
                text=True,
                timeout=5
            )
            
            if not result.stdout.strip():
                loggers['clipboard'].debug("No Cursor window found with xdotool")
                return False
                
            window_id = result.stdout.strip().split('\\n')[0]
            loggers['clipboard'].debug(f"Found Cursor window: {window_id}")
            
            # Activate and paste
            subprocess.run(['xdotool', 'windowactivate', window_id], timeout=2)
            time.sleep(0.5)
            subprocess.run(['xdotool', 'key', 'ctrl+l'], timeout=2)  # Focus chat
            time.sleep(0.5)
            subprocess.run(['xdotool', 'key', 'ctrl+v'], timeout=2)  # Paste
            time.sleep(0.5)
            subprocess.run(['xdotool', 'key', 'Return'], timeout=2)  # Send
            
            loggers['clipboard'].info("✅ xdotool paste completed")
            return True
            
        except (subprocess.TimeoutExpired, FileNotFoundError) as e:
            loggers['clipboard'].debug(f"xdotool paste failed: {e}")
            return False
    
    def _try_pyautogui_paste(self) -> bool:
        """Try pasting with pyautogui."""
        try:
            import pyautogui
            
            loggers['clipboard'].debug("Using pyautogui for paste simulation")
            time.sleep(1)
            pyautogui.hotkey('ctrl', 'l')  # Focus chat
            time.sleep(0.5)
            pyautogui.hotkey('ctrl', 'v')  # Paste
            time.sleep(0.5)
            pyautogui.press('enter')  # Send
            
            loggers['clipboard'].info("✅ pyautogui paste completed")
            return True
            
        except ImportError:
            loggers['clipboard'].debug("pyautogui not available")
            return False
        except Exception as e:
            loggers['clipboard'].debug(f"pyautogui paste failed: {e}")
            return False
    
    def _inject_via_clipboard_windows(self, prompt: str) -> bool:
        """Windows clipboard injection."""
        if os.name != 'nt':
            return False
            
        try:
            # Try pyperclip first
            try:
                import pyperclip
                pyperclip.copy(prompt)
                loggers['clipboard'].info("✅ Windows clipboard set via pyperclip")
            except ImportError:
                # Fall back to clip.exe
                process = subprocess.run(
                    ['clip'],
                    input=prompt,
                    text=True,
                    timeout=5
                )
                if process.returncode != 0:
                    return False
                loggers['clipboard'].info("✅ Windows clipboard set via clip.exe")
            
            # Simulate paste
            return self._simulate_paste_windows()
            
        except Exception as e:
            loggers['clipboard'].error(f"Windows clipboard injection failed: {e}")
            return False
    
    def _simulate_paste_windows(self) -> bool:
        """Simulate paste on Windows."""
        if not self.config.enable_gui_automation:
            return True
            
        try:
            import pyautogui
            import pygetwindow as gw
            
            # Find Cursor window
            cursor_windows = [w for w in gw.getAllWindows() 
                            if 'cursor' in w.title.lower()]
            
            if cursor_windows:
                window = cursor_windows[0]
                window.activate()
                time.sleep(1)
                
                # Paste sequence
                pyautogui.hotkey('ctrl', 'l')
                time.sleep(0.5)
                pyautogui.hotkey('ctrl', 'v')
                time.sleep(0.5)
                pyautogui.press('enter')
                
                loggers['clipboard'].info("✅ Windows paste simulation completed")
                return True
                
        except ImportError:
            loggers['clipboard'].debug("Windows GUI automation libraries not available")
        except Exception as e:
            loggers['clipboard'].debug(f"Windows paste simulation failed: {e}")
            
        return False
    
    def _inject_via_file_fallback(self, prompt: str) -> bool:
        """File-based fallback method."""
        try:
            prompt_file = Path(tempfile.gettempdir()) / f"cursor_prompt_{int(time.time())}.txt"
            prompt_file.write_text(prompt, encoding='utf-8')
            
            loggers['clipboard'].info(f"📄 Prompt saved to file: {prompt_file}")
            logger.info(f"💡 Manual action required: Copy content from {prompt_file} and paste in Cursor")
            
            return True
            
        except Exception as e:
            loggers['clipboard'].error(f"File fallback failed: {e}")
            return False
    
    def _inject_via_direct_input(self, prompt: str) -> bool:
        """Direct input simulation (if possible)."""
        loggers['clipboard'].debug("Direct input method not implemented")
        return False
    
    def _create_manual_instruction_file(self, session: ChatSession):
        """Create manual instruction file."""
        try:
            instructions = f"""
# Manual Setup Instructions for {session.id}

## Session Details
- ID: {session.id}
- Role: {session.role}
- Created: {time.ctime(session.started_at)}

## Steps
1. Open Cursor IDE
2. Create a new chat
3. Copy and paste the prompt below:

---
{session.prompt_template}
---

## Expected Behavior
The agent should register with MCP and begin coordination.

Generated at: {time.ctime()}
"""
            
            instruction_file = Path(f"manual_setup_{session.id}.txt")
            instruction_file.write_text(instructions)
            
            logger.warning(f"⚠️ Manual setup required - see: {instruction_file}")
            loggers['automation'].info(f"Manual instruction file created: {instruction_file}")
            
        except Exception as e:
            logger.error(f"Failed to create instruction file: {e}")
    
    def monitor_sessions(self):
        """Enhanced session monitoring with detailed logging."""
        self.running = True
        loggers['sessions'].info("🔍 Starting enhanced session monitoring...")
        
        monitoring_stats = {
            'cycles': 0,
            'active_sessions': 0,
            'completed_sessions': 0,
            'failed_sessions': 0
        }
        
        while self.running:
            try:
                current_time = time.time()
                active_sessions = []
                
                with self._lock:
                    for session_id, session in list(self.sessions.items()):
                        if session.status == "running":
                            active_sessions.append(session)
                            self._monitor_single_session(session, current_time)
                        
                monitoring_stats['cycles'] += 1
                monitoring_stats['active_sessions'] = len(active_sessions)
                
                # Log monitoring status every 5 minutes
                if monitoring_stats['cycles'] % 30 == 0:  # Every 5 minutes (10s * 30)
                    loggers['sessions'].info(f"📊 Monitoring stats: {monitoring_stats}")
                    
                    for session in active_sessions:
                        runtime = current_time - session.started_at
                        inactive = current_time - session.last_activity
                        loggers['sessions'].info(
                            f"Session {session.id}: runtime={runtime:.1f}s, "
                            f"inactive={inactive:.1f}s, errors={session.error_count}"
                        )
                
                time.sleep(self.config.check_interval)
                
            except KeyboardInterrupt:
                loggers['sessions'].info("Received interrupt - stopping monitoring...")
                self.stop_monitoring()
                break
            except Exception as e:
                loggers['sessions'].error(f"Monitoring error: {e}", exc_info=True)
                time.sleep(5)
        
        loggers['sessions'].info("🛑 Session monitoring stopped")
    
    def _monitor_single_session(self, session: ChatSession, current_time: float):
        """Monitor a single session."""
        runtime = current_time - session.started_at
        inactive_time = current_time - session.last_activity
        
        # Check for timeout
        if inactive_time > self.config.inactivity_timeout:
            session.status = "timeout"
            loggers['sessions'].warning(
                f"⏰ Session {session.id} timed out (inactive: {inactive_time:.1f}s)"
            )
            self._handle_session_timeout(session)
            return
        
        # Check for loops (if MCP available)
        if self.mcp_bus and self._detect_loop(session):
            session.loop_detected = True
            session.status = "looped"
            loggers['sessions'].warning(f"🔄 Loop detected in {session.id}")
            self._handle_loop_detection(session)
            return
        
        # Check for completion
        if self._check_completion(session):
            session.status = "completed"
            loggers['sessions'].info(f"✅ Session {session.id} completed")
            self._handle_session_completion(session)
            return
    
    def _detect_loop(self, session: ChatSession) -> bool:
        """Enhanced loop detection."""
        try:
            channel = f"{session.role}_messages"
            messages = self.mcp_bus.pull(channel, since=max(0, session.message_count - 5), limit=5)
            
            items = messages.get('items', [])
            if len(items) >= self.config.loop_detection_threshold:
                # Simple similarity check
                recent_bodies = [str(item.get('body', '')) for item in items[-3:]]
                unique_messages = len(set(recent_bodies))
                
                is_loop = unique_messages <= 1
                
                if is_loop:
                    loggers['sessions'].debug(f"Loop detected in {session.id}: {recent_bodies}")
                    
                return is_loop
                
        except Exception as e:
            loggers['mcp'].error(f"Loop detection error: {e}")
            
        return False
    
    def _check_completion(self, session: ChatSession) -> bool:
        """Check for session completion signals."""
        try:
            channel = f"{session.role}_status"
            messages = self.mcp_bus.pull(channel, since=0, limit=3)
            
            for item in messages.get('items', []):
                body = item.get('body', {})
                if isinstance(body, dict) and body.get('done') is True:
                    return True
                    
        except Exception as e:
            loggers['mcp'].error(f"Completion check error: {e}")
            
        return False
    
    def _handle_session_timeout(self, session: ChatSession):
        """Handle session timeout with detailed logging."""
        runtime = time.time() - session.started_at
        loggers['sessions'].info(
            f"⏰ Session {session.id} timeout - Runtime: {runtime:.1f}s, "
            f"Messages: {session.message_count}, Errors: {session.error_count}"
        )
        
        self._save_session_summary(session, "timeout")
    
    def _handle_loop_detection(self, session: ChatSession):
        """Handle loop detection with intervention."""
        loggers['sessions'].warning(f"🔄 Handling loop in {session.id}")
        
        # Create enhanced loop breaker
        loop_breaker = self._create_loop_breaker_prompt(session)
        
        try:
            self._inject_prompt_with_fallbacks_simple(loop_breaker)
            session.last_activity = time.time()
            session.error_count += 1
            session.last_error = "Loop detected and intervention applied"
            
        except Exception as e:
            loggers['sessions'].error(f"Failed to inject loop breaker: {e}")
    
    def _create_loop_breaker_prompt(self, session: ChatSession) -> str:
        """Create contextual loop breaker prompt."""
        runtime = time.time() - session.started_at
        
        return f"""
🔄 LOOP DETECTION ALERT - Session: {session.id}

Current Status Analysis:
- Role: {session.role}
- Runtime: {runtime:.1f} seconds ({runtime/60:.1f} minutes)
- Message Count: {session.message_count}
- Error Count: {session.error_count}
- Last Activity: {time.time() - session.last_activity:.1f} seconds ago

REQUIRED IMMEDIATE ACTIONS:
1. **STOP** current approach - it's not working
2. **SUMMARIZE** what you've tried so far
3. **IDENTIFY** the specific blocking issue
4. **PROPOSE** a completely different strategy
5. **If genuinely stuck**: Respond with [[NEEDS-HUMAN-REVIEW]]

Break this loop by changing your strategy NOW!
"""
    
    def _inject_prompt_with_fallbacks_simple(self, prompt: str):
        """Simplified prompt injection for loop breaking."""
        # Try clipboard methods only
        if os.name == 'posix':
            self._inject_via_clipboard_linux(prompt)
        elif os.name == 'nt':
            self._inject_via_clipboard_windows(prompt)
        else:
            self._inject_via_file_fallback(prompt)
    
    def _handle_session_completion(self, session: ChatSession):
        """Handle successful session completion."""
        runtime = time.time() - session.started_at
        loggers['sessions'].info(
            f"🎉 Session {session.id} completed successfully! "
            f"Runtime: {runtime:.1f}s, Messages: {session.message_count}"
        )
        
        self._save_session_summary(session, "completed")
    
    def _save_session_summary(self, session: ChatSession, final_status: str):
        """Save comprehensive session summary."""
        try:
            summary = {
                'session_id': session.id,
                'role': session.role,
                'status': final_status,
                'started_at': session.started_at,
                'ended_at': time.time(),
                'runtime_seconds': time.time() - session.started_at,
                'last_activity': session.last_activity,
                'message_count': session.message_count,
                'loop_detected': session.loop_detected,
                'error_count': session.error_count,
                'last_error': session.last_error,
                'prompt_length': len(session.prompt_template)
            }
            
            summary_file = Path(f"session_summary_{session.id}_{final_status}.json")
            summary_file.write_text(json.dumps(summary, indent=2))
            
            loggers['sessions'].info(f"💾 Session summary saved: {summary_file}")
            
        except Exception as e:
            loggers['sessions'].error(f"Failed to save session summary: {e}")
    
    def stop_monitoring(self):
        """Stop monitoring with cleanup."""
        self.running = False
        loggers['sessions'].info("Stopping monitoring and cleaning up...")
        
        # Save all active session summaries
        with self._lock:
            for session in self.sessions.values():
                if session.status == "running":
                    session.status = "interrupted"
                    self._save_session_summary(session, "interrupted")
    
    def get_detailed_status(self) -> Dict:
        """Get comprehensive status report."""
        current_time = time.time()
        
        status = {
            'automation_system': {
                'running': self.running,
                'config': self.config.__dict__,
                'session_count': len(self.sessions)
            },
            'sessions': {},
            'environment': {
                'os': os.name,
                'wsl': self._is_wsl_environment(),
                'display': os.environ.get('DISPLAY'),
                'cursor_found': self._find_cursor_command() is not None
            }
        }
        
        for session_id, session in self.sessions.items():
            status['sessions'][session_id] = {
                'id': session.id,
                'role': session.role,
                'status': session.status,
                'runtime': current_time - session.started_at,
                'inactive_time': current_time - session.last_activity,
                'message_count': session.message_count,
                'error_count': session.error_count,
                'loop_detected': session.loop_detected
            }
        
        return status


if __name__ == "__main__":
    # Example usage with comprehensive logging
    config = AutomationConfig(
        cursor_workspace="/home/alex/projects/fin-model",
        enable_gui_automation=True,
        log_level="DEBUG"
    )
    
    automation = EnhancedCursorAutomation(config)
    
    # Test session creation
    test_session = automation.create_chat_session(
        "test_agent",
        "Test prompt for logging validation"
    )
    
    print("Enhanced automation system ready!")
    print("Check logs/ directory for detailed logging output.")
    print(f"Test session created: {test_session}")