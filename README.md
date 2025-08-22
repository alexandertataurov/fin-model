# Financial Model Project

A comprehensive financial modeling platform with AI-powered analysis and MCP orchestration.

## 🚀 Quick Start

### MCP Orchestrator Server

The enhanced MCP Orchestrator Server provides enterprise-grade AI agent coordination with monitoring, security, and reliability.

#### Run the Server

```bash
# Production mode
python run-mcp-server.py

# Development mode
python run-mcp-dev.py

# Run tests
python run-mcp-test.py

# Deploy to production
python run-mcp-deploy.py
```

#### Access Monitoring

- **Health Check**: `http://localhost:8000/health_check`
- **Metrics**: `http://localhost:8000/get_metrics`
- **Prometheus**: `http://localhost:9090`
- **Grafana**: `http://localhost:3000` (admin/admin)

### Frontend Application

```bash
cd frontend
npm install
npm start
```

### Backend API

```bash
cd backend
pip install -r requirements.txt
python main.py
```

## 📁 Project Structure

```
├── .mcp-server/           # Enhanced MCP Orchestrator Server
│   ├── production.py      # Production entry point
│   ├── server.py          # Development server
│   ├── deploy.sh          # Deployment script
│   ├── Dockerfile         # Production container
│   ├── docker-compose.yml # Monitoring stack
│   └── docs/              # Documentation
├── frontend/              # React frontend application
├── backend/               # Python backend API
├── src/                   # Shared source code
├── docs/                  # Project documentation
├── run-mcp-server.py      # Production server runner
├── run-mcp-dev.py         # Development server runner
├── run-mcp-test.py        # Test runner
└── run-mcp-deploy.py      # Deployment runner
```

## 🔧 MCP Server Features

- **Enhanced Error Handling** - Specific exception types and structured responses
- **Comprehensive Metrics** - Performance, error, and system monitoring
- **Health Monitoring** - Real-time system health checks
- **Production Ready** - Docker deployment with security best practices
- **Monitoring Stack** - Prometheus + Grafana integration
- **Automated Deployment** - Scripts for deployment and rollback

## 📚 Documentation

- [MCP Server Documentation](.mcp-server/README.md)
- [Production Deployment Guide](.mcp-server/README-PRODUCTION.md)
- [Enhanced Features Guide](.mcp-server/docs/enhanced-features.md)
- [Production Checklist](.mcp-server/PRODUCTION-CHECKLIST.md)

## 🛠️ Development

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker 20.10+
- Docker Compose 2.0+

### Setup

```bash
# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies
npm install

# Run tests
python run-mcp-test.py
```

## 🚀 Deployment

### Production Deployment

```bash
# Deploy MCP server to production
python run-mcp-deploy.py

# Or use the deployment script directly
cd .mcp-server
./deploy.sh deploy
```

### Development

```bash
# Start development server
python run-mcp-dev.py

# Start production server
python run-mcp-server.py
```

## 📊 Monitoring

The MCP server includes comprehensive monitoring:

- **Health Checks** - System resource monitoring
- **Performance Metrics** - Tool call durations and error rates
- **Structured Logging** - JSON-formatted logs with rotation
- **Alerting** - Proactive issue detection
- **Dashboards** - Visual monitoring with Grafana

## 🔒 Security

- Non-root container execution
- Resource limits and constraints
- Secure configuration management
- Comprehensive error handling
- Audit logging

## 📞 Support

For MCP server issues:

- Check logs in `.mcp-server/logs/`
- Access monitoring dashboards
- Review documentation in `.mcp-server/docs/`
- Use health check endpoints

---

**Ready for production!** The enhanced MCP Orchestrator Server provides enterprise-grade reliability, security, and monitoring for AI agent coordination.
