// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import './commands';

// Import chai assertions
import 'cypress-axe';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login with user credentials
       * @example cy.login('username', 'password')
       */
      login(username: string, password: string): Chainable<void>;
      
      /**
       * Custom command to login as test user
       * @example cy.loginAsTestUser()
       */
      loginAsTestUser(): Chainable<void>;
      
      /**
       * Custom command to login as admin user
       * @example cy.loginAsAdmin()
       */
      loginAsAdmin(): Chainable<void>;
      
      /**
       * Custom command to upload file
       * @example cy.uploadFile('input[type="file"]', 'test.xlsx')
       */
      uploadFile(selector: string, fileName: string): Chainable<void>;
      
      /**
       * Custom command to wait for file processing
       * @example cy.waitForFileProcessing(fileId)
       */
      waitForFileProcessing(fileId: string): Chainable<void>;
      
      /**
       * Custom command to check accessibility
       * @example cy.checkA11y()
       */
      checkA11y(): Chainable<void>;
      
      /**
       * Custom command to reset application state
       * @example cy.resetAppState()
       */
      resetAppState(): Chainable<void>;
      
      /**
       * Custom command to seed test data
       * @example cy.seedTestData()
       */
      seedTestData(): Chainable<void>;
    }
  }
}

// Global before hook to set up test environment
beforeEach(() => {
  // Reset application state before each test
  cy.task('resetDb');
  
  // Set up viewport
  cy.viewport(1280, 720);
  
  // Clear cookies and local storage
  cy.clearCookies();
  cy.clearLocalStorage();
  
  // Visit base URL
  cy.visit('/');
});

// Global after hook for cleanup
afterEach(() => {
  // Take screenshot on failure
  cy.screenshot({ capture: 'viewport', onlyOnFailure: true });
});

// Handle uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignore certain errors that don't affect tests
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  
  if (err.message.includes('Non-Error promise rejection captured')) {
    return false;
  }
  
  // Return true to fail test on other uncaught exceptions
  return true;
});

// Custom assertions
chai.use((chai, utils) => {
  // Add custom assertion for testing loading states
  chai.Assertion.addMethod('loading', function (expected = true) {
    const obj = this._obj;
    const hasLoadingIndicator = obj.find('[data-testid="loading"], .loading, [role="progressbar"]').length > 0;
    
    this.assert(
      hasLoadingIndicator === expected,
      `expected element to ${expected ? 'have' : 'not have'} loading indicator`,
      `expected element to ${expected ? 'not have' : 'have'} loading indicator`,
      expected,
      hasLoadingIndicator
    );
  });
  
  // Add custom assertion for testing error states
  chai.Assertion.addMethod('error', function (expected = true) {
    const obj = this._obj;
    const hasError = obj.find('[data-testid="error"], .error, [role="alert"]').length > 0;
    
    this.assert(
      hasError === expected,
      `expected element to ${expected ? 'have' : 'not have'} error indicator`,
      `expected element to ${expected ? 'not have' : 'have'} error indicator`,
      expected,
      hasError
    );
  });
}); 