## FinVision Project — Agent Coding Guidelines

### 🧑‍💻 Tech Stack
- **Frontend**: React + TypeScript with Vite  
- **Backend**: Python (FastAPI or Django)

### 🎨 UI/UX Guidelines
- Use **minimal but professional UI**
- Prefer **monospaced fonts** for data-heavy views
- Avoid heavy UI kits (e.g., Ant Design, MUI) unless necessary
- Prefer lightweight libraries (e.g., Tailwind CSS, Headless UI)

### 🧼 Code Style
- Follow **Airbnb TypeScript Style Guide**
- Use **ESLint + Prettier** for linting and formatting
- Keep code **modular**, **typed**, and **easy to refactor**

### 🗂️ Project Structure
- Organize components by domain (e.g., `components/Finance/`, `pages/Dashboard/`)
- Use **React hooks** and **Context API** for state management where appropriate

### 🧪 Testing
- Use **Jest** + **React Testing Library** for unit tests
- Aim for high coverage on core logic (e.g., parsers, calculators)
