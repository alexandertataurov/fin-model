# Cursor UI Automation System

Comprehensive solution for automatically starting Cursor chats, injecting prompts, and detecting conversation loops.

## 🎯 Overview

The automation system provides:
- **Automated chat creation** - Programmatically launch Cursor with pre-configured prompts
- **Multi-platform support** - Works on Linux, Windows, macOS
- **Loop detection** - Identifies and breaks conversation loops
- **Session monitoring** - Tracks chat progress and timeouts
- **MCP integration** - Coordinates with your orchestrator system

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ cursor_automation│    │   mcp_server     │    │  Cursor IDE     │
│                 │◄──►│                  │◄──►│                 │
│ • Session mgmt  │    │ • Message bus    │    │ • Chat UI       │
│ • Loop detection│    │ • Agent coord    │    │ • Agent prompts │
│ • GUI automation│    │ • Persistence    │    │ • Background    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### 1. Install Dependencies

**Linux:**
```bash
sudo apt install xdotool xclip
pip install pyautogui pyperclip
```

**Windows:**
```bash
pip install pyautogui pygetwindow pyperclip
```

**macOS:**
```bash
pip install pyautogui pyperclip
# Grant accessibility permissions to Terminal/Python
```

### 2. Configure Automation

Edit `cursor_automation_launcher.py`:
```python
config = AutomationConfig(
    max_iterations=30,
    loop_detection_threshold=3,
    inactivity_timeout=300,
    cursor_workspace="/path/to/your/project"  # ← Set your project path
)
```

### 3. Run Automation

```bash
# Test the system
python test_automation.py

# Launch automated sessions
python cursor_automation_launcher.py
```

## 🔧 Automation Methods

### Method 1: Cursor CLI + Clipboard
1. Launches Cursor via command line
2. Injects prompts via clipboard + keyboard shortcuts
3. Most reliable across platforms

### Method 2: Window Automation
**Linux (xdotool):**
- Finds Cursor window by name
- Sends keyboard shortcuts directly
- Types prompts character by character

**Windows (pyautogui):**
- Finds Cursor via window titles
- Uses GUI automation for keyboard input
- Supports window activation and focus

### Method 3: Manual Fallback
- Copies prompt to clipboard
- User manually pastes in Cursor
- System monitors via MCP messages

## 🔍 Loop Detection

The system detects conversation loops through:

### Message Pattern Analysis
```python
# Detects repeated similar messages
recent_msgs = [msg['body'] for msg in messages[-3:]]
if len(set(str(msg) for msg in recent_msgs)) <= 1:
    return True  # Loop detected
```

### Loop Intervention
When a loop is detected:
1. System injects loop-breaking prompt
2. Asks agents to summarize progress
3. Requests alternative approach
4. Escalates to human review if needed

### Loop-Breaking Prompt
```
LOOP DETECTED: You seem to be repeating the same actions. 
Please:
1. Summarize current progress
2. Identify the blocking issue  
3. Propose a different approach
4. If stuck, mark as [[NEEDS-HUMAN-REVIEW]]
```

## 📊 Session Monitoring

### Automatic Monitoring
- **Inactivity timeout** (default: 5 minutes)
- **Message count tracking**
- **Loop detection** (3+ repeated patterns)
- **Completion signals** from MCP

### Status Tracking
```python
{
    'id': 'architect_1755852212',
    'role': 'architect', 
    'status': 'running',  # running, completed, failed, looped, timeout
    'started_at': 1755852212.0,
    'last_activity': 1755852242.0,
    'message_count': 12,
    'loop_detected': False,
    'runtime': 30.0
}
```

## 🎭 Agent Coordination

### Multi-Agent Workflow
1. **Architect Agent**
   - Plans and decomposes tasks
   - Posts to `a2e` channel
   - Monitors `e2a` for results

2. **Executor Agent** 
   - Pulls tasks from `a2e`
   - Executes micro-tasks safely
   - Reports to `e2a` channel

