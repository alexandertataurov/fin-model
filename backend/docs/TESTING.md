# Testing Documentation

## Overview

This document provides comprehensive information about the testing strategy, setup, and execution for the FinVision financial modeling application.

## Testing Strategy

### Test Pyramid

```
    /\
   /  \
  / E2E \ (Small number of high-value end-to-end tests)
 /______\
/        \
| Integration | (Moderate number of integration tests)
|____________|
|            |
|    Unit     | (Large number of fast unit tests)
|____________|
```

### Coverage Goals

- **Backend Unit Tests**: > 80% code coverage
- **Frontend Unit Tests**: > 75% code coverage
- **Integration Tests**: Cover all major user workflows
- **E2E Tests**: Cover all critical user journeys
- **Performance Tests**: Validate system requirements
- **Security Tests**: OWASP compliance
- **Accessibility Tests**: WCAG 2.1 AA standards

## Test Categories

### 1. Unit Tests

#### Backend Unit Tests

- **Location**: `backend/tests/`
- **Framework**: pytest with asyncio support
- **Coverage**: Services, repositories, utilities, models
- **Configuration**: `backend/pytest.ini`

**Key Features:**

- Isolated database testing with SQLite
- Mock external dependencies
- Async test support
- Factory patterns for test data
- Comprehensive fixtures

**Running Tests:**

```bash
cd backend
pytest                      # Run all tests
pytest --cov               # Run with coverage
pytest -m unit            # Run only unit tests
pytest -m "not slow"      # Skip slow tests
pytest --tb=short         # Short traceback format
```

#### Frontend Unit Tests

- **Location**: `frontend/src/**/*.test.tsx`
- **Framework**: Vitest + React Testing Library
- **Coverage**: Components, hooks, utilities, services
- **Configuration**: `frontend/vite.config.ts`

**Key Features:**

- Component rendering tests
- User interaction testing
- API mocking
- Custom render with providers
- Accessibility testing

**Running Tests:**

```bash
cd frontend
npm run test               # Run all tests
npm run test:coverage     # Run with coverage
npm run test:ui           # Run with UI
npm run test:watch        # Watch mode
```

### 2. Integration Tests

#### Backend Integration Tests

- **Location**: `backend/tests/test_integration.py`
- **Scope**: API endpoints, database operations, service interactions
- **Database**: Isolated test database

**Test Scenarios:**

- Complete file upload and processing workflow
- Authentication and authorization flows
- Dashboard data aggregation
- Report generation end-to-end
- Error handling and recovery

#### Frontend Integration Tests

- **Location**: `frontend/src/test/integration/`
- **Scope**: API integration, state management, routing
- **Mocking**: Real API calls with mock responses

### 3. End-to-End Tests

#### Framework: Cypress

- **Location**: `frontend/cypress/`
- **Configuration**: `frontend/cypress.config.ts`
- **Scope**: Complete user journeys

**Test Scenarios:**

- User registration and authentication flow
- File upload and processing workflow
- Dashboard interactions and visualizations
- Parameter modification and scenario modeling
- Report generation and export
- Cross-browser compatibility

**Running E2E Tests:**

```bash
cd frontend
npx cypress open          # Interactive mode
npx cypress run           # Headless mode
npx cypress run --browser chrome
npx cypress run --spec "cypress/e2e/auth-flow.cy.ts"
```

### 4. Performance Tests

#### Load Testing

- **Tool**: k6 or Artillery
- **Scope**: API endpoints, file processing, concurrent users
- **Metrics**: Response time, throughput, error rates

#### Frontend Performance

- **Tool**: Lighthouse, Web Vitals
- **Scope**: Page load times, render performance, bundle size
- **Metrics**: FCP, LCP, CLS, FID

### 5. Security Tests

#### Backend Security

- **Authentication**: JWT token validation
- **Authorization**: Role-based access control
- **Input Validation**: SQL injection, XSS prevention
- **File Upload**: Virus scanning, type validation

#### Frontend Security

