# Compact MCP Orchestrator

Ultra-lightweight, persistent message bus for AI agent coordination with SQLite storage.

## 🎯 Goal

Run agent orchestrator and automatically create chats with prompts in Cursor UI.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install mcp
```

### 2. Configure Cursor
Add to `~/.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "orchestrator": {
      "command": "python",
      "args": ["/absolute/path/to/.mcp-server/mcp_server.py"]
    }
  }
}
```

### 3. Start Server
```bash
python mcp_server.py
```

### 4. Create Two Chat Tabs

**Tab A (Architect):**
- Open new chat in Cursor
- Set MCP server to "orchestrator"
- Paste the architect prompt (see CURSOR_SETUP.md)

**Tab B (Executor):**
- Open new chat in Cursor
- Set MCP server to "orchestrator"  
- Paste the executor prompt (see CURSOR_SETUP.md)

### 5. Start Conversation
In Tab A, send: "I need to set up the orchestrator system and create a simple calculator function with tests. Let me start by registering as the architect agent."

## 📁 Project Structure

```
.mcp-server/
├── mcp_server.py         # Core MCP server
├── agent_runner.py       # Agent setup utilities
├── requirements.txt      # Dependencies
├── README.md            # This file
├── CURSOR_SETUP.md      # Detailed setup guide
└── quick_start.sh       # Quick start script
```

## 🔧 Available Tools

- `register_agent` - Register an agent with channel access control
- `post` - Post a message to a channel (with authorization)
- `pull` - Pull messages from a channel (paginated, max 100)
- `list_channels` - List all channels

## 🗄️ Storage

- **SQLite persistence** - Messages survive restarts
- **Automatic cleanup** - Old messages removed after 24h
- **Channel access control** - Agents can only access registered channels
- **Performance optimized** - Indexed queries, connection pooling

## 📊 Resources

- `chan://a2e` - Architect to Executor messages
- `chan://e2a` - Executor to Architect messages

## 🎯 Example Workflow

1. **Architect registers** → `register_agent(name="architect", channels=["a2e", "e2a"])`
2. **Executor registers** → `register_agent(name="executor", channels=["a2e", "e2a"])`
3. **Architect posts task** → `post(channel="a2e", sender="architect", body={...})`
4. **Executor pulls task** → `pull(channel="a2e", since=0, limit=1)`
5. **Executor posts result** → `post(channel="e2a", sender="executor", body={...})`
6. **Architect pulls result** → `pull(channel="e2a", since=0, limit=1)`

## 🚨 Troubleshooting

**Server won't start:**
- Check Python version (3.8+)
- Install: `pip install mcp`
- Verify file paths in MCP config

**Agents can't communicate:**
- Both agents must register with same channels
- Check channel names match exactly
- Verify agent has channel access

**Authorization errors:**
- Agent must register before posting
- Channel must be in agent's registered channels
- Check agent name matches exactly

## 🎉 Success!

When working correctly, you'll see:
- Agents registering successfully
- Messages persisting across restarts
- Access control preventing unauthorized posts
- Automatic cleanup of old messages
- Optimized performance with SQLite indexes

The system is compact, secure, and scalable!

## 📖 Documentation

- `CURSOR_SETUP.md` - Detailed setup instructions with prompts
- `README_SIMPLE.md` - Extended documentation