3. **Automation System**
   - Launches both agents simultaneously
   - Monitors conversation flow
   - Intervenes on loops or timeouts

### Example Automated Session
```python
# Create architect session
arch_session = automation.create_chat_session(
    "architect", 
    ARCHITECT_PROMPT
)

# Create executor session  
exec_session = automation.create_chat_session(
    "executor",
    EXECUTOR_PROMPT
)

# Launch Cursor instances
automation.launch_cursor_with_prompt(arch_session)
automation.launch_cursor_with_prompt(exec_session)

# Monitor automatically
automation.monitor_sessions()
```

## ⚙️ Configuration Options

### AutomationConfig Parameters
```python
@dataclass
class AutomationConfig:
    max_iterations: int = 30           # Max conversation turns
    loop_detection_threshold: int = 3  # Messages to detect loop
    inactivity_timeout: int = 300      # Timeout in seconds
    check_interval: int = 10           # Monitoring frequency
    cursor_workspace: str = None       # Project workspace path
```

### Platform-Specific Settings
```python
# Linux
CURSOR_CMD = 'cursor'
CLIPBOARD_CMD = ['xclip', '-selection', 'clipboard']
AUTOMATION_TOOL = 'xdotool'

# Windows  
CURSOR_CMD = 'cursor.exe'
CLIPBOARD_LIB = 'pyperclip'
AUTOMATION_LIB = 'pyautogui'

# macOS
CURSOR_CMD = '/Applications/Cursor.app/Contents/MacOS/Cursor'
CLIPBOARD_CMD = 'pbcopy'
AUTOMATION_LIB = 'pyautogui'
```

## 🛡️ Safety Features

### Timeout Protection
- Sessions automatically timeout after inactivity
- Prevents infinite loops or stuck conversations
- Configurable timeout durations

### Loop Prevention
- Pattern-based detection
- Automatic intervention prompts
- Human escalation when needed

### Resource Management
- Limited concurrent sessions
- Database cleanup and optimization
- Memory-efficient message storage

## 🔬 Testing & Debugging

### Test System Components
```bash
# Test core automation
python test_automation.py

# Test MCP integration
python mcp_server.py &
python -c "from mcp_server import bus; print(bus.list_channels())"

# Test GUI automation (manual)
python -c "from cursor_automation import CursorAutomation; 
           CursorAutomation({}).launch_cursor_with_prompt('test')"
```

### Debug Modes
```python
# Enable verbose logging
import logging
logging.basicConfig(level=logging.DEBUG)

# Test without GUI
automation.dry_run = True

# Monitor MCP messages
bus.post("debug", "system", {"event": "test"})
messages = bus.pull("debug", since=0, limit=10)
```

## 📈 Production Deployment

### Requirements
- Cursor IDE installed and configured
- MCP server running (`python mcp_server.py`)
- GUI automation libraries installed
- Proper workspace permissions

### Scaling Considerations
- One automation instance per project
- Multiple agent sessions per instance
- SQLite handles concurrent access
- Monitor system resources

### Integration Points
- **CI/CD pipelines** - Trigger on code changes
- **Issue trackers** - Auto-start from tickets
- **Slack/Discord** - Command-based activation
- **Webhooks** - External system triggers

## 🎉 Success Metrics

When working correctly, you'll see:
- ✅ Cursor instances launching automatically
- ✅ Prompts injected and conversations starting
- ✅ Agents communicating via MCP channels
- ✅ Loop detection preventing infinite cycles
- ✅ Sessions completing with measurable outcomes
- ✅ Automatic cleanup and resource management

The system transforms manual Cursor interactions into **fully automated, monitored workflows** perfect for development team productivity!

## 🔗 Related Files

- `cursor_automation.py` - Core automation system
- `mcp_server.py` - Message bus and coordination
- `test_automation.py` - System testing and validation
- `cursor_automation_launcher.py` - Ready-to-run automation script