- **XSS Prevention**: Content sanitization
- **CSRF Protection**: Token validation
- **Secure Communication**: HTTPS enforcement

### 6. Accessibility Tests

#### Tools

- **Automated**: axe-core, WAVE
- **Manual**: Screen reader testing, keyboard navigation
- **Standards**: WCAG 2.1 AA compliance

## Test Setup and Configuration

### Backend Test Setup

#### Prerequisites

```bash
pip install -r requirements.txt
```

#### Database Setup

Tests use isolated SQLite databases created per test function to ensure test isolation.

#### Environment Variables

```env
TESTING=true
DATABASE_URL=sqlite:///./test.db
SECRET_KEY=test-secret-key
```

#### Test Fixtures

- **User fixtures**: Test users with different roles
- **File fixtures**: Sample Excel files for testing
- **Database fixtures**: Isolated test database per test
- **Mock fixtures**: External service mocks

### Frontend Test Setup

#### Prerequisites

```bash
npm install
```

#### Test Configuration

- **Vitest**: Modern testing framework with Vite integration
- **React Testing Library**: Component testing utilities
- **Mock Service Worker**: API mocking for integration tests

#### Test Utilities

- **Custom render**: Providers wrapper for component tests
- **Mock factories**: Generate test data
- **API mocks**: Consistent API response mocking

### Cypress E2E Setup

#### Installation

```bash
npm install --save-dev cypress
```

#### Configuration

- **Base URL**: Configurable for different environments
- **Viewports**: Multiple device sizes
- **Retries**: Automatic retry on failure
- **Screenshots**: Failure screenshots
- **Videos**: Test execution recording

#### Custom Commands

- **Authentication**: Login helpers
- **File Operations**: Upload and download utilities
- **API Helpers**: Direct API interaction
- **Accessibility**: A11y testing commands

## Test Data Management

### Test Data Strategy

1. **Unit Tests**: Generated data using factories
2. **Integration Tests**: Minimal realistic datasets
3. **E2E Tests**: Comprehensive test scenarios
4. **Performance Tests**: Large datasets for load testing

### Data Factories

```python
# Backend - Factory Boy
class UserFactory(factory.Factory):
    class Meta:
        model = User

    username = factory.Sequence(lambda n: f"user{n}")
    email = factory.LazyAttribute(lambda obj: f"{obj.username}@example.com")
```

```typescript
// Frontend - Test Data Factory
export const TestDataFactory = {
  user: (overrides = {}) => ({
    id: 1,
    username: "testuser",
    email: "test@example.com",
    ...overrides,
  }),
};
```

### Test Files

- **Sample Excel Files**: Various financial data formats
- **Invalid Files**: For error testing
- **Large Files**: For performance testing
- **Corrupted Files**: For error handling

## Continuous Integration

### GitHub Actions Workflow

- **Trigger**: Push to main/dev branches, Pull requests
- **Jobs**: Frontend tests, Backend tests, E2E tests
- **Artifacts**: Test reports, coverage reports, screenshots

### Test Pipeline

1. **Lint**: Code quality checks
2. **Unit Tests**: Fast feedback
3. **Integration Tests**: Service interactions
4. **Build**: Application compilation
5. **E2E Tests**: Full user journeys
6. **Security Scans**: Vulnerability assessment
7. **Performance Tests**: Load testing

## Test Environment Management

### Local Development

- **Backend**: SQLite database, mock external services
- **Frontend**: Vite dev server, mock API responses
- **Full Stack**: Docker Compose for integrated testing

### CI/CD Environments

- **Test Database**: PostgreSQL for integration tests
- **Test Services**: Redis, Celery worker
- **Environment Isolation**: Separate test databases

### Staging Environment

- **Production-like**: Real database, services
- **Test Data**: Sanitized production data
- **Monitoring**: Test execution metrics

## Best Practices

### Unit Testing

