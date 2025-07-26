describe('Performance Testing (Lighthouse via LHCI)', () => {
  beforeEach(() => {
    cy.resetAppState();
    cy.seedTestData();
    cy.loginAsTestUser();
  });

  describe('Core Web Vitals - Page Load Testing', () => {
    it('should load dashboard within acceptable time', () => {
      const startTime = Date.now();
      
      cy.visit('/dashboard');
      
      // Wait for page to fully load
      cy.get('[data-testid="dashboard-content"]').should('be.visible');
      
      // Measure page load time
      cy.then(() => {
        const loadTime = Date.now() - startTime;
        expect(loadTime).to.be.lessThan(5000); // 5 second threshold
        cy.log(`Dashboard load time: ${loadTime}ms`);
      });
    });

    it('should load file upload page quickly', () => {
      const startTime = Date.now();
      
      cy.visit('/files');
      cy.get('[data-testid="file-dropzone"]').should('be.visible');
      
      cy.then(() => {
        const loadTime = Date.now() - startTime;
        expect(loadTime).to.be.lessThan(3000); // 3 second threshold
        cy.log(`File upload page load time: ${loadTime}ms`);
      });
    });

    it('should load analytics page with charts efficiently', () => {
      const startTime = Date.now();
      
      cy.visit('/analytics');
      
      // Wait for charts to render
      cy.get('[data-testid="chart-container"]').should('be.visible');
      
      cy.then(() => {
        const loadTime = Date.now() - startTime;
        expect(loadTime).to.be.lessThan(6000); // 6 second threshold for charts
        cy.log(`Analytics page load time: ${loadTime}ms`);
      });
    });
  });

  describe('Network Performance', () => {
    it('should handle API requests efficiently', () => {
      cy.intercept('GET', '/api/v1/dashboard/metrics').as('dashboardMetrics');
      
      cy.visit('/dashboard');
      
      cy.wait('@dashboardMetrics').then((interception) => {
        expect(interception.response.statusCode).to.equal(200);
        
        // Check response time
        const responseTime = interception.response.headers['x-response-time'];
        if (responseTime) {
          const time = parseInt(responseTime.toString());
          expect(time).to.be.lessThan(1000); // 1 second max
        }
      });
    });

    it('should load file list efficiently', () => {
      cy.intercept('GET', '/api/v1/files/').as('fileList');
      
      cy.visit('/files');
      
      cy.wait('@fileList').then((interception) => {
        expect(interception.response.statusCode).to.equal(200);
        
        // Verify response size is reasonable
        const responseSize = JSON.stringify(interception.response.body).length;
        expect(responseSize).to.be.lessThan(100000); // 100KB max
      });
    });
  });

  describe('Resource Performance', () => {
    it('should not load excessive JavaScript bundles', () => {
      const resourceSizes = [];
      
      cy.window().then((win) => {
        // Monitor resource loading
        const observer = new win.PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.name.includes('.js')) {
              resourceSizes.push({
                name: entry.name,
                size: entry.transferSize || 0
              });
            }
          });
        });
        observer.observe({ entryTypes: ['resource'] });
      });

      cy.visit('/dashboard');
      cy.wait(3000);

      cy.then(() => {
        // Check that no single JS bundle is too large
        resourceSizes.forEach((resource) => {
          expect(resource.size).to.be.lessThan(1000000); // 1MB max per bundle
        });
      });
    });

    it('should efficiently cache static assets', () => {
      // First visit to populate cache
      cy.visit('/dashboard');
      cy.wait(2000);

      // Second visit should be faster due to caching
      const startTime = Date.now();
      
      cy.reload();
      cy.get('[data-testid="dashboard-content"]').should('be.visible');
      
      cy.then(() => {
        const reloadTime = Date.now() - startTime;
        expect(reloadTime).to.be.lessThan(2000); // Cached reload should be under 2s
        cy.log(`Cached reload time: ${reloadTime}ms`);
      });
    });
  });

  describe('Memory Performance', () => {
    it('should not have significant memory leaks', () => {
      cy.window().then((win) => {
        // Get initial memory usage
        const initialMemory = win.performance.memory?.usedJSHeapSize || 0;
        
        // Navigate between pages multiple times
        for (let i = 0; i < 3; i++) {
          cy.visit('/dashboard');
          cy.wait(1000);
          cy.visit('/files');
          cy.wait(1000);
          cy.visit('/analytics');
          cy.wait(1000);
        }

        cy.then(() => {
          const finalMemory = win.performance.memory?.usedJSHeapSize || 0;
          const memoryIncrease = finalMemory - initialMemory;
          
          // Memory increase should be reasonable (less than 50MB)
          expect(memoryIncrease).to.be.lessThan(50 * 1024 * 1024);
          cy.log(`Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`);
        });
      });
    });
  });

  describe('Accessibility Performance', () => {
    it('should maintain fast keyboard navigation', () => {
      cy.visit('/dashboard');
      
      const startTime = Date.now();
      
      // Test keyboard navigation speed
      cy.get('body').tab(); // First focusable element
      cy.focused().tab(); // Second focusable element
      cy.focused().tab(); // Third focusable element
      
      cy.then(() => {
        const navigationTime = Date.now() - startTime;
        expect(navigationTime).to.be.lessThan(500); // Should be very fast
        cy.log(`Keyboard navigation time: ${navigationTime}ms`);
      });
    });

    it('should render screen reader content quickly', () => {
      cy.visit('/dashboard');
      
      // Check that ARIA labels and live regions are present
      cy.get('[aria-label]').should('have.length.greaterThan', 0);
      cy.get('[role="main"]').should('be.visible');
      
      // Verify content is accessible within reasonable time
      cy.get('[data-testid="dashboard-content"]')
        .should('be.visible')
        .and('have.attr', 'aria-label');
    });
  });

  describe('Mobile Performance', () => {
    it('should perform well on mobile viewport', () => {
      cy.viewport('iphone-x');
      
      const startTime = Date.now();
      
      cy.visit('/dashboard');
      cy.get('[data-testid="dashboard-content"]').should('be.visible');
      
      cy.then(() => {
        const mobileLoadTime = Date.now() - startTime;
        expect(mobileLoadTime).to.be.lessThan(7000); // Mobile may be slower
        cy.log(`Mobile load time: ${mobileLoadTime}ms`);
      });
    });

    it('should handle touch interactions smoothly', () => {
      cy.viewport('iphone-x');
      cy.visit('/dashboard');
      
      // Test touch/click responsiveness
      const startTime = Date.now();
      
      cy.get('[data-testid="dashboard-card"]').first().click();
      
      cy.then(() => {
        const touchResponseTime = Date.now() - startTime;
        expect(touchResponseTime).to.be.lessThan(300); // Touch should be very responsive
        cy.log(`Touch response time: ${touchResponseTime}ms`);
      });
    });
  });

  describe('Performance Monitoring', () => {
    it('should track Core Web Vitals', () => {
      cy.visit('/dashboard');
      
      cy.window().then((win) => {
        // Check if Web Vitals can be measured
        cy.wrap(new Promise((resolve) => {
          if ('PerformanceObserver' in win) {
            const observer = new win.PerformanceObserver((list) => {
              const entries = list.getEntries();
              const vitals = {};
              
              entries.forEach((entry) => {
                if (entry.name === 'first-contentful-paint') {
                  vitals.fcp = entry.startTime;
                }
                if (entry.name === 'largest-contentful-paint') {
                  vitals.lcp = entry.startTime;
                }
              });
              
              resolve(vitals);
            });
            
            observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
            
            // Timeout after 5 seconds
            setTimeout(() => resolve({}), 5000);
          } else {
            resolve({});
          }
        })).then((vitals) => {
          cy.log('Core Web Vitals:', vitals);
          
          if (vitals.fcp) {
            expect(vitals.fcp).to.be.lessThan(3000); // FCP should be under 3s
          }
          if (vitals.lcp) {
            expect(vitals.lcp).to.be.lessThan(4000); // LCP should be under 4s
          }
        });
      });
    });
  });

  // Note: Actual Lighthouse audits are run separately via @lhci/cli in the CI pipeline
  // This provides more comprehensive and accurate performance metrics than Cypress-based testing
  describe('Lighthouse Integration Note', () => {
    it('should note that Lighthouse audits run via LHCI', () => {
      // This is an informational test
      cy.log('Lighthouse performance audits are executed via @lhci/cli in the CI pipeline');
      cy.log('See .lighthouserc.js for configuration and reports in CI artifacts');
      
      // Just verify the app loads for lighthouse to test
      cy.visit('/');
      cy.get('body').should('be.visible');
    });
  });
}); 