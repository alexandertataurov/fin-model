describe('Parameter Modification and Scenario Modeling', () => {
  beforeEach(() => {
    cy.resetAppState();
    cy.seedTestData();
    cy.loginAsTestUser();
  });

  describe('Parameter Management', () => {
    beforeEach(() => {
      cy.visit('/parameters');
    });

    it('should display existing parameters', () => {
      cy.get('[data-testid="parameters-list"]').should('be.visible');
      cy.get('[data-testid="parameter-item"]').should('have.length.at.least', 1);
      
      // Check parameter details
      cy.get('[data-testid="parameter-name"]').first().should('be.visible');
      cy.get('[data-testid="parameter-value"]').first().should('be.visible');
      cy.get('[data-testid="parameter-category"]').first().should('be.visible');
    });

    it('should create new parameters', () => {
      cy.get('[data-testid="add-parameter-button"]').click();
      
      // Fill parameter form
      cy.get('[data-testid="parameter-name-input"]').type('Market Growth Rate');
      cy.get('[data-testid="parameter-value-input"]').type('0.08');
      cy.get('[data-testid="parameter-category-select"]').select('Market Assumptions');
      cy.get('[data-testid="parameter-description-input"]')
        .type('Expected annual market growth rate based on industry analysis');
      
      // Set parameter constraints
      cy.get('[data-testid="min-value-input"]').type('0.01');
      cy.get('[data-testid="max-value-input"]').type('0.20');
      
      cy.get('[data-testid="save-parameter-button"]').click();
      
      // Should show success message
      cy.get('[data-testid="parameter-created-message"]')
        .should('be.visible')
        .and('contain', 'Parameter created successfully');
      
      // Parameter should appear in list
      cy.get('[data-testid="parameter-item"]')
        .should('contain', 'Market Growth Rate');
    });

    it('should modify existing parameters', () => {
      // Edit first parameter
      cy.get('[data-testid="edit-parameter"]').first().click();
      
      // Modify value
      cy.get('[data-testid="parameter-value-input"]')
        .clear()
        .type('0.12');
      
      // Add sensitivity range
      cy.get('[data-testid="sensitivity-range-checkbox"]').check();
      cy.get('[data-testid="sensitivity-min"]').type('0.10');
      cy.get('[data-testid="sensitivity-max"]').type('0.15');
      
      cy.get('[data-testid="update-parameter-button"]').click();
      
      // Should show updated value
      cy.get('[data-testid="parameter-value"]').first()
        .should('contain', '12.0%');
      
      // Should show sensitivity indicator
      cy.get('[data-testid="sensitivity-indicator"]').first()
        .should('be.visible');
    });

    it('should validate parameter inputs', () => {
      cy.get('[data-testid="add-parameter-button"]').click();
      
      // Try to save with invalid data
      cy.get('[data-testid="parameter-value-input"]').type('invalid');
      cy.get('[data-testid="save-parameter-button"]').click();
      
      // Should show validation error
      cy.get('[data-testid="value-validation-error"]')
        .should('be.visible')
        .and('contain', 'Please enter a valid number');
      
      // Test range validation
      cy.get('[data-testid="parameter-value-input"]').clear().type('0.5');
      cy.get('[data-testid="min-value-input"]').type('0.1');
      cy.get('[data-testid="max-value-input"]').type('0.4');
      
      cy.get('[data-testid="save-parameter-button"]').click();
      
      cy.get('[data-testid="range-validation-error"]')
        .should('be.visible')
        .and('contain', 'Value must be within the specified range');
    });

    it('should organize parameters by categories', () => {
      // Filter by category
      cy.get('[data-testid="category-filter"]').select('Growth Assumptions');
      
      // Should show only growth parameters
      cy.get('[data-testid="parameter-item"]')
        .should('have.length.at.least', 1);
      
      cy.get('[data-testid="parameter-category"]')
        .each(($el) => {
          cy.wrap($el).should('contain', 'Growth');
        });
      
      // Clear filter
      cy.get('[data-testid="clear-category-filter"]').click();
      
      // Should show all parameters
      cy.get('[data-testid="parameter-item"]')
        .should('have.length.at.least', 3);
    });

    it('should import parameters from file', () => {
      cy.get('[data-testid="import-parameters-button"]').click();
      
      // Upload parameter file
      cy.uploadFile('[data-testid="parameter-file-input"]', 'parameters-template.xlsx');
      
      // Map columns
      cy.get('[data-testid="name-column-select"]').select('Parameter Name');
      cy.get('[data-testid="value-column-select"]').select('Value');
      cy.get('[data-testid="category-column-select"]').select('Category');
      
      cy.get('[data-testid="import-button"]').click();
      
      // Should show import results
      cy.get('[data-testid="import-summary"]')
        .should('be.visible')
        .and('contain', 'imported successfully');
      
      // Parameters should be added to list
      cy.get('[data-testid="parameter-item"]')
        .should('have.length.at.least', 5);
    });
  });

  describe('Scenario Creation', () => {
    beforeEach(() => {
      cy.visit('/scenarios');
    });

    it('should create base scenario', () => {
      cy.get('[data-testid="create-scenario-button"]').click();
      
      // Fill scenario details
      cy.get('[data-testid="scenario-name-input"]').type('Base Case');
      cy.get('[data-testid="scenario-description-input"]')
        .type('Conservative baseline assumptions for financial projections');
      
      // Select parameters for scenario
      cy.get('[data-testid="parameter-selector"]').click();
      cy.get('[data-testid="growth-rate-checkbox"]').check();
      cy.get('[data-testid="discount-rate-checkbox"]').check();
      cy.get('[data-testid="tax-rate-checkbox"]').check();
      
      // Set scenario-specific values
      cy.get('[data-testid="growth-rate-scenario-value"]').type('0.08');
      cy.get('[data-testid="discount-rate-scenario-value"]').type('0.10');
      cy.get('[data-testid="tax-rate-scenario-value"]').type('0.25');
      
      cy.get('[data-testid="create-scenario-submit"]').click();
      
      // Should create scenario
      cy.get('[data-testid="scenario-created-message"]')
        .should('be.visible');
      
      // Scenario should appear in list
      cy.get('[data-testid="scenario-item"]')
        .should('contain', 'Base Case');
    });

    it('should create optimistic and pessimistic scenarios', () => {
      // Create optimistic scenario
      cy.get('[data-testid="create-scenario-button"]').click();
      cy.get('[data-testid="scenario-template-select"]').select('Optimistic');
      
      cy.get('[data-testid="scenario-name-input"]').type('Optimistic Case');
      
      // Template should pre-populate values
      cy.get('[data-testid="growth-rate-scenario-value"]')
        .should('have.value', '0.15');
      
      cy.get('[data-testid="create-scenario-submit"]').click();
      
      // Create pessimistic scenario
      cy.get('[data-testid="create-scenario-button"]').click();
      cy.get('[data-testid="scenario-template-select"]').select('Pessimistic');
      
      cy.get('[data-testid="scenario-name-input"]').type('Pessimistic Case');
      
      cy.get('[data-testid="growth-rate-scenario-value"]')
        .should('have.value', '0.03');
      
      cy.get('[data-testid="create-scenario-submit"]').click();
      
      // Should have three scenarios
      cy.get('[data-testid="scenario-item"]')
        .should('have.length', 3);
    });

    it('should duplicate and modify scenarios', () => {
      // Create base scenario first
      cy.get('[data-testid="create-scenario-button"]').click();
      cy.get('[data-testid="scenario-name-input"]').type('Original Scenario');
      cy.get('[data-testid="create-scenario-submit"]').click();
      
      // Duplicate scenario
      cy.get('[data-testid="duplicate-scenario"]').first().click();
      
      // Modify duplicated scenario
      cy.get('[data-testid="scenario-name-input"]')
        .should('have.value', 'Copy of Original Scenario')
        .clear()
        .type('Modified Scenario');
      
      // Change some parameter values
      cy.get('[data-testid="growth-rate-scenario-value"]')
        .clear()
        .type('0.12');
      
      cy.get('[data-testid="create-scenario-submit"]').click();
      
      // Should have both scenarios
      cy.get('[data-testid="scenario-item"]')
        .should('contain', 'Original Scenario')
        .and('contain', 'Modified Scenario');
    });
  });

  describe('Scenario Analysis', () => {
    beforeEach(() => {
      // Create test scenarios
      cy.visit('/scenarios');
      
      // Create multiple scenarios for comparison
      const scenarios = [
        { name: 'Conservative', template: 'Pessimistic' },
        { name: 'Moderate', template: 'Base' },
        { name: 'Aggressive', template: 'Optimistic' }
      ];
      
      scenarios.forEach(scenario => {
        cy.get('[data-testid="create-scenario-button"]').click();
        cy.get('[data-testid="scenario-template-select"]').select(scenario.template);
        cy.get('[data-testid="scenario-name-input"]').type(scenario.name);
        cy.get('[data-testid="create-scenario-submit"]').click();
        cy.wait(500);
      });
    });

    it('should run scenario calculations', () => {
      // Select scenario for analysis
      cy.get('[data-testid="scenario-item"]').first().click();
      
      // Run calculations
      cy.get('[data-testid="run-analysis-button"]').click();
      
      // Should show calculation progress
      cy.get('[data-testid="calculation-progress"]')
        .should('be.visible');
      
      // Wait for completion
      cy.get('[data-testid="analysis-complete"]', { timeout: 30000 })
        .should('be.visible');
      
      // Should show results
      cy.get('[data-testid="scenario-results"]')
        .should('be.visible');
      
      // Check key metrics
      cy.get('[data-testid="npv-result"]').should('be.visible');
      cy.get('[data-testid="irr-result"]').should('be.visible');
      cy.get('[data-testid="payback-period"]').should('be.visible');
    });

    it('should compare multiple scenarios', () => {
      // Select scenarios for comparison
      cy.get('[data-testid="select-scenario-checkbox"]').first().check();
      cy.get('[data-testid="select-scenario-checkbox"]').eq(1).check();
      cy.get('[data-testid="select-scenario-checkbox"]').eq(2).check();
      
      cy.get('[data-testid="compare-scenarios-button"]').click();
      
      // Should show comparison view
      cy.get('[data-testid="scenario-comparison"]')
        .should('be.visible');
      
      // Should show comparison table
      cy.get('[data-testid="comparison-table"]')
        .should('be.visible')
        .within(() => {
          cy.get('[data-testid="scenario-column"]')
            .should('have.length', 3);
        });
      
      // Should show comparison charts
      cy.get('[data-testid="comparison-chart"]')
        .should('be.visible');
      
      // Check waterfall chart for differences
      cy.get('[data-testid="scenario-waterfall"]')
        .should('be.visible');
    });

    it('should perform sensitivity analysis', () => {
      cy.get('[data-testid="scenario-item"]').first().click();
      cy.get('[data-testid="sensitivity-analysis-tab"]').click();
      
      // Select parameters for sensitivity analysis
      cy.get('[data-testid="sensitivity-parameter"]')
        .contains('Growth Rate')
        .click();
      
      // Set sensitivity range
      cy.get('[data-testid="sensitivity-range-slider"]')
        .trigger('mousedown', { clientX: 100 })
        .trigger('mousemove', { clientX: 150 })
        .trigger('mouseup');
      
      cy.get('[data-testid="run-sensitivity-button"]').click();
      
      // Should show sensitivity results
      cy.get('[data-testid="sensitivity-chart"]')
        .should('be.visible');
      
      // Should show tornado diagram
      cy.get('[data-testid="tornado-diagram"]')
        .should('be.visible');
      
      // Should highlight most sensitive parameters
      cy.get('[data-testid="sensitivity-ranking"]')
        .should('be.visible')
        .within(() => {
          cy.get('[data-testid="high-sensitivity"]')
            .should('have.length.at.least', 1);
        });
    });

    it('should run Monte Carlo simulation', () => {
      cy.get('[data-testid="scenario-item"]').first().click();
      cy.get('[data-testid="monte-carlo-tab"]').click();
      
      // Set simulation parameters
      cy.get('[data-testid="simulation-iterations"]').clear().type('1000');
      
      // Configure parameter distributions
      cy.get('[data-testid="parameter-distribution"]')
        .contains('Growth Rate')
        .within(() => {
          cy.get('[data-testid="distribution-type"]').select('Normal');
          cy.get('[data-testid="standard-deviation"]').type('0.02');
        });
      
      cy.get('[data-testid="run-simulation-button"]').click();
      
      // Should show simulation progress
      cy.get('[data-testid="simulation-progress"]')
        .should('be.visible');
      
      // Should show results
      cy.get('[data-testid="simulation-complete"]', { timeout: 60000 })
        .should('be.visible');
      
      // Should show distribution chart
      cy.get('[data-testid="outcome-distribution"]')
        .should('be.visible');
      
      // Should show confidence intervals
      cy.get('[data-testid="confidence-intervals"]')
        .should('be.visible')
        .within(() => {
          cy.get('[data-testid="p90-value"]').should('be.visible');
          cy.get('[data-testid="p50-value"]').should('be.visible');
          cy.get('[data-testid="p10-value"]').should('be.visible');
        });
    });

    it('should export scenario results', () => {
      cy.get('[data-testid="scenario-item"]').first().click();
      cy.get('[data-testid="run-analysis-button"]').click();
      
      cy.get('[data-testid="analysis-complete"]', { timeout: 30000 })
        .should('be.visible');
      
      // Export to Excel
      cy.get('[data-testid="export-results"]').click();
      cy.get('[data-testid="export-excel"]').click();
      
      // Should download Excel file
      cy.readFile('cypress/downloads/scenario-analysis.xlsx')
        .should('exist');
      
      // Export to PDF report
      cy.get('[data-testid="export-results"]').click();
      cy.get('[data-testid="export-pdf"]').click();
      
      // Should download PDF report
      cy.readFile('cypress/downloads/scenario-report.pdf')
        .should('exist');
    });
  });

  describe('Parameter Impact Analysis', () => {
    it('should show parameter impact visualization', () => {
      cy.visit('/parameters');
      
      // Select parameter for impact analysis
      cy.get('[data-testid="parameter-item"]').first().click();
      cy.get('[data-testid="impact-analysis-tab"]').click();
      
      // Should show impact chart
      cy.get('[data-testid="parameter-impact-chart"]')
        .should('be.visible');
      
      // Should show affected metrics
      cy.get('[data-testid="affected-metrics"]')
        .should('be.visible')
        .within(() => {
          cy.get('[data-testid="metric-impact"]')
            .should('have.length.at.least', 1);
        });
    });

    it('should simulate parameter changes', () => {
      cy.visit('/parameters');
      
      cy.get('[data-testid="parameter-item"]').first().click();
      cy.get('[data-testid="simulate-change-button"]').click();
      
      // Adjust parameter value
      cy.get('[data-testid="simulation-value-slider"]')
        .trigger('mousedown', { clientX: 150 })
        .trigger('mousemove', { clientX: 200 })
        .trigger('mouseup');
      
      // Should show real-time impact
      cy.get('[data-testid="impact-preview"]')
        .should('be.visible');
      
      // Should show affected scenarios
      cy.get('[data-testid="affected-scenarios"]')
        .should('be.visible');
      
      // Apply changes
      cy.get('[data-testid="apply-changes-button"]').click();
      
      // Should update all affected scenarios
      cy.get('[data-testid="scenarios-updated-message"]')
        .should('be.visible');
    });
  });

  describe('Scenario Validation', () => {
    it('should validate scenario assumptions', () => {
      cy.visit('/scenarios');
      cy.get('[data-testid="scenario-item"]').first().click();
      
      cy.get('[data-testid="validate-scenario-button"]').click();
      
      // Should run validation checks
      cy.get('[data-testid="validation-progress"]')
        .should('be.visible');
      
      // Should show validation results
      cy.get('[data-testid="validation-results"]')
        .should('be.visible');
      
      // Should highlight any issues
      cy.get('[data-testid="validation-warnings"]')
        .should('be.visible');
      
      // Should show recommendations
      cy.get('[data-testid="validation-recommendations"]')
        .should('be.visible');
    });

    it('should check parameter consistency', () => {
      cy.visit('/scenarios');
      cy.get('[data-testid="scenario-item"]').first().click();
      
      cy.get('[data-testid="consistency-check-button"]').click();
      
      // Should check for conflicting assumptions
      cy.get('[data-testid="consistency-results"]')
        .should('be.visible');
      
      // Should show relationship matrix
      cy.get('[data-testid="parameter-relationships"]')
        .should('be.visible');
    });
  });

  describe('Scenario Collaboration', () => {
    it('should share scenarios with team members', () => {
      cy.visit('/scenarios');
      cy.get('[data-testid="scenario-item"]').first().click();
      
      cy.get('[data-testid="share-scenario-button"]').click();
      
      // Add team members
      cy.get('[data-testid="team-member-email"]').type('colleague@company.com');
      cy.get('[data-testid="add-member-button"]').click();
      
      // Set permissions
      cy.get('[data-testid="permission-level"]').select('View and Edit');
      
      cy.get('[data-testid="send-invitation-button"]').click();
      
      // Should show confirmation
      cy.get('[data-testid="invitation-sent-message"]')
        .should('be.visible');
    });

    it('should add comments and annotations', () => {
      cy.visit('/scenarios');
      cy.get('[data-testid="scenario-item"]').first().click();
      
      // Add comment to parameter
      cy.get('[data-testid="add-comment-button"]').first().click();
      cy.get('[data-testid="comment-text"]')
        .type('This growth rate seems optimistic based on current market conditions');
      
      cy.get('[data-testid="save-comment-button"]').click();
      
      // Should show comment indicator
      cy.get('[data-testid="comment-indicator"]')
        .should('be.visible');
      
      // Should show comment on hover
      cy.get('[data-testid="parameter-value"]').first().trigger('mouseover');
      cy.get('[data-testid="comment-tooltip"]')
        .should('be.visible')
        .and('contain', 'This growth rate');
    });
  });

  describe('Accessibility and Performance', () => {
    it('should be accessible to screen readers', () => {
      cy.visit('/scenarios');
      cy.checkA11y();
      
      // Check ARIA labels for scenario elements
      cy.get('[data-testid="scenario-item"]')
        .should('have.attr', 'aria-label');
      
      // Check keyboard navigation
      cy.get('[data-testid="scenario-item"]').first()
        .focus()
        .type('{enter}');
      
      // Should open scenario details
      cy.get('[data-testid="scenario-details"]')
        .should('be.visible');
    });

    it('should handle large numbers of scenarios efficiently', () => {
      // Create many scenarios
      cy.visit('/scenarios');
      
      for (let i = 0; i < 20; i++) {
        cy.get('[data-testid="create-scenario-button"]').click();
        cy.get('[data-testid="scenario-name-input"]').type(`Scenario ${i + 1}`);
        cy.get('[data-testid="create-scenario-submit"]').click();
        cy.wait(100);
      }
      
      // Should implement pagination or virtual scrolling
      cy.get('[data-testid="scenario-pagination"]')
        .should('be.visible');
      
      // Should load quickly
      cy.get('[data-testid="scenarios-list"]')
        .should('be.visible');
    });
  });
}); 