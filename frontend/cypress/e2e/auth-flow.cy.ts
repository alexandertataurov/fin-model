describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.resetAppState();
    cy.visit('/');
  });

  describe('User Registration', () => {
    it('should allow new user registration', () => {
      cy.visit('/register');
      
      // Fill registration form
      cy.get('[data-testid="username-input"]')
        .type('newuser123');
      
      cy.get('[data-testid="email-input"]')
        .type('newuser@example.com');
      
      cy.get('[data-testid="password-input"]')
        .type('SecurePassword123!');
      
      cy.get('[data-testid="confirm-password-input"]')
        .type('SecurePassword123!');
      
      cy.get('[data-testid="full-name-input"]')
        .type('New User');
      
      cy.get('[data-testid="terms-checkbox"]')
        .check();
      
      // Submit registration
      cy.get('[data-testid="register-button"]')
        .click();
      
      // Should redirect to dashboard after successful registration
      cy.url().should('include', '/dashboard');
      
      // Should show welcome message
      cy.get('[data-testid="welcome-message"]')
        .should('contain', 'Welcome, New User');
    });

    it('should validate registration form fields', () => {
      cy.visit('/register');
      
      // Try to submit empty form
      cy.get('[data-testid="register-button"]')
        .click();
      
      // Should show validation errors
      cy.get('[data-testid="username-error"]')
        .should('be.visible')
        .and('contain', 'Username is required');
      
      cy.get('[data-testid="email-error"]')
        .should('be.visible')
        .and('contain', 'Email is required');
      
      cy.get('[data-testid="password-error"]')
        .should('be.visible')
        .and('contain', 'Password is required');
    });

    it('should validate password requirements', () => {
      cy.visit('/register');
      
      // Test weak password
      cy.get('[data-testid="password-input"]')
        .type('weak');
      
      cy.get('[data-testid="password-strength"]')
        .should('contain', 'Password too weak');
      
      // Test strong password
      cy.get('[data-testid="password-input"]')
        .clear()
        .type('StrongPassword123!');
      
      cy.get('[data-testid="password-strength"]')
        .should('contain', 'Strong password');
    });

    it('should handle registration errors', () => {
      cy.visit('/register');
      
      // Try to register with existing email
      cy.get('[data-testid="username-input"]').type('existinguser');
      cy.get('[data-testid="email-input"]').type('existing@example.com');
      cy.get('[data-testid="password-input"]').type('Password123!');
      cy.get('[data-testid="confirm-password-input"]').type('Password123!');
      cy.get('[data-testid="full-name-input"]').type('Existing User');
      cy.get('[data-testid="terms-checkbox"]').check();
      
      // Mock API to return error
      cy.intercept('POST', '/api/v1/auth/register', {
        statusCode: 400,
        body: { detail: 'Email already registered' }
      });
      
      cy.get('[data-testid="register-button"]').click();
      
      // Should show error message
      cy.get('[data-testid="registration-error"]')
        .should('be.visible')
        .and('contain', 'Email already registered');
    });
  });

  describe('User Login', () => {
    beforeEach(() => {
      // Create test user
      cy.createTestUser({
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPassword123!',
        full_name: 'Test User'
      });
    });

    it('should allow user login with valid credentials', () => {
      cy.visit('/login');
      
      cy.get('[data-testid="username-input"]')
        .type('testuser');
      
      cy.get('[data-testid="password-input"]')
        .type('TestPassword123!');
      
      cy.get('[data-testid="login-button"]')
        .click();
      
      // Should redirect to dashboard
      cy.url().should('include', '/dashboard');
      
      // Should show user menu
      cy.get('[data-testid="user-menu"]')
        .should('be.visible');
      
      // Should show correct username
      cy.get('[data-testid="user-name"]')
        .should('contain', 'Test User');
    });

    it('should show error for invalid credentials', () => {
      cy.visit('/login');
      
      cy.get('[data-testid="username-input"]')
        .type('invaliduser');
      
      cy.get('[data-testid="password-input"]')
        .type('wrongpassword');
      
      cy.get('[data-testid="login-button"]')
        .click();
      
      // Should show error message
      cy.get('[data-testid="login-error"]')
        .should('be.visible')
        .and('contain', 'Invalid credentials');
      
      // Should remain on login page
      cy.url().should('include', '/login');
    });

    it('should validate login form fields', () => {
      cy.visit('/login');
      
      // Try to submit empty form
      cy.get('[data-testid="login-button"]')
        .click();
      
      // Should show validation errors
      cy.get('[data-testid="username-error"]')
        .should('be.visible');
      
      cy.get('[data-testid="password-error"]')
        .should('be.visible');
    });

    it('should remember user login with "Remember Me"', () => {
      cy.visit('/login');
      
      cy.get('[data-testid="username-input"]').type('testuser');
      cy.get('[data-testid="password-input"]').type('TestPassword123!');
      cy.get('[data-testid="remember-me-checkbox"]').check();
      
      cy.get('[data-testid="login-button"]').click();
      
      // Verify login
      cy.url().should('include', '/dashboard');
      
      // Clear session storage but keep local storage
      cy.clearCookies();
      
      // Refresh page - should still be logged in
      cy.reload();
      cy.url().should('include', '/dashboard');
    });
  });

  describe('Protected Routes', () => {
    it('should redirect unauthenticated users to login', () => {
      const protectedRoutes = ['/dashboard', '/files', '/parameters', '/reports'];
      
      protectedRoutes.forEach(route => {
        cy.visit(route);
        cy.url().should('include', '/login');
        
        // Should show redirect message
        cy.get('[data-testid="redirect-message"]')
          .should('contain', 'Please log in to access this page');
      });
    });

    it('should allow authenticated users to access protected routes', () => {
      cy.loginAsTestUser();
      
      const protectedRoutes = [
        { path: '/dashboard', testId: 'dashboard-content' },
        { path: '/files', testId: 'file-upload-section' },
        { path: '/parameters', testId: 'parameters-list' },
        { path: '/reports', testId: 'reports-section' }
      ];
      
      protectedRoutes.forEach(route => {
        cy.visit(route.path);
        cy.url().should('include', route.path);
        cy.get(`[data-testid="${route.testId}"]`).should('be.visible');
      });
    });

    it('should handle expired tokens', () => {
      cy.loginAsTestUser();
      
      // Mock API to return 401 for expired token
      cy.intercept('GET', '/api/v1/**', {
        statusCode: 401,
        body: { detail: 'Token expired' }
      });
      
      cy.visit('/dashboard');
      
      // Should redirect to login
      cy.url().should('include', '/login');
      
      // Should show token expired message
      cy.get('[data-testid="token-expired-message"]')
        .should('contain', 'Your session has expired');
    });
  });

  describe('User Logout', () => {
    beforeEach(() => {
      cy.loginAsTestUser();
    });

    it('should log out user and redirect to home', () => {
      cy.get('[data-testid="user-menu"]').click();
      cy.get('[data-testid="logout-button"]').click();
      
      // Should redirect to home page
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      
      // Should not show user menu
      cy.get('[data-testid="user-menu"]').should('not.exist');
      
      // Should clear authentication data
      cy.window().then((win) => {
        expect(win.localStorage.getItem('auth_token')).to.be.null;
      });
    });

    it('should require authentication after logout', () => {
      // Logout
      cy.get('[data-testid="user-menu"]').click();
      cy.get('[data-testid="logout-button"]').click();
      
      // Try to access protected route
      cy.visit('/dashboard');
      
      // Should redirect to login
      cy.url().should('include', '/login');
    });
  });

  describe('Profile Management', () => {
    beforeEach(() => {
      cy.loginAsTestUser();
    });

    it('should display user profile information', () => {
      cy.get('[data-testid="user-menu"]').click();
      cy.get('[data-testid="profile-link"]').click();
      
      cy.url().should('include', '/profile');
      
      // Should show profile information
      cy.get('[data-testid="profile-username"]')
        .should('contain', 'testuser');
      
      cy.get('[data-testid="profile-email"]')
        .should('contain', 'test@example.com');
    });

    it('should allow profile updates', () => {
      cy.visit('/profile');
      
      // Update full name
      cy.get('[data-testid="full-name-input"]')
        .clear()
        .type('Updated Test User');
      
      cy.get('[data-testid="save-profile-button"]')
        .click();
      
      // Should show success message
      cy.get('[data-testid="profile-success"]')
        .should('contain', 'Profile updated successfully');
      
      // Should reflect changes in UI
      cy.get('[data-testid="user-name"]')
        .should('contain', 'Updated Test User');
    });

    it('should allow password changes', () => {
      cy.visit('/profile');
      
      cy.get('[data-testid="change-password-tab"]').click();
      
      cy.get('[data-testid="current-password"]')
        .type('TestPassword123!');
      
      cy.get('[data-testid="new-password"]')
        .type('NewPassword123!');
      
      cy.get('[data-testid="confirm-new-password"]')
        .type('NewPassword123!');
      
      cy.get('[data-testid="change-password-button"]')
        .click();
      
      // Should show success message
      cy.get('[data-testid="password-change-success"]')
        .should('contain', 'Password changed successfully');
    });
  });

  describe('Account Security', () => {
    it('should handle multiple failed login attempts', () => {
      cy.visit('/login');
      
      // Attempt multiple failed logins
      for (let i = 0; i < 5; i++) {
        cy.get('[data-testid="username-input"]').clear().type('testuser');
        cy.get('[data-testid="password-input"]').clear().type('wrongpassword');
        cy.get('[data-testid="login-button"]').click();
        
        if (i < 4) {
          cy.get('[data-testid="login-error"]').should('be.visible');
        }
      }
      
      // After 5 attempts, account should be temporarily locked
      cy.get('[data-testid="account-locked-message"]')
        .should('contain', 'Account temporarily locked');
    });

    it('should validate password complexity on change', () => {
      cy.loginAsTestUser();
      cy.visit('/profile');
      cy.get('[data-testid="change-password-tab"]').click();
      
      // Test weak password
      cy.get('[data-testid="new-password"]')
        .type('weak');
      
      cy.get('[data-testid="password-strength-indicator"]')
        .should('contain', 'Weak');
      
      // Test strong password
      cy.get('[data-testid="new-password"]')
        .clear()
        .type('VeryStrongPassword123!@#');
      
      cy.get('[data-testid="password-strength-indicator"]')
        .should('contain', 'Strong');
    });
  });

  describe('Accessibility', () => {
    it('should be accessible on auth pages', () => {
      cy.visit('/login');
      cy.checkA11y();
      
      cy.visit('/register');
      cy.checkA11y();
    });

    it('should support keyboard navigation', () => {
      cy.visit('/login');
      
      // Tab through form elements
      cy.get('body').tab();
      cy.focused().should('have.attr', 'data-testid', 'username-input');
      
      cy.focused().tab();
      cy.focused().should('have.attr', 'data-testid', 'password-input');
      
      cy.focused().tab();
      cy.focused().should('have.attr', 'data-testid', 'login-button');
    });
  });
}); 