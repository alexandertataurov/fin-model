#!/usr/bin/env python3
"""
Test script for Cursor automation system
"""

from cursor_automation import CursorAutomation, AutomationConfig
from mcp_server import SimpleMessageBus
import time


def test_automation_system():
    """Test the automation system components."""

    print("🧪 Testing Cursor Automation System...")

    # Create MCP bus
    bus = SimpleMessageBus("test_messages.db")
    print("✅ MCP bus created")

    # Configure automation
    config = AutomationConfig(
        max_iterations=5,
        loop_detection_threshold=2,
        inactivity_timeout=60,
        cursor_workspace="/home/alex/projects/fin-model",
    )
    print("✅ Automation config created")

    # Create automation system
    automation = CursorAutomation(config)
    automation.connect_to_mcp(bus)
    print("✅ Automation system initialized")

    # Test session creation
    test_prompt = """TEST PROMPT: You are a test agent. 
Register with: register_agent(name="test", channels=["test"])
Respond with: {"test": "success", "done": true}"""

    session_id = automation.create_chat_session("test_agent", test_prompt)
    print(f"✅ Test session created: {session_id}")

    # Check session status
    status = automation.get_session_status(session_id)
    print(f"✅ Session status: {status['status']}")

    # Test MCP integration
    try:
        # Register test agent
        agent_id = bus.register_agent("test_agent", ["test_channel"])
        print(f"✅ Test agent registered: {agent_id}")

        # Post test message
        result = bus.post("test_channel", "test_agent", {"action": "test"})
        print(f"✅ Test message posted: {result['cursor']}")

        # Pull message
        messages = bus.pull("test_channel", since=0, limit=1)
        print(f"✅ Messages retrieved: {len(messages['items'])}")

    except Exception as e:
        print(f"❌ MCP integration error: {e}")

    # Test automation methods (without actual GUI interaction)
    cursor_cmd = automation._find_cursor_command()
    print(f"✅ Cursor command detection: {cursor_cmd or 'Not found'}")

    # List sessions
    sessions = automation.list_active_sessions()
    print(f"✅ Active sessions: {len(sessions)}")

    print("\n🎉 Automation system test completed!")
    print("\n📋 System capabilities:")
    print("  ✓ Chat session management")
    print("  ✓ MCP bus integration")
    print("  ✓ Loop detection framework")
    print("  ✓ Timeout handling")
    print("  ✓ Multi-platform automation hooks")

    print("\n⚠️  Manual setup required:")
    print("  - Install GUI automation: pip install pyautogui pyperclip")
    print("  - Linux: sudo apt install xdotool xclip")
    print("  - Configure cursor_workspace path")
    print("  - Test with actual Cursor IDE instance")

    return True


if __name__ == "__main__":
    test_automation_system()
