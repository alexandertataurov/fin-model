# FinVision - Financial Modeling and Analysis Platform

FinVision is a comprehensive web-based financial modeling and analysis platform that transforms static Excel financial models into dynamic, interactive dashboards with real-time parameter adjustment capabilities.

## 🚀 Features

- **Excel Integration**: Upload and parse Excel-based financial models
- **Interactive Dashboards**: Real-time visualization of financial metrics
- **Scenario Modeling**: Create and compare different business scenarios
- **Parameter Management**: Modify assumptions with real-time recalculation
- **Professional Reporting**: Generate publication-ready reports and presentations
- **Role-Based Access Control**: Secure access with Admin/Analyst/Viewer roles

## 🏗️ Architecture

### Frontend

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Radix UI + Tailwind CSS
- **Charts**: Recharts
- **State Management**: Zustand + React Query
- **Testing**: Vitest + React Testing Library

### Backend

- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentication**: JWT tokens
- **Unauthorized Responses**: Standard endpoints return **401 Unauthorized** when
  no token is provided, while admin endpoints return **403 Forbidden** for missing
  credentials
- **Background Tasks**: Celery + Redis
- **Excel Processing**: Pandas + openpyxl

### Infrastructure

- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Database**: PostgreSQL 15
- **Cache/Queue**: Redis 7

## ⏱️ Background Job Workflow

Long-running calculations run asynchronously using Celery. For example, to
calculate the comprehensive financial model:

1. `POST /api/v1/lean-financial/calculate/comprehensive` – returns a `task_id`
   instead of the immediate result.
2. `GET /api/v1/tasks/{task_id}` – check task status and retrieve results when
   completed.

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- Git

### Quick Start with Docker

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd fin-model
   ```

2. **Start all services**

   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs
   - pgAdmin: http://localhost:5050

### Local Development Setup

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

#### Backend Setup

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd backend
uvicorn main:app --reload
```

#### Database Setup

```bash
# Start PostgreSQL and Redis
docker-compose up -d db redis

# Run database migrations (when implemented)
cd backend
alembic upgrade head
```

## 📁 Project Structure

```
fin-model/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── test/           # Test utilities
│   │   └── main.tsx        # Application entry point
│   ├── _redirects          # Netlify redirects configuration
│   ├── _headers            # Netlify headers configuration
│   ├── package.json
│   └── vite.config.ts
├── backend/                 # FastAPI Python backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── core/           # Core configuration
│   │   ├── models/         # SQLAlchemy models
│   │   └── services/       # Business logic
│   └── main.py
├── requirements.txt        # Python dependencies
├── netlify.toml            # Netlify deployment configuration
├── tasks/                   # Project task documentation
├── docker-compose.yml       # Local development setup
└── .github/workflows/       # CI/CD pipelines
```

## 🧪 Testing

### Frontend Tests

```bash
cd frontend
npm run test                 # Run tests
npm run test:coverage       # Run with coverage
npm run test:ui             # Run with UI
```

### Backend Tests

```bash
cd backend
pytest                      # Run tests
pytest --cov               # Run with coverage
```

### E2E Tests

```bash
# Coming soon - Cypress integration
```

## 🚀 Deployment

### Netlify Deployment (Frontend)

The frontend is configured for easy deployment on Netlify with automatic builds from your Git repository.

#### Quick Deploy

1. **Connect Repository to Netlify**
   - Log in to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your repository
   - Netlify will automatically detect the `netlify.toml` configuration

2. **Environment Variables**
   Set these environment variables in Netlify dashboard:

   ```
   NODE_ENV=production
   VITE_API_URL=https://your-backend-api.com
   VITE_APP_NAME=FinVision
   VITE_APP_VERSION=1.0.0
   ```

3. **Deploy**
   - Push to your main branch
   - Netlify will automatically build and deploy

#### Manual Deploy

```bash
cd frontend
npm run build
# Upload the dist/ folder to Netlify
```

#### Configuration Files

- **`netlify.toml`**: Main configuration with build settings, redirects, and headers
- **`frontend/_redirects`**: SPA routing and API proxy configuration
- **`frontend/_headers`**: Security and caching headers

#### Features Configured

- ✅ **SPA Routing**: All routes redirect to `index.html` for client-side routing
- ✅ **Security Headers**: CSP, XSS protection, frame options
- ✅ **Asset Optimization**: CSS/JS bundling and minification
- ✅ **Caching**: Optimized cache headers for static assets
- ✅ **Environment Variables**: Context-specific configuration
- ✅ **Build Optimization**: Node.js 18, asset compression

### Backend Deployment

The backend can be deployed to various platforms:

#### Option 1: Railway/Render/Heroku

- Deploy the `backend/` directory
- Set environment variables from `backend/env.example`
- Configure PostgreSQL and Redis add-ons

#### Option 2: Docker Container

```bash
cd backend
docker build -f Dockerfile.prod -t finvision-backend .
docker run -p 8000:8000 finvision-backend
```

#### Option 3: Cloud Services

- **AWS**: ECS/Fargate with RDS PostgreSQL
- **Google Cloud**: Cloud Run with Cloud SQL
- **Azure**: Container Instances with PostgreSQL

### Environment Variables

#### Frontend (Netlify)

Copy `frontend/.env.example` and configure:

```bash
VITE_API_URL=https://your-backend-api.com
NODE_ENV=production
VITE_APP_NAME=FinVision
VITE_APP_VERSION=1.0.0
```

#### Backend

Copy `backend/env.example` and configure:

```bash
SECRET_KEY=your-secret-key-change-in-production
POSTGRES_SERVER=your-postgres-host
POSTGRES_USER=your-db-user
POSTGRES_PASSWORD=your-db-password
POSTGRES_DB=finvision
REDIS_URL=redis://your-redis-host:6379
BACKEND_CORS_ORIGINS=https://your-netlify-site.netlify.app
```

### Production Checklist

- [ ] Update `VITE_API_URL` to your production backend
- [ ] Set secure `SECRET_KEY` for backend
- [ ] Configure production database
- [ ] Set up Redis instance
- [ ] Update CORS origins
- [ ] Configure SSL certificates
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy

## 📊 Development Progress

This project follows a structured development approach with detailed task breakdowns:

- ✅ **Project Setup** - Development environment and infrastructure
- 🔄 **Authentication** - User management and security (Next)
- ⏳ **File Processing** - Excel upload and parsing
- ⏳ **Dashboard** - Interactive visualizations
- ⏳ **Financial Modeling** - Parameter management and calculations
- ⏳ **Reporting** - PDF/Excel export functionality
- ⏳ **Database** - Schema design and optimization
- ⏳ **UI/UX** - Frontend implementation
- ⏳ **Testing** - Comprehensive test coverage
- ⏳ **Deployment** - Production-ready infrastructure

See `/tasks/README.md` for detailed task breakdowns and progress tracking.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Quality

- Frontend: ESLint + Prettier
- Backend: Flake8 + Black + isort
- Pre-commit hooks enforce code quality
- All PRs require passing tests

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ Support

For questions and support:

- Check the `/tasks/` directory for detailed documentation
- Review API documentation at `/docs` when running

## 🌐 Live Demo

- **Frontend**: [Deploy to Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/fin-model)
- **Backend**: Deploy to Railway, Render, or your preferred platform
