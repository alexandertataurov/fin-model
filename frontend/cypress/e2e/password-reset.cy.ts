describe('Password Reset Flow', () => {
  const testEmail = 'resetuser@example.com';
  const testUsername = 'resetuser';
  const oldPassword = 'OldPassword123!';
  const newPassword = 'NewPassword456!';

  beforeEach(() => {
    // Reset app state and create a test user
    cy.resetAppState();
    cy.createTestUser({
      username: testUsername,
      email: testEmail,
      password: oldPassword,
      full_name: 'Reset User',
    });
  });

  it('should allow a user to request a password reset and set a new password', () => {
    // 1. Go to Forgot Password page and request reset
    cy.visit('/forgot-password');
    cy.get('[data-testid="forgot-password-email-input"]').type(testEmail);
    cy.get('[data-testid="forgot-password-submit"]').click();

    // 2. Should show success message
    cy.contains(
      'If an account with that email exists, you will receive password reset instructions shortly.'
    );

    // 3. Simulate receiving a reset token (using test utility endpoint)
    cy.request({
      method: 'GET',
      url: `/api/v1/test-utils/reset-token?email=${encodeURIComponent(
        testEmail
      )}`,
    }).then(response => {
      expect(response.status).to.eq(200);
      const resetToken = response.body.token;

      // 4. Visit the reset password page with the token
      cy.visit(`/reset-password?token=${resetToken}`);

      // 5. Set a new password
      cy.get('[data-testid="reset-password-input"]').type(newPassword);
      cy.get('[data-testid="reset-confirm-password-input"]').type(newPassword);

      // 6. Verify password strength indicator shows strong
      cy.get('[data-testid="password-strength-indicator"]').should(
        'contain',
        'STRONG'
      );

      // 7. Submit the reset
      cy.get('[data-testid="reset-password-submit"]').click();

      // 8. Should show success message
      cy.get('[data-testid="reset-success-message"]')
        .should('be.visible')
        .and('contain', 'Password reset successfully');

      // 9. Should redirect to login after a few seconds
      cy.url().should('include', '/login', { timeout: 10000 });
    });
  });

  it('should login with the new password after reset', () => {
    // First complete the password reset flow
    cy.visit('/forgot-password');
    cy.get('[data-testid="forgot-password-email-input"]').type(testEmail);
    cy.get('[data-testid="forgot-password-submit"]').click();

    cy.request({
      method: 'GET',
      url: `/api/v1/test-utils/reset-token?email=${encodeURIComponent(
        testEmail
      )}`,
    }).then(response => {
      const resetToken = response.body.token;
      cy.visit(`/reset-password?token=${resetToken}`);
      cy.get('[data-testid="reset-password-input"]').type(newPassword);
      cy.get('[data-testid="reset-confirm-password-input"]').type(newPassword);
      cy.get('[data-testid="reset-password-submit"]').click();

      // Wait for redirect to login
      cy.url().should('include', '/login', { timeout: 10000 });

      // 10. Login with the new password
      cy.get('[data-testid="email-input"]').type(testEmail);
      cy.get('[data-testid="password-input"]').type(newPassword);
      cy.get('[data-testid="login-button"]').click();

      // 11. Should redirect to dashboard
      cy.url().should('include', '/dashboard');
      cy.get('[data-testid="user-name"]').should('contain', 'Reset User');
    });
  });

  it('should show error for invalid reset token', () => {
    // Visit reset page with invalid token
    cy.visit('/reset-password?token=invalid-token-123');

    cy.get('[data-testid="reset-password-input"]').type(newPassword);
    cy.get('[data-testid="reset-confirm-password-input"]').type(newPassword);
    cy.get('[data-testid="reset-password-submit"]').click();

    // Should show error for invalid token
    cy.get('[data-testid="reset-error-message"]')
      .should('be.visible')
      .and('contain', 'Invalid or expired reset token');
  });

  it('should validate password requirements on reset form', () => {
    cy.request({
      method: 'GET',
      url: `/api/v1/test-utils/reset-token?email=${encodeURIComponent(
        testEmail
      )}`,
    }).then(response => {
      const resetToken = response.body.token;
      cy.visit(`/reset-password?token=${resetToken}`);

      // Test weak password
      cy.get('[data-testid="reset-password-input"]').type('weak');
      cy.get('[data-testid="password-strength-indicator"]').should(
        'contain',
        'WEAK'
      );

      // Test strong password
      cy.get('[data-testid="reset-password-input"]').clear().type(newPassword);
      cy.get('[data-testid="password-strength-indicator"]').should(
        'contain',
        'STRONG'
      );

      // Verify all requirements are checked
      cy.contains('At least 8 characters').should('be.visible');
      cy.contains('At least one uppercase letter').should('be.visible');
      cy.contains('At least one lowercase letter').should('be.visible');
      cy.contains('At least one number').should('be.visible');
      cy.contains('At least one special character').should('be.visible');
    });
  });

  it('should handle rate limiting on forgot password requests', () => {
    cy.visit('/forgot-password');

    // Make multiple rapid requests to trigger rate limiting
    for (let i = 0; i < 4; i++) {
      cy.get('[data-testid="forgot-password-email-input"]')
        .clear()
        .type(testEmail);
      cy.get('[data-testid="forgot-password-submit"]').click();
      cy.wait(500);
    }

    // Should show rate limit error
    cy.get('[data-testid="forgot-password-error"]')
      .should('be.visible')
      .and('contain', 'Too many password reset requests');
  });
});
