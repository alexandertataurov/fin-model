describe('Dashboard Interactions', () => {
  beforeEach(() => {
    cy.resetAppState();
    cy.seedTestData();
    cy.loginAsTestUser();
    cy.visit('/dashboard');
  });

  describe('Dashboard Navigation', () => {
    it('should display main dashboard components', () => {
      // Main dashboard sections
      cy.get('[data-testid="dashboard-header"]').should('be.visible');
      cy.get('[data-testid="metrics-overview"]').should('be.visible');
      cy.get('[data-testid="charts-section"]').should('be.visible');
      cy.get('[data-testid="recent-activity"]').should('be.visible');
    });

    it('should navigate between dashboard sections', () => {
      // Test tab navigation
      cy.get('[data-testid="overview-tab"]').click();
      cy.get('[data-testid="overview-content"]').should('be.visible');
      
      cy.get('[data-testid="analytics-tab"]').click();
      cy.get('[data-testid="analytics-content"]').should('be.visible');
      
      cy.get('[data-testid="reports-tab"]').click();
      cy.get('[data-testid="reports-content"]').should('be.visible');
    });

    it('should support keyboard navigation', () => {
      // Test accessibility navigation
      cy.get('body').tab();
      cy.focused().should('have.attr', 'data-testid', 'main-nav');
      
      cy.focused().type('{enter}');
      // Should activate focused element
    });
  });

  describe('Metrics Overview', () => {
    it('should display key financial metrics', () => {
      cy.get('[data-testid="total-revenue-metric"]')
        .should('be.visible')
        .and('contain', '$');
      
      cy.get('[data-testid="total-expenses-metric"]')
        .should('be.visible')
        .and('contain', '$');
      
      cy.get('[data-testid="net-profit-metric"]')
        .should('be.visible');
      
      cy.get('[data-testid="profit-margin-metric"]')
        .should('be.visible')
        .and('contain', '%');
    });

    it('should update metrics when filters are applied', () => {
      // Apply date range filter
      cy.get('[data-testid="date-range-filter"]').click();
      cy.get('[data-testid="last-quarter-option"]').click();
      
      // Metrics should update
      cy.get('[data-testid="total-revenue-metric"]')
        .should('not.contain', '$0');
      
      // Reset filter
      cy.get('[data-testid="reset-filters"]').click();
    });

    it('should show metric trends with visual indicators', () => {
      cy.get('[data-testid="revenue-trend-indicator"]')
        .should('be.visible')
        .and('have.class', /trend-(up|down|neutral)/);
      
      cy.get('[data-testid="expense-trend-indicator"]')
        .should('be.visible');
    });
  });

  describe('Chart Interactions', () => {
    it('should display multiple chart types', () => {
      // Revenue trend chart
      cy.get('[data-testid="revenue-trend-chart"]')
        .should('be.visible');
      
      // Expense breakdown pie chart
      cy.get('[data-testid="expense-breakdown-chart"]')
        .should('be.visible');
      
      // Profit margin line chart
      cy.get('[data-testid="profit-margin-chart"]')
        .should('be.visible');
    });

    it('should support chart interactions', () => {
      // Hover over chart data points
      cy.get('[data-testid="revenue-trend-chart"]')
        .trigger('mouseover');
      
      // Should show tooltip
      cy.get('[data-testid="chart-tooltip"]')
        .should('be.visible');
      
      // Click on chart element
      cy.get('[data-testid="chart-data-point"]').first().click();
      
      // Should show detailed view or drill-down
      cy.get('[data-testid="data-detail-modal"]')
        .should('be.visible');
    });

    it('should allow chart customization', () => {
      // Change chart type
      cy.get('[data-testid="chart-type-selector"]').click();
      cy.get('[data-testid="bar-chart-option"]').click();
      
      // Chart should update
      cy.get('[data-testid="revenue-trend-chart"]')
        .should('have.attr', 'data-chart-type', 'bar');
      
      // Change time period
      cy.get('[data-testid="time-period-selector"]').click();
      cy.get('[data-testid="yearly-option"]').click();
      
      // Chart data should update
      cy.get('[data-testid="chart-loading"]').should('not.exist');
    });

    it('should export charts', () => {
      cy.get('[data-testid="export-chart-button"]').click();
      
      // Export options
      cy.get('[data-testid="export-png"]').click();
      
      // Should trigger download
      cy.readFile('cypress/downloads/dashboard-chart.png')
        .should('exist');
    });
  });

  describe('Filtering and Search', () => {
    it('should filter data by date range', () => {
      // Open date picker
      cy.get('[data-testid="date-range-filter"]').click();
      
      // Select custom range
      cy.get('[data-testid="custom-range-option"]').click();
      cy.get('[data-testid="start-date-input"]').type('2023-01-01');
      cy.get('[data-testid="end-date-input"]').type('2023-03-31');
      cy.get('[data-testid="apply-date-filter"]').click();
      
      // Data should be filtered
      cy.get('[data-testid="filtered-data-indicator"]')
        .should('contain', 'Q1 2023');
    });

    it('should filter by categories', () => {
      // Open category filter
      cy.get('[data-testid="category-filter"]').click();
      
      // Select specific categories
      cy.get('[data-testid="revenue-category"]').check();
      cy.get('[data-testid="expenses-category"]').uncheck();
      
      // Apply filter
      cy.get('[data-testid="apply-category-filter"]').click();
      
      // Should show only revenue data
      cy.get('[data-testid="expense-data"]').should('not.exist');
      cy.get('[data-testid="revenue-data"]').should('be.visible');
    });

    it('should search for specific metrics', () => {
      // Use search functionality
      cy.get('[data-testid="metric-search"]').type('revenue');
      
      // Should filter displayed metrics
      cy.get('[data-testid="search-results"]')
        .should('contain', 'revenue')
        .and('not.contain', 'expenses');
      
      // Clear search
      cy.get('[data-testid="clear-search"]').click();
      cy.get('[data-testid="all-metrics"]').should('be.visible');
    });

    it('should save and apply filter presets', () => {
      // Create filter preset
      cy.get('[data-testid="date-range-filter"]').click();
      cy.get('[data-testid="last-quarter-option"]').click();
      
      cy.get('[data-testid="save-filter-preset"]').click();
      cy.get('[data-testid="preset-name-input"]').type('Q4 Analysis');
      cy.get('[data-testid="save-preset-button"]').click();
      
      // Reset filters
      cy.get('[data-testid="reset-filters"]').click();
      
      // Apply saved preset
      cy.get('[data-testid="filter-presets"]').click();
      cy.get('[data-testid="q4-analysis-preset"]').click();
      
      // Filters should be reapplied
      cy.get('[data-testid="active-filters"]')
        .should('contain', 'Q4 Analysis');
    });
  });

  describe('Data Grid Interactions', () => {
    it('should display financial data in a grid', () => {
      cy.get('[data-testid="financial-data-grid"]')
        .should('be.visible');
      
      // Check column headers
      cy.get('[data-testid="account-column"]').should('be.visible');
      cy.get('[data-testid="amount-column"]').should('be.visible');
      cy.get('[data-testid="period-column"]').should('be.visible');
    });

    it('should sort data by columns', () => {
      // Sort by amount (ascending)
      cy.get('[data-testid="amount-column-header"]').click();
      
      // Check if sorted
      cy.get('[data-testid="sort-indicator"]')
        .should('have.class', 'sort-asc');
      
      // Sort by amount (descending)
      cy.get('[data-testid="amount-column-header"]').click();
      
      cy.get('[data-testid="sort-indicator"]')
        .should('have.class', 'sort-desc');
    });

    it('should filter grid data', () => {
      // Use column filter
      cy.get('[data-testid="account-filter"]').type('revenue');
      
      // Grid should show filtered results
      cy.get('[data-testid="grid-row"]')
        .should('have.length.at.least', 1)
        .and('contain', 'revenue');
      
      // Clear filter
      cy.get('[data-testid="clear-grid-filters"]').click();
    });

    it('should support row selection and actions', () => {
      // Select multiple rows
      cy.get('[data-testid="grid-row-checkbox"]').first().check();
      cy.get('[data-testid="grid-row-checkbox"]').eq(1).check();
      
      // Bulk actions should be available
      cy.get('[data-testid="bulk-actions"]').should('be.visible');
      
      // Export selected rows
      cy.get('[data-testid="export-selected"]').click();
      cy.get('[data-testid="export-csv"]').click();
      
      // Should trigger download
      cy.readFile('cypress/downloads/selected-data.csv')
        .should('exist');
    });
  });

  describe('Real-time Updates', () => {
    it('should update dashboard with new data', () => {
      // Simulate data update
      cy.intercept('GET', '/api/v1/dashboard/metrics', {
        fixture: 'updated-metrics.json'
      }).as('updatedMetrics');
      
      // Trigger refresh
      cy.get('[data-testid="refresh-dashboard"]').click();
      
      cy.wait('@updatedMetrics');
      
      // Dashboard should show updated data
      cy.get('[data-testid="last-updated"]')
        .should('contain', 'just now');
    });

    it('should handle auto-refresh', () => {
      // Enable auto-refresh
      cy.get('[data-testid="auto-refresh-toggle"]').click();
      
      // Should show auto-refresh indicator
      cy.get('[data-testid="auto-refresh-indicator"]')
        .should('be.visible');
      
      // Wait for auto-refresh cycle
      cy.wait(30000);
      
      // Data should be refreshed
      cy.get('[data-testid="refresh-timestamp"]')
        .should('not.be.empty');
    });
  });

  describe('Dashboard Customization', () => {
    it('should allow widget rearrangement', () => {
      // Enter edit mode
      cy.get('[data-testid="edit-dashboard"]').click();
      
      // Should show drag handles
      cy.get('[data-testid="widget-drag-handle"]')
        .should('be.visible');
      
      // Drag and drop widget
      cy.get('[data-testid="revenue-widget"]')
        .drag('[data-testid="drop-zone-2"]');
      
      // Save layout
      cy.get('[data-testid="save-layout"]').click();
      
      // Layout should be persisted
      cy.reload();
      cy.get('[data-testid="revenue-widget"]')
        .should('be.in.viewport');
    });

    it('should add and remove widgets', () => {
      cy.get('[data-testid="edit-dashboard"]').click();
      
      // Add new widget
      cy.get('[data-testid="add-widget"]').click();
      cy.get('[data-testid="expense-trend-widget"]').click();
      
      // Widget should be added
      cy.get('[data-testid="expense-trend-widget"]')
        .should('be.visible');
      
      // Remove widget
      cy.get('[data-testid="remove-widget"]').first().click();
      cy.get('[data-testid="confirm-remove"]').click();
      
      // Widget should be removed
      cy.get('[data-testid="removed-widget"]')
        .should('not.exist');
    });

    it('should configure widget settings', () => {
      // Open widget settings
      cy.get('[data-testid="widget-settings"]').first().click();
      
      // Modify settings
      cy.get('[data-testid="chart-type-setting"]')
        .select('line');
      
      cy.get('[data-testid="time-period-setting"]')
        .select('monthly');
      
      // Apply settings
      cy.get('[data-testid="apply-settings"]').click();
      
      // Widget should update
      cy.get('[data-testid="widget-chart"]')
        .should('have.attr', 'data-type', 'line');
    });
  });

  describe('Mobile Responsiveness', () => {
    it('should adapt to mobile viewport', () => {
      cy.viewport('iphone-x');
      
      // Mobile navigation should be available
      cy.get('[data-testid="mobile-menu-button"]')
        .should('be.visible');
      
      // Charts should be responsive
      cy.get('[data-testid="revenue-chart"]')
        .should('be.visible')
        .and('have.css', 'width')
        .and('match', /\d+px/);
    });

    it('should support touch interactions', () => {
      cy.viewport('ipad-2');
      
      // Touch scroll
      cy.get('[data-testid="dashboard-content"]')
        .trigger('touchstart', { clientX: 100, clientY: 100 })
        .trigger('touchmove', { clientX: 100, clientY: 50 })
        .trigger('touchend');
      
      // Chart touch interactions
      cy.get('[data-testid="chart-area"]')
        .trigger('touchstart')
        .trigger('touchend');
      
      // Should show mobile-friendly tooltips
      cy.get('[data-testid="mobile-tooltip"]')
        .should('be.visible');
    });
  });

  describe('Performance and Loading', () => {
    it('should show loading states', () => {
      // Intercept API call with delay
      cy.intercept('GET', '/api/v1/dashboard/metrics', {
        delay: 2000,
        fixture: 'dashboard-metrics.json'
      }).as('slowMetrics');
      
      cy.visit('/dashboard');
      
      // Should show loading skeleton
      cy.get('[data-testid="loading-skeleton"]')
        .should('be.visible');
      
      cy.wait('@slowMetrics');
      
      // Loading should disappear
      cy.get('[data-testid="loading-skeleton"]')
        .should('not.exist');
    });

    it('should handle large datasets efficiently', () => {
      // Load dashboard with large dataset
      cy.intercept('GET', '/api/v1/dashboard/data', {
        fixture: 'large-dataset.json'
      }).as('largeData');
      
      cy.visit('/dashboard');
      cy.wait('@largeData');
      
      // Dashboard should remain responsive
      cy.get('[data-testid="dashboard-content"]')
        .should('be.visible');
      
      // Scrolling should be smooth
      cy.get('[data-testid="data-grid"]')
        .scrollTo('bottom');
      
      // Virtual scrolling should work
      cy.get('[data-testid="virtual-row"]')
        .should('have.length.at.most', 50);
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', () => {
      // Mock API error
      cy.intercept('GET', '/api/v1/dashboard/metrics', {
        statusCode: 500,
        body: { error: 'Internal server error' }
      }).as('apiError');
      
      cy.visit('/dashboard');
      cy.wait('@apiError');
      
      // Should show error message
      cy.get('[data-testid="error-message"]')
        .should('be.visible')
        .and('contain', 'Unable to load dashboard data');
      
      // Should provide retry option
      cy.get('[data-testid="retry-button"]')
        .should('be.visible');
    });

    it('should recover from network errors', () => {
      // Mock network error then success
      cy.intercept('GET', '/api/v1/dashboard/metrics', {
        forceNetworkError: true
      }).as('networkError');
      
      cy.visit('/dashboard');
      cy.wait('@networkError');
      
      // Show error state
      cy.get('[data-testid="network-error"]')
        .should('be.visible');
      
      // Mock successful retry
      cy.intercept('GET', '/api/v1/dashboard/metrics', {
        fixture: 'dashboard-metrics.json'
      }).as('successfulRetry');
      
      cy.get('[data-testid="retry-button"]').click();
      cy.wait('@successfulRetry');
      
      // Should show data
      cy.get('[data-testid="dashboard-content"]')
        .should('be.visible');
    });
  });

  describe('Accessibility', () => {
    it('should be fully accessible', () => {
      cy.checkA11y();
    });

    it('should support screen readers', () => {
      // Check ARIA labels
      cy.get('[data-testid="revenue-metric"]')
        .should('have.attr', 'aria-label');
      
      // Check semantic structure
      cy.get('main[role="main"]').should('exist');
      cy.get('h1').should('be.visible');
      
      // Check focus management
      cy.get('[data-testid="skip-to-content"]')
        .should('be.visible')
        .and('have.attr', 'href', '#main-content');
    });

    it('should support high contrast mode', () => {
      // Enable high contrast
      cy.get('[data-testid="accessibility-menu"]').click();
      cy.get('[data-testid="high-contrast-toggle"]').click();
      
      // Should apply high contrast styles
      cy.get('[data-testid="dashboard-content"]')
        .should('have.class', 'high-contrast');
      
      // Charts should be accessible
      cy.get('[data-testid="chart-element"]')
        .should('have.attr', 'aria-describedby');
    });
  });
}); 