1. **Single Responsibility**: One assertion per test
2. **Descriptive Names**: Clear test intent
3. **AAA Pattern**: Arrange, Act, Assert
4. **Test Isolation**: Independent tests
5. **Mock External Dependencies**: Control test environment

### Integration Testing

1. **Real Interactions**: Minimal mocking
2. **Data Cleanup**: Reset state between tests
3. **Error Scenarios**: Test failure paths
4. **Performance Awareness**: Monitor test execution time

### E2E Testing

1. **User Perspective**: Test real user workflows
2. **Stable Selectors**: Use data-testid attributes
3. **Wait Strategies**: Proper async handling
4. **Test Independence**: No test dependencies
5. **Page Object Pattern**: Maintainable test code

### Test Maintenance

1. **Regular Review**: Remove obsolete tests
2. **Refactor**: Keep tests DRY
3. **Documentation**: Update test documentation
4. **Monitoring**: Track test stability and performance

## Debugging Tests

### Backend Test Debugging

```bash
# Run specific test with verbose output
pytest tests/test_specific.py::test_function -v -s

# Debug with pdb
pytest tests/test_specific.py::test_function --pdb

# Run with coverage and HTML report
pytest --cov --cov-report=html
```

### Frontend Test Debugging

```bash
# Run specific test file
npm run test -- Button.test.tsx

# Debug mode
npm run test -- --inspect-brk

# UI mode for interactive debugging
npm run test:ui
```

### Cypress Debugging

```bash
# Open Cypress with browser
npx cypress open

# Debug specific test
npx cypress run --spec "cypress/e2e/specific-test.cy.ts" --headed

# Record video
npx cypress run --record --key <record-key>
```

## Metrics and Reporting

### Coverage Reports

- **Backend**: pytest-cov generates HTML reports
- **Frontend**: Vitest coverage with c8
- **Integration**: Combined coverage metrics

### Test Reports

- **JUnit**: XML format for CI integration
- **HTML**: Human-readable reports
- **JSON**: Programmatic access

### Performance Metrics

- **Test Execution Time**: Monitor slow tests
- **Resource Usage**: Memory and CPU
- **Flaky Test Detection**: Track test stability

## Troubleshooting

### Common Issues

#### Backend Tests

- **Database Conflicts**: Ensure test isolation
- **Async Issues**: Proper await usage
- **Mock Problems**: Verify mock setup

#### Frontend Tests

- **Component Not Found**: Check selectors
- **Async Operations**: Use waitFor
- **Provider Issues**: Verify test setup

#### E2E Tests

- **Element Not Found**: Check selectors and timing
- **Network Issues**: Verify API mocking
- **Browser Differences**: Cross-browser testing

### Performance Issues

- **Slow Tests**: Profile and optimize
- **Memory Leaks**: Check cleanup
- **Resource Limits**: Monitor CI resources

## Security Considerations

### Test Data Security

- **No Real Data**: Use synthetic test data
- **Secret Management**: Secure test credentials
- **Environment Isolation**: Separate test environments

### Test Infrastructure

- **Access Control**: Restrict test environment access
- **Audit Logging**: Track test execution
- **Vulnerability Scanning**: Regular security scans

## Future Improvements

### Planned Enhancements

1. **Visual Regression Testing**: Screenshot comparison
2. **Contract Testing**: API contract validation
3. **Chaos Engineering**: Failure injection testing
4. **Machine Learning**: Test case generation
5. **Performance Monitoring**: Real-time metrics

### Tools Evaluation

- **Playwright**: Alternative to Cypress
- **Storybook**: Component testing
- **Postman/Newman**: API testing automation
- **Artillery**: Advanced load testing

## Resources

### Documentation

- [pytest Documentation](https://docs.pytest.org/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress Documentation](https://docs.cypress.io/)
- [Vitest Documentation](https://vitest.dev/)

### Tutorials

- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Frontend Testing Strategy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
- [E2E Testing Guide](https://docs.cypress.io/guides/end-to-end-testing/writing-your-first-end-to-end-test)

### Tools

- [Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
- [Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
