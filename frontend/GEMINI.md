# Project: finvision-frontend

## Project Overview

This project is a sophisticated financial modeling and data analysis platform built with React, Vite, and TypeScript. It features a rich user interface with various dashboards, data visualization tools, and financial analysis features. The application is designed with a modular architecture, leveraging modern frontend technologies to deliver a high-performance and scalable solution.

Key technologies used in this project include:

*   **Framework:** React
*   **Build Tool:** Vite
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS, styled-components
*   **Routing:** React Router
*   **State Management:** Zustand, React Query
*   **Component Development:** Storybook
*   **Testing:** Vitest (unit/integration), Cypress (end-to-end)
*   **UI Components:** Radix UI, shadcn/ui

The application features a secure authentication system with role-based access control (Admin, Analyst, Verified User), ensuring that users can only access the features and data relevant to their roles. The frontend is designed to interact with a backend API for data fetching and persistence.

## Building and Running

### Development

To run the application in development mode, use the following command:

```bash
npm run dev
```

This will start the Vite development server, which typically runs on `http://localhost:3000`.

### Building for Production

To create a production-ready build of the application, use the following command:

```bash
npm run build
```

This will generate a `dist` directory with the optimized and minified application code.

### Testing

The project includes a comprehensive test suite with unit, integration, and end-to-end tests.

*   **Run all tests:**
    ```bash
    npm test
    ```

*   **Run unit tests:**
    ```bash
    npm run test:unit
    ```

*   **Run integration tests:**
    ```bash
    npm run test:integration
    ```

*   **Run end-to-end tests (headless):**
    ```bash
    npm run e2e
    ```

*   **Open Cypress for interactive E2E testing:**
    ```bash
    npm run e2e:open
    ```

## Development Conventions

### Coding Style

The project uses Prettier for code formatting and ESLint for static code analysis. To format the code, run:

```bash
npm run format
```

To lint the code, run:

```bash
npm run lint
```

### Component Development

The project uses Storybook for isolated component development and testing. To run Storybook, use the following command:

```bash
npm run storybook
```

This will start the Storybook development server, which typically runs on `http://localhost:6006`.

### Git Hooks

The project uses Husky to enforce code quality standards before committing. Pre-commit hooks are configured to run linting and formatting checks.
