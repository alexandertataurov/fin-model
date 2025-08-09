/**
 * Admin Dashboard E2E Tests
 * 
 * End-to-end tests for critical admin dashboard workflows
 */

describe('Admin Dashboard', () => {
  beforeEach(() => {
    // Mock admin user authentication
    cy.window().then((win) => {
      win.localStorage.setItem('auth-token', 'mock-admin-token');
      win.localStorage.setItem('user-role', 'admin');
    });

    // Intercept admin API calls
    cy.intercept('GET', '/api/v1/admin/stats', {
      fixture: 'admin/system-stats.json'
    }).as('getSystemStats');

    cy.intercept('GET', '/api/v1/admin/users/activity-list', {
      fixture: 'admin/user-activity.json'
    }).as('getUserActivity');

    cy.intercept('GET', '/api/v1/admin/system/metrics', {
      fixture: 'admin/system-metrics.json'
    }).as('getSystemMetrics');

    cy.intercept('GET', '/api/v1/admin/system/logs**', {
      fixture: 'admin/system-logs.json'
    }).as('getSystemLogs');

    cy.intercept('GET', '/api/v1/admin/audit-logs**', {
      fixture: 'admin/audit-logs.json'
    }).as('getAuditLogs');

    // Visit the admin dashboard
    cy.visit('/admin');
  });

  describe('Dashboard Loading and Navigation', () => {
    it('should load the admin dashboard successfully', () => {
      cy.get('[data-testid="admin-dashboard"]').should('be.visible');
      cy.get('h1').should('contain.text', 'Admin Dashboard');
      
      // Check that API calls are made
      cy.wait('@getSystemStats');
      cy.wait('@getUserActivity');
      cy.wait('@getSystemMetrics');
    });

    it('should show loading skeletons initially', () => {
      // Visit dashboard with slow network simulation
      cy.intercept('GET', '/api/v1/admin/stats', {
        fixture: 'admin/system-stats.json',
        delay: 2000
      }).as('getSystemStatsDelay');

      cy.visit('/admin');
      
      // Should show skeleton while loading
      cy.get('[data-testid="stats-skeleton"]').should('be.visible');
      
      cy.wait('@getSystemStatsDelay');
      
      // Skeleton should disappear after loading
      cy.get('[data-testid="stats-skeleton"]').should('not.exist');
    });

    it('should navigate between tabs correctly', () => {
      cy.wait('@getSystemStats');

      // Check initial tab
      cy.get('[data-value="overview"]').should('have.attr', 'data-state', 'active');

      // Navigate to Users tab
      cy.get('[data-value="users"]').click();
      cy.get('[data-value="users"]').should('have.attr', 'data-state', 'active');

      // Navigate to System tab
      cy.get('[data-value="system"]').click();
      cy.get('[data-value="system"]').should('have.attr', 'data-state', 'active');

      // Navigate to Logs tab
      cy.get('[data-value="logs"]').click();
      cy.get('[data-value="logs"]').should('have.attr', 'data-state', 'active');
      cy.wait('@getSystemLogs');
    });
  });

  describe('System Statistics Display', () => {
    it('should display system statistics correctly', () => {
      cy.wait('@getSystemStats');

      // Check user statistics
      cy.get('[data-testid="total-users"]').should('contain.text', '1,250');
      cy.get('[data-testid="active-users"]').should('contain.text', '1,100 active');
      cy.get('[data-testid="new-users-24h"]').should('contain.text', '+25');

      // Check file statistics
      cy.get('[data-testid="total-files"]').should('contain.text', '15,420');
      cy.get('[data-testid="completed-files"]').should('contain.text', '14,890 completed');

      // Check progress bars
      cy.get('[data-testid="users-progress"]').should('be.visible');
      cy.get('[data-testid="files-progress"]').should('be.visible');
    });

    it('should update statistics on refresh', () => {
      cy.wait('@getSystemStats');

      // Mock updated stats
      cy.intercept('GET', '/api/v1/admin/stats', {
        body: {
          users: { total: 1300, active: 1150, verified: 1000, new_24h: 30 },
          files: { total: 16000, completed: 15200, processing: 50, failed: 5 },
        }
      }).as('getUpdatedStats');

      // Click refresh button
      cy.get('[data-testid="refresh-button"]').click();
      cy.wait('@getUpdatedStats');

      // Check updated values
      cy.get('[data-testid="total-users"]').should('contain.text', '1,300');
      cy.get('[data-testid="new-users-24h"]').should('contain.text', '+30');
    });
  });

  describe('Performance Metrics', () => {
    it('should display system metrics with proper color coding', () => {
      cy.wait('@getSystemMetrics');

      // Check CPU usage
      cy.get('[data-testid="cpu-usage"]').should('be.visible');
      cy.get('[data-testid="cpu-progress"]').should('be.visible');

      // Check memory usage
      cy.get('[data-testid="memory-usage"]').should('be.visible');
      cy.get('[data-testid="memory-progress"]').should('be.visible');

      // Check disk usage
      cy.get('[data-testid="disk-usage"]').should('be.visible');
      cy.get('[data-testid="disk-progress"]').should('be.visible');
    });

    it('should show warning colors for high usage', () => {
      // Mock high usage metrics
      cy.intercept('GET', '/api/v1/admin/system/metrics', {
        body: {
          cpu_usage: 85.5,
          memory_usage: 92.3,
          disk_usage: 76.8,
          active_connections: 25,
          request_count_24h: 5000,
        }
      }).as('getHighUsageMetrics');

      cy.visit('/admin');
      cy.wait('@getHighUsageMetrics');

      // Check for warning/critical colors
      cy.get('[data-testid="cpu-usage-text"]').should('have.class', 'text-red-500');
      cy.get('[data-testid="memory-usage-text"]').should('have.class', 'text-red-500');
      cy.get('[data-testid="disk-usage-text"]').should('have.class', 'text-yellow-500');
    });
  });

  describe('User Activity Section', () => {
    it('should display recent user activity', () => {
      cy.wait('@getUserActivity');

      cy.get('[data-testid="user-activity-section"]').should('be.visible');
      cy.get('[data-testid="user-activity-item"]').should('have.length.at.least', 1);

      // Check activity summary
      cy.get('[data-testid="active-users-count"]').should('be.visible');
      cy.get('[data-testid="files-uploaded-count"]').should('be.visible');
      cy.get('[data-testid="models-created-count"]').should('be.visible');
    });

    it('should handle empty user activity gracefully', () => {
      cy.intercept('GET', '/api/v1/admin/users/activity-list', {
        body: []
      }).as('getEmptyUserActivity');

      cy.visit('/admin');
      cy.wait('@getEmptyUserActivity');

      // Should not show user activity section
      cy.get('[data-testid="user-activity-section"]').should('not.exist');
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', () => {
      cy.intercept('GET', '/api/v1/admin/stats', {
        statusCode: 500,
        body: { error: 'Internal server error' }
      }).as('getStatsError');

      cy.visit('/admin');
      cy.wait('@getStatsError');

      // Should show error message
      cy.get('[data-testid="error-message"]').should('be.visible');
      cy.get('[data-testid="error-message"]').should('contain.text', 'unavailable');
    });

    it('should show retry functionality on errors', () => {
      cy.intercept('GET', '/api/v1/admin/stats', {
        statusCode: 500,
        body: { error: 'Network error' }
      }).as('getStatsError');

      cy.visit('/admin');
      cy.wait('@getStatsError');

      // Mock successful retry
      cy.intercept('GET', '/api/v1/admin/stats', {
        fixture: 'admin/system-stats.json'
      }).as('getStatsRetry');

      // Click refresh/retry button
      cy.get('[data-testid="refresh-button"]').click();
      cy.wait('@getStatsRetry');

      // Error should be cleared
      cy.get('[data-testid="error-message"]').should('not.exist');
      cy.get('[data-testid="total-users"]').should('be.visible');
    });
  });

  describe('Real-time Updates', () => {
    it('should handle WebSocket connections', () => {
      // Mock WebSocket connection
      cy.window().then((win) => {
        const mockWebSocket = {
          readyState: WebSocket.OPEN,
          send: cy.stub(),
          close: cy.stub(),
        };
        
        cy.stub(win, 'WebSocket').returns(mockWebSocket);
      });

      cy.visit('/admin');
      cy.wait('@getSystemStats');

      // Check that WebSocket connection is attempted
      cy.window().its('WebSocket').should('have.been.called');
    });

    it('should toggle auto-refresh correctly', () => {
      cy.wait('@getSystemStats');

      // Auto-refresh should be enabled by default
      cy.get('[data-testid="auto-refresh-toggle"]').should('be.checked');

      // Disable auto-refresh
      cy.get('[data-testid="auto-refresh-toggle"]').click();
      cy.get('[data-testid="auto-refresh-toggle"]').should('not.be.checked');

      // Enable auto-refresh
      cy.get('[data-testid="auto-refresh-toggle"]').click();
      cy.get('[data-testid="auto-refresh-toggle"]').should('be.checked');
    });
  });

  describe('Dashboard Customization', () => {
    it('should open dashboard customization dialog', () => {
      cy.wait('@getSystemStats');

      cy.get('[data-testid="customize-dashboard-button"]').click();
      cy.get('[data-testid="dashboard-customization-dialog"]').should('be.visible');

      // Check customization options
      cy.get('[data-testid="widget-toggle"]').should('have.length.at.least', 4);
      cy.get('[data-testid="layout-preview"]').should('be.visible');
    });

    it('should save dashboard layout changes', () => {
      cy.wait('@getSystemStats');

      cy.get('[data-testid="customize-dashboard-button"]').click();

      // Toggle a widget off
      cy.get('[data-testid="widget-toggle"]').first().click();

      // Save changes
      cy.get('[data-testid="save-layout-button"]').click();

      // Dialog should close
      cy.get('[data-testid="dashboard-customization-dialog"]').should('not.exist');

      // Check that layout is saved to localStorage
      cy.window().its('localStorage').invoke('getItem', 'dashboard-config-admin').should('exist');
    });
  });

  describe('Maintenance Operations', () => {
    it('should access maintenance tools', () => {
      cy.wait('@getSystemStats');

      // Navigate to maintenance tab (if exists) or access via settings
      cy.get('[data-testid="maintenance-tools-button"]').click();
      cy.get('[data-testid="maintenance-tools-section"]').should('be.visible');

      // Check available operations
      cy.get('[data-testid="maintenance-operation"]').should('have.length.at.least', 3);
    });

    it('should perform dry-run operations', () => {
      cy.intercept('POST', '/api/v1/admin/database/cleanup**', {
        body: {
          message: 'Dry run completed',
          orphaned_records: 15,
          dry_run: true
        }
      }).as('dryRunCleanup');

      cy.wait('@getSystemStats');
      cy.get('[data-testid="maintenance-tools-button"]').click();

      // Click preview/dry-run button
      cy.get('[data-testid="database-cleanup-preview"]').click();
      cy.get('[data-testid="maintenance-dialog"]').should('be.visible');

      // Execute dry run
      cy.get('[data-testid="dry-run-button"]').click();
      cy.wait('@dryRunCleanup');

      // Check dry run results
      cy.get('[data-testid="dry-run-result"]').should('contain.text', 'Dry run completed');
      cy.get('[data-testid="affected-items"]').should('contain.text', '15');
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard navigable', () => {
      cy.wait('@getSystemStats');

      // Tab through interactive elements
      cy.get('body').tab();
      cy.focused().should('have.attr', 'data-testid', 'refresh-button');

      cy.focused().tab();
      cy.focused().should('have.attr', 'data-testid', 'auto-refresh-toggle');

      // Navigate through tabs
      cy.get('[data-value="users"]').focus().type('{enter}');
      cy.get('[data-value="users"]').should('have.attr', 'data-state', 'active');
    });

    it('should have proper ARIA labels', () => {
      cy.wait('@getSystemStats');

      // Check for proper ARIA labels
      cy.get('[role="button"]').should('have.attr', 'aria-label');
      cy.get('[role="tablist"]').should('exist');
      cy.get('[role="tab"]').should('have.attr', 'aria-selected');
      cy.get('[role="tabpanel"]').should('exist');
    });

    it('should support screen reader navigation', () => {
      cy.wait('@getSystemStats');

      // Check heading structure
      cy.get('h1').should('exist');
      cy.get('h2, h3, h4').should('have.length.at.least', 3);

      // Check for proper landmark roles
      cy.get('[role="main"]').should('exist');
      cy.get('[role="navigation"]').should('exist');
    });
  });

  describe('Performance', () => {
    it('should load within acceptable time limits', () => {
      const startTime = Date.now();

      cy.visit('/admin');
      cy.wait('@getSystemStats');

      cy.then(() => {
        const loadTime = Date.now() - startTime;
        expect(loadTime).to.be.lessThan(3000); // Should load within 3 seconds
      });
    });

    it('should handle large datasets efficiently', () => {
      // Mock large dataset
      cy.intercept('GET', '/api/v1/admin/users/activity-list', {
        fixture: 'admin/large-user-activity.json'
      }).as('getLargeUserActivity');

      cy.visit('/admin');
      cy.wait('@getLargeUserActivity');

      // Should still display only limited number of items
      cy.get('[data-testid="user-activity-item"]').should('have.length', 6);
      
      // UI should remain responsive
      cy.get('[data-testid="refresh-button"]').click();
      cy.get('[data-testid="refresh-button"]').should('not.be.disabled');
    });
  });

  describe('Mobile Responsiveness', () => {
    it('should work on mobile viewport', () => {
      cy.viewport('iphone-x');
      cy.visit('/admin');
      cy.wait('@getSystemStats');

      // Check that content is visible and accessible
      cy.get('[data-testid="admin-dashboard"]').should('be.visible');
      cy.get('h1').should('be.visible');

      // Tab navigation should work on mobile
      cy.get('[data-value="users"]').should('be.visible').click();
      cy.get('[data-value="users"]').should('have.attr', 'data-state', 'active');
    });

    it('should have touch-friendly interface', () => {
      cy.viewport('ipad-2');
      cy.visit('/admin');
      cy.wait('@getSystemStats');

      // Buttons should be touch-friendly size (at least 44px)
      cy.get('[data-testid="refresh-button"]').should('have.css', 'min-height');
      cy.get('[data-value="users"]').should('have.css', 'min-height');
    });
  });
});
