describe('Report Generation and Export', () => {
  beforeEach(() => {
    cy.resetAppState();
    cy.seedTestData();
    cy.loginAsTestUser();
    
    // Upload and process test data first
    cy.visit('/files');
    cy.uploadFile('[data-testid="file-input"]', 'test-financial-data.xlsx');
    cy.get('[data-testid="processing-complete"]', { timeout: 60000 })
      .should('be.visible');
  });

  describe('Report Creation', () => {
    beforeEach(() => {
      cy.visit('/reports');
    });

    it('should display report templates', () => {
      cy.get('[data-testid="report-templates"]').should('be.visible');
      
      // Should show available templates
      cy.get('[data-testid="financial-analysis-template"]').should('be.visible');
      cy.get('[data-testid="executive-summary-template"]').should('be.visible');
      cy.get('[data-testid="detailed-projections-template"]').should('be.visible');
      cy.get('[data-testid="scenario-comparison-template"]').should('be.visible');
    });

    it('should create financial analysis report', () => {
      cy.get('[data-testid="financial-analysis-template"]').click();
      
      // Configure report
      cy.get('[data-testid="report-title-input"]')
        .type('Q4 2023 Financial Analysis');
      
      cy.get('[data-testid="report-description-input"]')
        .type('Comprehensive analysis of Q4 financial performance and projections');
      
      // Select data sources
      cy.get('[data-testid="data-source-selector"]').click();
      cy.get('[data-testid="uploaded-file-option"]').first().click();
      
      // Select time period
      cy.get('[data-testid="time-period-select"]').select('Q4 2023');
      
      // Configure sections
      cy.get('[data-testid="include-executive-summary"]').check();
      cy.get('[data-testid="include-financial-statements"]').check();
      cy.get('[data-testid="include-ratio-analysis"]').check();
      cy.get('[data-testid="include-charts"]').check();
      
      cy.get('[data-testid="generate-report-button"]').click();
      
      // Should show generation progress
      cy.get('[data-testid="report-generation-progress"]')
        .should('be.visible');
      
      // Should complete generation
      cy.get('[data-testid="report-generation-complete"]', { timeout: 60000 })
        .should('be.visible');
      
      // Should show report preview
      cy.get('[data-testid="report-preview"]').should('be.visible');
    });

    it('should create executive summary report', () => {
      cy.get('[data-testid="executive-summary-template"]').click();
      
      cy.get('[data-testid="report-title-input"]')
        .type('Executive Summary - Q4 Results');
      
      // Configure summary sections
      cy.get('[data-testid="key-metrics-section"]').check();
      cy.get('[data-testid="highlights-section"]').check();
      cy.get('[data-testid="outlook-section"]').check();
      
      // Set target audience
      cy.get('[data-testid="target-audience-select"]').select('Board of Directors');
      
      cy.get('[data-testid="generate-report-button"]').click();
      
      cy.get('[data-testid="report-generation-complete"]', { timeout: 60000 })
        .should('be.visible');
      
      // Executive summary should be concise
      cy.get('[data-testid="report-page-count"]')
        .should('contain', '2-3 pages');
    });

    it('should create scenario comparison report', () => {
      // First create scenarios
      cy.visit('/scenarios');
      
      ['Base Case', 'Optimistic', 'Pessimistic'].forEach(scenarioName => {
        cy.get('[data-testid="create-scenario-button"]').click();
        cy.get('[data-testid="scenario-name-input"]').type(scenarioName);
        cy.get('[data-testid="create-scenario-submit"]').click();
        cy.wait(500);
      });
      
      // Now create comparison report
      cy.visit('/reports');
      cy.get('[data-testid="scenario-comparison-template"]').click();
      
      // Select scenarios to compare
      cy.get('[data-testid="scenario-selector"]').click();
      cy.get('[data-testid="base-case-checkbox"]').check();
      cy.get('[data-testid="optimistic-checkbox"]').check();
      cy.get('[data-testid="pessimistic-checkbox"]').check();
      
      // Configure comparison metrics
      cy.get('[data-testid="npv-comparison"]').check();
      cy.get('[data-testid="irr-comparison"]').check();
      cy.get('[data-testid="sensitivity-analysis"]').check();
      
      cy.get('[data-testid="generate-report-button"]').click();
      
      cy.get('[data-testid="report-generation-complete"]', { timeout: 60000 })
        .should('be.visible');
      
      // Should show scenario comparison charts
      cy.get('[data-testid="scenario-comparison-chart"]')
        .should('be.visible');
    });

    it('should customize report layout and styling', () => {
      cy.get('[data-testid="financial-analysis-template"]').click();
      
      // Open customization panel
      cy.get('[data-testid="customize-report-button"]').click();
      
      // Customize layout
      cy.get('[data-testid="layout-select"]').select('Two Column');
      cy.get('[data-testid="font-family-select"]').select('Arial');
      cy.get('[data-testid="font-size-select"]').select('11pt');
      
      // Customize colors
      cy.get('[data-testid="primary-color-picker"]').click();
      cy.get('[data-testid="color-option-blue"]').click();
      
      // Add company logo
      cy.get('[data-testid="upload-logo-button"]').click();
      cy.uploadFile('[data-testid="logo-file-input"]', 'company-logo.png');
      
      // Add header/footer
      cy.get('[data-testid="header-text-input"]')
        .type('Company Financial Report');
      cy.get('[data-testid="footer-text-input"]')
        .type('Confidential - Internal Use Only');
      
      cy.get('[data-testid="apply-customization"]').click();
      
      // Generate with custom styling
      cy.get('[data-testid="generate-report-button"]').click();
      
      cy.get('[data-testid="report-generation-complete"]', { timeout: 60000 })
        .should('be.visible');
      
      // Should show customized layout
      cy.get('[data-testid="report-preview"]')
        .should('contain', 'Company Financial Report');
    });
  });

  describe('Report Management', () => {
    beforeEach(() => {
      cy.visit('/reports');
      
      // Generate a test report first
      cy.get('[data-testid="financial-analysis-template"]').click();
      cy.get('[data-testid="report-title-input"]').type('Test Report');
      cy.get('[data-testid="generate-report-button"]').click();
      cy.get('[data-testid="report-generation-complete"]', { timeout: 60000 })
        .should('be.visible');
      
      // Go back to reports list
      cy.get('[data-testid="back-to-reports"]').click();
    });

    it('should display generated reports list', () => {
      cy.get('[data-testid="reports-list"]').should('be.visible');
      
      // Should show report details
      cy.get('[data-testid="report-item"]')
        .should('contain', 'Test Report')
        .and('contain', 'Financial Analysis');
      
      // Should show generation date
      cy.get('[data-testid="report-date"]').should('be.visible');
      
      // Should show report status
      cy.get('[data-testid="report-status"]')
        .should('contain', 'Completed');
    });

    it('should preview reports', () => {
      cy.get('[data-testid="preview-report"]').first().click();
      
      // Should open preview modal
      cy.get('[data-testid="report-preview-modal"]')
        .should('be.visible');
      
      // Should show report pages
      cy.get('[data-testid="report-page"]').should('be.visible');
      
      // Should have navigation controls
      cy.get('[data-testid="next-page"]').should('be.visible');
      cy.get('[data-testid="previous-page"]').should('be.visible');
      cy.get('[data-testid="page-number"]').should('be.visible');
      
      // Should allow zooming
      cy.get('[data-testid="zoom-in"]').click();
      cy.get('[data-testid="zoom-level"]').should('contain', '125%');
    });

    it('should edit report metadata', () => {
      cy.get('[data-testid="edit-report"]').first().click();
      
      // Should open edit modal
      cy.get('[data-testid="edit-report-modal"]')
        .should('be.visible');
      
      // Update title and description
      cy.get('[data-testid="report-title-edit"]')
        .clear()
        .type('Updated Test Report');
      
      cy.get('[data-testid="report-description-edit"]')
        .clear()
        .type('Updated description for the test report');
      
      // Add tags
      cy.get('[data-testid="report-tags-input"]')
        .type('quarterly{enter}financial{enter}analysis{enter}');
      
      cy.get('[data-testid="save-report-changes"]').click();
      
      // Should show updated information
      cy.get('[data-testid="report-item"]')
        .should('contain', 'Updated Test Report');
    });

    it('should organize reports by folders', () => {
      // Create folder
      cy.get('[data-testid="create-folder-button"]').click();
      cy.get('[data-testid="folder-name-input"]').type('Q4 Reports');
      cy.get('[data-testid="create-folder-submit"]').click();
      
      // Move report to folder
      cy.get('[data-testid="move-report"]').first().click();
      cy.get('[data-testid="folder-selector"]').select('Q4 Reports');
      cy.get('[data-testid="move-confirm"]').click();
      
      // Navigate to folder
      cy.get('[data-testid="folder-item"]')
        .contains('Q4 Reports')
        .click();
      
      // Should show moved report
      cy.get('[data-testid="report-item"]')
        .should('contain', 'Test Report');
    });

    it('should search and filter reports', () => {
      // Search by title
      cy.get('[data-testid="report-search"]').type('Test');
      
      // Should filter results
      cy.get('[data-testid="report-item"]')
        .should('contain', 'Test Report');
      
      // Filter by type
      cy.get('[data-testid="report-type-filter"]')
        .select('Financial Analysis');
      
      // Filter by date range
      cy.get('[data-testid="date-range-filter"]').click();
      cy.get('[data-testid="last-week-option"]').click();
      
      // Should show filtered results
      cy.get('[data-testid="filtered-results"]')
        .should('be.visible');
      
      // Clear filters
      cy.get('[data-testid="clear-filters"]').click();
    });
  });

  describe('Report Export', () => {
    beforeEach(() => {
      cy.visit('/reports');
      
      // Generate a test report
      cy.get('[data-testid="financial-analysis-template"]').click();
      cy.get('[data-testid="report-title-input"]').type('Export Test Report');
      cy.get('[data-testid="generate-report-button"]').click();
      cy.get('[data-testid="report-generation-complete"]', { timeout: 60000 })
        .should('be.visible');
    });

    it('should export report as PDF', () => {
      cy.get('[data-testid="export-report"]').click();
      cy.get('[data-testid="export-pdf"]').click();
      
      // Should show export options
      cy.get('[data-testid="pdf-export-options"]')
        .should('be.visible');
      
      // Configure PDF options
      cy.get('[data-testid="page-size-select"]').select('A4');
      cy.get('[data-testid="orientation-select"]').select('Portrait');
      cy.get('[data-testid="include-cover-page"]').check();
      
      cy.get('[data-testid="export-pdf-button"]').click();
      
      // Should show export progress
      cy.get('[data-testid="export-progress"]').should('be.visible');
      
      // Should download PDF
      cy.readFile('cypress/downloads/export-test-report.pdf')
        .should('exist');
    });

    it('should export report as Excel', () => {
      cy.get('[data-testid="export-report"]').click();
      cy.get('[data-testid="export-excel"]').click();
      
      // Configure Excel export
      cy.get('[data-testid="include-charts-excel"]').check();
      cy.get('[data-testid="include-raw-data"]').check();
      cy.get('[data-testid="separate-worksheets"]').check();
      
      cy.get('[data-testid="export-excel-button"]').click();
      
      // Should download Excel file
      cy.readFile('cypress/downloads/export-test-report.xlsx')
        .should('exist');
    });

    it('should export report as PowerPoint', () => {
      cy.get('[data-testid="export-report"]').click();
      cy.get('[data-testid="export-powerpoint"]').click();
      
      // Configure PowerPoint export
      cy.get('[data-testid="slide-template-select"]')
        .select('Corporate Template');
      
      cy.get('[data-testid="slides-per-section"]').select('2');
      cy.get('[data-testid="include-speaker-notes"]').check();
      
      cy.get('[data-testid="export-powerpoint-button"]').click();
      
      // Should download PowerPoint file
      cy.readFile('cypress/downloads/export-test-report.pptx')
        .should('exist');
    });

    it('should export charts separately', () => {
      cy.get('[data-testid="export-charts-only"]').click();
      
      // Select chart formats
      cy.get('[data-testid="chart-format-png"]').check();
      cy.get('[data-testid="chart-format-svg"]').check();
      
      // Select resolution
      cy.get('[data-testid="chart-resolution"]').select('High (300 DPI)');
      
      cy.get('[data-testid="export-charts-button"]').click();
      
      // Should download chart files
      cy.readFile('cypress/downloads/charts.zip')
        .should('exist');
    });

    it('should email report', () => {
      cy.get('[data-testid="email-report"]').click();
      
      // Fill email form
      cy.get('[data-testid="email-recipients"]')
        .type('manager@company.com, analyst@company.com');
      
      cy.get('[data-testid="email-subject"]')
        .type('Q4 Financial Analysis Report');
      
      cy.get('[data-testid="email-message"]')
        .type('Please find attached the Q4 financial analysis report for your review.');
      
      // Select attachments
      cy.get('[data-testid="attach-pdf"]').check();
      cy.get('[data-testid="attach-excel"]').check();
      
      cy.get('[data-testid="send-email-button"]').click();
      
      // Should show confirmation
      cy.get('[data-testid="email-sent-confirmation"]')
        .should('be.visible')
        .and('contain', 'Report sent successfully');
    });
  });

  describe('Report Scheduling', () => {
    it('should schedule automatic report generation', () => {
      cy.get('[data-testid="schedule-report-button"]').click();
      
      // Select report template
      cy.get('[data-testid="template-select"]')
        .select('Financial Analysis');
      
      // Configure schedule
      cy.get('[data-testid="schedule-frequency"]').select('Monthly');
      cy.get('[data-testid="schedule-day"]').select('Last Day');
      cy.get('[data-testid="schedule-time"]').type('09:00');
      
      // Configure recipients
      cy.get('[data-testid="schedule-recipients"]')
        .type('team@company.com');
      
      // Set data sources
      cy.get('[data-testid="auto-data-source"]')
        .select('Latest Uploaded File');
      
      cy.get('[data-testid="create-schedule"]').click();
      
      // Should show scheduled report
      cy.get('[data-testid="scheduled-reports"]')
        .should('contain', 'Monthly Financial Analysis');
    });

    it('should manage scheduled reports', () => {
      // Create a scheduled report first
      cy.get('[data-testid="schedule-report-button"]').click();
      cy.get('[data-testid="template-select"]').select('Executive Summary');
      cy.get('[data-testid="schedule-frequency"]').select('Weekly');
      cy.get('[data-testid="create-schedule"]').click();
      
      // View scheduled reports
      cy.get('[data-testid="view-schedules"]').click();
      
      // Should show schedule list
      cy.get('[data-testid="schedule-item"]')
        .should('be.visible');
      
      // Edit schedule
      cy.get('[data-testid="edit-schedule"]').first().click();
      cy.get('[data-testid="schedule-frequency"]').select('Bi-weekly');
      cy.get('[data-testid="update-schedule"]').click();
      
      // Pause schedule
      cy.get('[data-testid="pause-schedule"]').first().click();
      cy.get('[data-testid="schedule-status"]')
        .should('contain', 'Paused');
      
      // Delete schedule
      cy.get('[data-testid="delete-schedule"]').first().click();
      cy.get('[data-testid="confirm-delete-schedule"]').click();
    });
  });

  describe('Report Analytics', () => {
    it('should track report usage analytics', () => {
      cy.visit('/reports/analytics');
      
      // Should show usage metrics
      cy.get('[data-testid="reports-generated-metric"]')
        .should('be.visible');
      
      cy.get('[data-testid="most-popular-templates"]')
        .should('be.visible');
      
      cy.get('[data-testid="export-formats-chart"]')
        .should('be.visible');
      
      // Should show user engagement
      cy.get('[data-testid="user-engagement-chart"]')
        .should('be.visible');
    });

    it('should show report performance metrics', () => {
      cy.visit('/reports/analytics');
      
      // Generation time metrics
      cy.get('[data-testid="avg-generation-time"]')
        .should('be.visible');
      
      // Success rate
      cy.get('[data-testid="success-rate-metric"]')
        .should('be.visible');
      
      // Error analysis
      cy.get('[data-testid="error-analysis-chart"]')
        .should('be.visible');
    });
  });

  describe('Report Collaboration', () => {
    it('should share reports with team members', () => {
      cy.get('[data-testid="share-report"]').first().click();
      
      // Add team members
      cy.get('[data-testid="team-member-email"]')
        .type('colleague@company.com');
      
      cy.get('[data-testid="permission-level"]')
        .select('View Only');
      
      cy.get('[data-testid="add-collaborator"]').click();
      
      // Set expiration
      cy.get('[data-testid="share-expiration"]')
        .type('2024-12-31');
      
      cy.get('[data-testid="share-report-button"]').click();
      
      // Should show share confirmation
      cy.get('[data-testid="share-confirmation"]')
        .should('be.visible');
    });

    it('should add comments and annotations', () => {
      cy.get('[data-testid="preview-report"]').first().click();
      
      // Add comment to specific section
      cy.get('[data-testid="add-annotation-button"]').click();
      cy.get('[data-testid="annotation-text"]')
        .type('This metric shows significant improvement');
      
      cy.get('[data-testid="save-annotation"]').click();
      
      // Should show annotation indicator
      cy.get('[data-testid="annotation-indicator"]')
        .should('be.visible');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle report generation failures', () => {
      // Mock API error
      cy.intercept('POST', '/api/v1/reports/generate', {
        statusCode: 500,
        body: { error: 'Generation failed' }
      }).as('generateError');
      
      cy.get('[data-testid="financial-analysis-template"]').click();
      cy.get('[data-testid="report-title-input"]').type('Failed Report');
      cy.get('[data-testid="generate-report-button"]').click();
      
      cy.wait('@generateError');
      
      // Should show error message
      cy.get('[data-testid="generation-error"]')
        .should('be.visible')
        .and('contain', 'Report generation failed');
      
      // Should provide retry option
      cy.get('[data-testid="retry-generation"]')
        .should('be.visible');
    });

    it('should handle large report generation', () => {
      cy.get('[data-testid="detailed-projections-template"]').click();
      
      // Select large dataset
      cy.get('[data-testid="include-all-data"]').check();
      cy.get('[data-testid="detailed-breakdown"]').check();
      
      cy.get('[data-testid="generate-report-button"]').click();
      
      // Should show extended progress for large reports
      cy.get('[data-testid="extended-progress-message"]')
        .should('be.visible')
        .and('contain', 'Large report generation in progress');
      
      // Should complete eventually
      cy.get('[data-testid="report-generation-complete"]', { timeout: 120000 })
        .should('be.visible');
    });
  });

  describe('Accessibility', () => {
    it('should be accessible throughout report workflow', () => {
      cy.visit('/reports');
      cy.checkA11y();
      
      // Check report generation form accessibility
      cy.get('[data-testid="financial-analysis-template"]').click();
      cy.checkA11y();
      
      // Check report preview accessibility
      cy.get('[data-testid="report-title-input"]').type('Accessibility Test');
      cy.get('[data-testid="generate-report-button"]').click();
      cy.get('[data-testid="report-generation-complete"]', { timeout: 60000 })
        .should('be.visible');
      
      cy.checkA11y();
    });

    it('should support keyboard navigation', () => {
      cy.visit('/reports');
      
      // Navigate through report templates
      cy.get('body').tab();
      cy.focused().should('have.attr', 'data-testid', 'financial-analysis-template');
      
      cy.focused().type('{enter}');
      
      // Should open template
      cy.get('[data-testid="report-configuration"]')
        .should('be.visible');
    });
  });
}); 