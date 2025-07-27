describe('File Upload and Processing Workflow', () => {
  beforeEach(() => {
    cy.resetAppState();
    cy.seedTestData();
    cy.loginAsTestUser();
  });

  describe('File Upload Interface', () => {
    beforeEach(() => {
      cy.visit('/files');
    });

    it('should display file upload interface correctly', () => {
      // Should show upload dropzone
      cy.get('[data-testid="file-dropzone"]')
        .should('be.visible')
        .and('contain', 'Drag & drop files here');
      
      // Should show supported formats
      cy.get('[data-testid="supported-formats"]')
        .should('contain', 'XLSX, XLS');
      
      // Should show file size limit
      cy.get('[data-testid="file-size-limit"]')
        .should('contain', 'Max file size: 10MB');
      
      // Should show browse button
      cy.get('[data-testid="browse-files-button"]')
        .should('be.visible');
    });

    it('should handle file selection via browse button', () => {
      cy.get('[data-testid="browse-files-button"]').click();
      
      // Upload test file
      cy.uploadFile('[data-testid="file-input"]', 'test-financial-data.xlsx');
      
      // Should show file in upload queue
      cy.get('[data-testid="upload-queue"]')
        .should('be.visible')
        .and('contain', 'test-financial-data.xlsx');
      
      // Should show file size
      cy.get('[data-testid="file-size"]')
        .should('be.visible');
      
      // Should show upload progress
      cy.get('[data-testid="upload-progress"]')
        .should('be.visible');
    });

    it('should handle drag and drop file upload', () => {
      // Simulate drag over
      cy.get('[data-testid="file-dropzone"]')
        .trigger('dragover')
        .should('have.class', 'drag-over');
      
      // Simulate file drop
      cy.fixture('test-financial-data.xlsx', 'base64').then(fileContent => {
        const blob = Cypress.Blob.base64StringToBlob(fileContent);
        const file = new File([blob], 'test-financial-data.xlsx', {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        
        cy.get('[data-testid="file-dropzone"]')
          .trigger('drop', {
            dataTransfer: { files: [file] }
          });
      });
      
      // Should show upload started
      cy.get('[data-testid="upload-status"]')
        .should('contain', 'Uploading');
    });

    it('should validate file types', () => {
      // Try to upload invalid file type
      cy.fixture('invalid-file.txt', 'base64').then(fileContent => {
        const blob = Cypress.Blob.base64StringToBlob(fileContent);
        const file = new File([blob], 'invalid-file.txt', { type: 'text/plain' });
        
        cy.get('[data-testid="file-dropzone"]')
          .trigger('drop', {
            dataTransfer: { files: [file] }
          });
      });
      
      // Should show error message
      cy.get('[data-testid="file-error"]')
        .should('be.visible')
        .and('contain', 'Invalid file type');
    });

    it('should validate file size limits', () => {
      // Create large file mock
      const largeFileContent = 'x'.repeat(15 * 1024 * 1024); // 15MB
      const blob = new Blob([largeFileContent]);
      const file = new File([blob], 'large-file.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      
      cy.get('[data-testid="file-dropzone"]')
        .trigger('drop', {
          dataTransfer: { files: [file] }
        });
      
      // Should show file size error
      cy.get('[data-testid="file-error"]')
        .should('contain', 'File too large');
    });

    it('should handle multiple file uploads', () => {
      cy.get('[data-testid="multiple-files-checkbox"]').check();
      
      // Upload multiple files
      const files = ['financial-data-q1.xlsx', 'financial-data-q2.xlsx'];
      
      files.forEach(fileName => {
        cy.uploadFile('[data-testid="file-input"]', fileName);
      });
      
      // Should show both files in queue
      cy.get('[data-testid="upload-queue-item"]')
        .should('have.length', 2);
      
      // Should show total upload progress
      cy.get('[data-testid="total-upload-progress"]')
        .should('be.visible');
    });
  });

  describe('File Processing', () => {
    it('should track file processing status', () => {
      cy.visit('/files');
      
      // Upload file
      cy.uploadFile('[data-testid="file-input"]', 'test-financial-data.xlsx');
      
      // Wait for upload to complete
      cy.get('[data-testid="upload-success"]', { timeout: 30000 })
        .should('be.visible');
      
      // Should show processing status
      cy.get('[data-testid="processing-status"]')
        .should('contain', 'Processing');
      
      // Should show processing steps
      cy.get('[data-testid="processing-steps"]')
        .should('be.visible')
        .within(() => {
          cy.get('[data-testid="step-parsing"]').should('be.visible');
          cy.get('[data-testid="step-validation"]').should('be.visible');
          cy.get('[data-testid="step-extraction"]').should('be.visible');
        });
      
      // Wait for processing to complete
      cy.get('[data-testid="processing-complete"]', { timeout: 60000 })
        .should('be.visible');
      
      // Should show success status
      cy.get('[data-testid="file-status"]')
        .should('contain', 'Completed');
    });

    it('should display processing progress details', () => {
      cy.visit('/files');
      cy.uploadFile('[data-testid="file-input"]', 'test-financial-data.xlsx');
      
      // Should show detailed progress
      cy.get('[data-testid="processing-details"]')
        .should('be.visible')
        .within(() => {
          cy.get('[data-testid="progress-bar"]').should('be.visible');
          cy.get('[data-testid="current-step"]').should('be.visible');
          cy.get('[data-testid="estimated-time"]').should('be.visible');
        });
    });

    it('should handle processing errors gracefully', () => {
      // Mock API to return processing error
      cy.intercept('GET', '/api/v1/files/*/status', {
        statusCode: 200,
        body: {
          status: 'failed',
          error_message: 'Invalid Excel format',
          error_details: 'Unable to parse worksheet'
        }
      });
      
      cy.visit('/files');
      cy.uploadFile('[data-testid="file-input"]', 'corrupted-file.xlsx');
      
      // Should show error status
      cy.get('[data-testid="processing-error"]', { timeout: 30000 })
        .should('be.visible')
        .and('contain', 'Processing failed');
      
      // Should show error details
      cy.get('[data-testid="error-details"]')
        .should('contain', 'Invalid Excel format');
      
      // Should provide retry option
      cy.get('[data-testid="retry-processing"]')
        .should('be.visible');
    });

    it('should allow canceling file processing', () => {
      cy.visit('/files');
      cy.uploadFile('[data-testid="file-input"]', 'large-dataset.xlsx');
      
      // Should show cancel option during processing
      cy.get('[data-testid="cancel-processing"]')
        .should('be.visible')
        .click();
      
      // Should show cancellation confirmation
      cy.get('[data-testid="cancel-confirmation"]')
        .should('be.visible');
      
      cy.get('[data-testid="confirm-cancel"]').click();
      
      // Should show cancelled status
      cy.get('[data-testid="file-status"]')
        .should('contain', 'Cancelled');
    });
  });

  describe('File Management', () => {
    beforeEach(() => {
      cy.visit('/files');
      // Upload and process a test file
      cy.uploadFile('[data-testid="file-input"]', 'test-financial-data.xlsx');
      cy.get('[data-testid="processing-complete"]', { timeout: 60000 })
        .should('be.visible');
    });

    it('should display uploaded files list', () => {
      // Should show files table
      cy.get('[data-testid="files-table"]')
        .should('be.visible');
      
      // Should show file information
      cy.get('[data-testid="file-row"]')
        .should('contain', 'test-financial-data.xlsx')
        .and('contain', 'Completed');
      
      // Should show upload date
      cy.get('[data-testid="upload-date"]')
        .should('be.visible');
      
      // Should show file size
      cy.get('[data-testid="file-size"]')
        .should('be.visible');
    });

    it('should allow file preview', () => {
      cy.get('[data-testid="preview-file"]').first().click();
      
      // Should open preview modal
      cy.get('[data-testid="file-preview-modal"]')
        .should('be.visible');
      
      // Should show file contents
      cy.get('[data-testid="preview-content"]')
        .should('be.visible')
        .within(() => {
          cy.get('[data-testid="data-table"]').should('be.visible');
          cy.get('[data-testid="sheet-tabs"]').should('be.visible');
        });
      
      // Should allow switching between sheets
      cy.get('[data-testid="sheet-tab"]').eq(1).click();
      cy.get('[data-testid="active-sheet"]')
        .should('not.contain', 'Sheet1');
    });

    it('should provide file download functionality', () => {
      cy.get('[data-testid="download-file"]').first().click();
      
      // Should trigger download
      cy.readFile('cypress/downloads/test-financial-data.xlsx')
        .should('exist');
    });

    it('should allow file deletion', () => {
      cy.get('[data-testid="delete-file"]').first().click();
      
      // Should show confirmation dialog
      cy.get('[data-testid="delete-confirmation"]')
        .should('be.visible')
        .and('contain', 'Are you sure you want to delete this file?');
      
      cy.get('[data-testid="confirm-delete"]').click();
      
      // Should show success message
      cy.get('[data-testid="delete-success"]')
        .should('contain', 'File deleted successfully');
      
      // File should be removed from list
      cy.get('[data-testid="file-row"]')
        .should('not.contain', 'test-financial-data.xlsx');
    });

    it('should support file search and filtering', () => {
      // Upload multiple files with different names
      cy.uploadFile('[data-testid="file-input"]', 'budget-2023.xlsx');
      cy.uploadFile('[data-testid="file-input"]', 'revenue-forecast.xlsx');
      
      // Search for specific file
      cy.get('[data-testid="file-search"]')
        .type('budget');
      
      // Should filter results
      cy.get('[data-testid="file-row"]')
        .should('have.length', 1)
        .and('contain', 'budget-2023.xlsx');
      
      // Clear search
      cy.get('[data-testid="file-search"]').clear();
      
      // Filter by status
      cy.get('[data-testid="status-filter"]')
        .select('Completed');
      
      cy.get('[data-testid="file-row"]')
        .each($row => {
          cy.wrap($row).should('contain', 'Completed');
        });
    });

    it('should support sorting files', () => {
      // Upload multiple files
      const files = ['file-a.xlsx', 'file-b.xlsx', 'file-c.xlsx'];
      files.forEach(file => {
        cy.uploadFile('[data-testid="file-input"]', file);
        cy.wait(1000); // Ensure different timestamps
      });
      
      // Sort by name
      cy.get('[data-testid="sort-by-name"]').click();
      
      cy.get('[data-testid="file-name"]').then($names => {
        const names = Array.from($names).map(el => el.textContent);
        expect(names).to.deep.equal(names.sort());
      });
      
      // Sort by date (descending)
      cy.get('[data-testid="sort-by-date"]').click();
      
      // Should show newest files first
      cy.get('[data-testid="file-row"]').first()
        .should('contain', 'file-c.xlsx');
    });
  });

  describe('Data Extraction and Analysis', () => {
    beforeEach(() => {
      cy.visit('/files');
      cy.uploadFile('[data-testid="file-input"]', 'complex-financial-data.xlsx');
      cy.get('[data-testid="processing-complete"]', { timeout: 60000 })
        .should('be.visible');
    });

    it('should extract and display financial data', () => {
      cy.get('[data-testid="view-data"]').first().click();
      
      // Should navigate to data view
      cy.url().should('include', '/files/data');
      
      // Should show extracted financial statements
      cy.get('[data-testid="income-statement"]')
        .should('be.visible')
        .within(() => {
          cy.get('[data-testid="revenue-line"]').should('be.visible');
          cy.get('[data-testid="expenses-line"]').should('be.visible');
          cy.get('[data-testid="profit-line"]').should('be.visible');
        });
      
      // Should show balance sheet if available
      cy.get('[data-testid="balance-sheet"]')
        .should('be.visible');
      
      // Should show cash flow if available
      cy.get('[data-testid="cash-flow"]')
        .should('be.visible');
    });

    it('should detect and display key parameters', () => {
      cy.get('[data-testid="view-parameters"]').first().click();
      
      // Should show detected parameters
      cy.get('[data-testid="detected-parameters"]')
        .should('be.visible')
        .within(() => {
          cy.get('[data-testid="growth-rate"]').should('be.visible');
          cy.get('[data-testid="discount-rate"]').should('be.visible');
          cy.get('[data-testid="tax-rate"]').should('be.visible');
        });
      
      // Should allow parameter editing
      cy.get('[data-testid="edit-parameter"]').first().click();
      
      cy.get('[data-testid="parameter-value"]')
        .clear()
        .type('0.15');
      
      cy.get('[data-testid="save-parameter"]').click();
      
      // Should show updated value
      cy.get('[data-testid="parameter-value-display"]')
        .should('contain', '15.0%');
    });

    it('should generate data visualizations', () => {
      cy.get('[data-testid="view-charts"]').first().click();
      
      // Should show various chart types
      cy.get('[data-testid="revenue-trend-chart"]')
        .should('be.visible');
      
      cy.get('[data-testid="expense-breakdown-chart"]')
        .should('be.visible');
      
      cy.get('[data-testid="profitability-chart"]')
        .should('be.visible');
      
      // Should allow chart interaction
      cy.get('[data-testid="chart-legend"]')
        .should('be.visible');
      
      // Test chart export
      cy.get('[data-testid="export-chart"]').first().click();
      cy.get('[data-testid="export-png"]').click();
      
      // Should download chart image
      cy.readFile('cypress/downloads/revenue-trend-chart.png')
        .should('exist');
    });

    it('should validate data integrity', () => {
      cy.get('[data-testid="validate-data"]').first().click();
      
      // Should show validation results
      cy.get('[data-testid="validation-results"]')
        .should('be.visible')
        .within(() => {
          cy.get('[data-testid="data-completeness"]').should('be.visible');
          cy.get('[data-testid="calculation-accuracy"]').should('be.visible');
          cy.get('[data-testid="consistency-check"]').should('be.visible');
        });
      
      // Should highlight any issues
      cy.get('[data-testid="validation-warnings"]')
        .should('be.visible');
      
      // Should provide recommendations
      cy.get('[data-testid="data-recommendations"]')
        .should('be.visible');
    });
  });

  describe('Error Handling and Recovery', () => {
    it('should handle network errors during upload', () => {
      // Mock network failure
      cy.intercept('POST', '/api/v1/files/upload', {
        forceNetworkError: true
      });
      
      cy.visit('/files');
      cy.uploadFile('[data-testid="file-input"]', 'test-file.xlsx');
      
      // Should show network error
      cy.get('[data-testid="network-error"]')
        .should('be.visible')
        .and('contain', 'Network error');
      
      // Should provide retry option
      cy.get('[data-testid="retry-upload"]')
        .should('be.visible');
    });

    it('should handle server errors gracefully', () => {
      // Mock server error
      cy.intercept('POST', '/api/v1/files/upload', {
        statusCode: 500,
        body: { detail: 'Internal server error' }
      });
      
      cy.visit('/files');
      cy.uploadFile('[data-testid="file-input"]', 'test-file.xlsx');
      
      // Should show server error message
      cy.get('[data-testid="server-error"]')
        .should('be.visible')
        .and('contain', 'Server error');
    });

    it('should recover from processing failures', () => {
      cy.visit('/files');
      cy.uploadFile('[data-testid="file-input"]', 'problematic-file.xlsx');
      
      // Mock processing failure
      cy.intercept('GET', '/api/v1/files/*/status', {
        statusCode: 200,
        body: { status: 'failed', error_message: 'Processing failed' }
      });
      
      cy.get('[data-testid="processing-failed"]', { timeout: 30000 })
        .should('be.visible');
      
      // Should allow retry
      cy.get('[data-testid="retry-processing"]').click();
      
      // Mock successful retry
      cy.intercept('POST', '/api/v1/files/*/retry', {
        statusCode: 200,
        body: { status: 'processing' }
      });
      
      cy.get('[data-testid="retry-started"]')
        .should('be.visible');
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle large file uploads efficiently', () => {
      cy.visit('/files');
      
      // Upload large file (mocked)
      cy.uploadFile('[data-testid="file-input"]', 'large-dataset-50mb.xlsx');
      
      // Should show progress indicators
      cy.get('[data-testid="upload-progress"]')
        .should('be.visible');
      
      // Should handle upload in chunks if implemented
      cy.get('[data-testid="chunk-upload-indicator"]')
        .should('be.visible');
      
      // Should not freeze the UI
      cy.get('[data-testid="navigation-menu"]')
        .should('be.functional');
    });

    it('should handle multiple concurrent uploads', () => {
      cy.visit('/files');
      
      // Enable multiple file upload
      cy.get('[data-testid="multiple-files-checkbox"]').check();
      
      // Upload multiple files simultaneously
      const files = [
        'dataset-1.xlsx',
        'dataset-2.xlsx', 
        'dataset-3.xlsx',
        'dataset-4.xlsx'
      ];
      
      files.forEach(file => {
        cy.uploadFile('[data-testid="file-input"]', file);
      });
      
      // Should show all uploads in progress
      cy.get('[data-testid="upload-queue-item"]')
        .should('have.length', 4);
      
      // Should manage upload queue efficiently
      cy.get('[data-testid="queue-management"]')
        .should('be.visible');
    });
  });
}); 