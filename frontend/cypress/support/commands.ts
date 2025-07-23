// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/// <reference types="cypress" />

// Custom command for login
Cypress.Commands.add('login', (username: string, password: string) => {
  cy.visit('/login');
  
  cy.get('[data-testid="username-input"]')
    .should('be.visible')
    .clear()
    .type(username);
    
  cy.get('[data-testid="password-input"]')
    .should('be.visible')
    .clear()
    .type(password);
    
  cy.get('[data-testid="login-button"]')
    .should('be.visible')
    .click();
    
  // Wait for redirect to dashboard
  cy.url().should('include', '/dashboard');
  
  // Verify user is logged in
  cy.get('[data-testid="user-menu"]').should('be.visible');
});

// Custom command for test user login
Cypress.Commands.add('loginAsTestUser', () => {
  const testUser = Cypress.env('testUser');
  cy.login(testUser.username, testUser.password);
});

// Custom command for admin login
Cypress.Commands.add('loginAsAdmin', () => {
  const adminUser = Cypress.env('adminUser');
  cy.login(adminUser.username, adminUser.password);
});

// Custom command for file upload
Cypress.Commands.add('uploadFile', (selector: string, fileName: string) => {
  cy.fixture(fileName, 'base64').then((fileContent) => {
    const blob = Cypress.Blob.base64StringToBlob(fileContent);
    const file = new File([blob], fileName, { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    
    cy.get(selector).then((input) => {
      input[0].files = dataTransfer.files;
      input[0].dispatchEvent(new Event('change', { bubbles: true }));
    });
  });
});

// Custom command to wait for file processing
Cypress.Commands.add('waitForFileProcessing', (fileId: string) => {
  // Poll the file status endpoint until processing is complete
  cy.request({
    method: 'GET',
    url: `${Cypress.env('apiUrl')}/api/v1/files/${fileId}/status`,
    headers: {
      'Authorization': `Bearer ${window.localStorage.getItem('auth_token')}`
    }
  }).then((response) => {
    if (response.body.status === 'processing') {
      cy.wait(2000);
      cy.waitForFileProcessing(fileId);
    } else {
      expect(response.body.status).to.be.oneOf(['completed', 'failed']);
    }
  });
});

// Custom command for accessibility testing
Cypress.Commands.add('checkA11y', () => {
  cy.injectAxe();
  cy.checkA11y(undefined, {
    rules: {
      'color-contrast': { enabled: true },
      'focus-order-semantics': { enabled: true },
      'keyboard-navigation': { enabled: true }
    }
  });
});

// Custom command to reset app state
Cypress.Commands.add('resetAppState', () => {
  cy.task('resetDb');
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.clearSessionStorage();
});

// Custom command to seed test data
Cypress.Commands.add('seedTestData', () => {
  cy.task('seedTestData');
});

// Override visit command to handle authentication
Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
  const token = window.localStorage.getItem('auth_token');
  
  if (token && !url.includes('login') && !url.includes('register')) {
    // If user is authenticated and not visiting auth pages, 
    // ensure token is set in headers
    const mergedOptions = {
      ...options,
      onBeforeLoad: (win) => {
        win.localStorage.setItem('auth_token', token);
        options?.onBeforeLoad?.(win);
      }
    };
    return originalFn(url, mergedOptions);
  }
  
  return originalFn(url, options);
});

// Add command to handle API requests with auth
Cypress.Commands.add('apiRequest', (method: string, url: string, body?: any) => {
  const token = window.localStorage.getItem('auth_token');
  
  return cy.request({
    method,
    url: `${Cypress.env('apiUrl')}${url}`,
    body,
    headers: {
      'Authorization': token ? `Bearer ${token}` : undefined,
      'Content-Type': 'application/json'
    },
    failOnStatusCode: false
  });
});

// Command to create test user via API
Cypress.Commands.add('createTestUser', (userData: any) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/api/v1/auth/register`,
    body: userData,
    failOnStatusCode: false
  });
});

// Command to wait for element with custom timeout
Cypress.Commands.add('waitForElement', (selector: string, timeout = 10000) => {
  cy.get(selector, { timeout }).should('be.visible');
});

// Command to handle file download
Cypress.Commands.add('downloadFile', (url: string, filename: string) => {
  cy.request({
    method: 'GET',
    url,
    headers: {
      'Authorization': `Bearer ${window.localStorage.getItem('auth_token')}`
    }
  }).then((response) => {
    expect(response.status).to.eq(200);
    cy.writeFile(`cypress/downloads/${filename}`, response.body);
  });
});

// Command to verify chart data
Cypress.Commands.add('verifyChartData', (chartSelector: string, expectedDataPoints: number) => {
  cy.get(chartSelector)
    .should('be.visible')
    .within(() => {
      // Verify chart has expected number of data points
      cy.get('[data-testid="chart-data-point"]')
        .should('have.length.gte', expectedDataPoints);
    });
});

// Command to simulate drag and drop
Cypress.Commands.add('dragAndDrop', (sourceSelector: string, targetSelector: string) => {
  cy.get(sourceSelector).trigger('mousedown', { button: 0 });
  cy.get(targetSelector).trigger('mousemove').trigger('mouseup');
});

// Command to test responsive design
Cypress.Commands.add('testResponsive', (callback: () => void) => {
  const viewports = [
    { width: 320, height: 568 },   // Mobile
    { width: 768, height: 1024 },  // Tablet
    { width: 1280, height: 720 },  // Desktop
    { width: 1920, height: 1080 }  // Large Desktop
  ];
  
  viewports.forEach((viewport) => {
    cy.viewport(viewport.width, viewport.height);
    callback();
  });
});

// Note: Lighthouse testing is handled separately via @lhci/cli
// No need for cypress-lighthouse integration since we use LHCI for performance testing

// Add WAVE accessibility testing command
Cypress.Commands.add('checkWave', (options = {}) => {
  cy.task('waveCheck', {
    url: Cypress.config().baseUrl + Cypress.env('currentPath'),
    options: {
      reportType: 1, // JSON report
      ...options
    }
  });
});

// Declare additional commands for TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      apiRequest(method: string, url: string, body?: any): Chainable<Response<any>>;
      createTestUser(userData: any): Chainable<Response<any>>;
      waitForElement(selector: string, timeout?: number): Chainable<JQuery<HTMLElement>>;
      downloadFile(url: string, filename: string): Chainable<void>;
      verifyChartData(chartSelector: string, expectedDataPoints: number): Chainable<void>;
      dragAndDrop(sourceSelector: string, targetSelector: string): Chainable<void>;
      testResponsive(callback: () => void): Chainable<void>;
      checkWave(options?: {}): Chainable<void>;
    }
  }
} 