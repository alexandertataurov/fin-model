import { defineConfig } from 'cypress';
import { lighthouse, prepareAudit } from '@cypress/lighthouse';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    retries: {
      runMode: 2,
      openMode: 0
    },
    env: {
      testUser: {
        username: 'cypress_test_user',
        email: 'cypress@test.com',
        password: 'CypressTest123!'
      },
      adminUser: {
        username: 'cypress_admin',
        email: 'cypress.admin@test.com', 
        password: 'CypressAdmin123!'
      },
      apiUrl: 'http://localhost:8000/api/v1'
    },
    setupNodeEvents(on, config) {
      // Lighthouse setup
      on('before:browser:launch', (browser = {}, launchOptions) => {
        prepareAudit(launchOptions);
      });

      on('task', {
        lighthouse: lighthouse((lighthouseOptions) => {
          lighthouseOptions.settings = {
            ...lighthouseOptions.settings,
            formFactor: 'desktop',
            throttling: {
              rttMs: 40,
              throughputKbps: 10240,
              cpuSlowdownMultiplier: 1,
              requestLatencyMs: 0,
              downloadThroughputKbps: 0,
              uploadThroughputKbps: 0
            },
            screenEmulation: {
              mobile: false,
              width: 1280,
              height: 720,
              deviceScaleFactor: 1,
              disabled: false
            }
          };
        }),

        // WAVE accessibility testing
        waveCheck: async ({ url, options }) => {
          const axios = require('axios');
          try {
            const response = await axios.get(`https://wave.webaim.org/api/request`, {
              params: {
                key: process.env.WAVE_API_KEY,
                url: url,
                reporttype: options.reportType || 1
              }
            });
            return response.data;
          } catch (error) {
            console.log('WAVE API not available, skipping accessibility check');
            return { status: 'skipped' };
          }
        },

        // Database reset
        resetDb: () => {
          // Implementation would reset test database
          return null;
        },

        // Seed test data
        seedTestData: () => {
          // Implementation would seed test database
          return null;
        },

        // Logging task
        log: (message) => {
          console.log(message);
          return null;
        },

        // Performance report generation
        generatePerformanceReport: (data) => {
          const fs = require('fs');
          const path = require('path');
          
          const reportPath = path.join('cypress', 'reports', 'performance-report.json');
          fs.writeFileSync(reportPath, JSON.stringify(data, null, 2));
          
          console.log(`Performance report generated: ${reportPath}`);
          return null;
        }
      });

      // Return the updated config object
      return config;
    }
  },
  
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.ts',
  },
  
  env: {
    // API URL for backend
    apiUrl: 'http://localhost:8000',
    
    // Test user credentials
    testUser: {
      username: 'cypress_test_user',
      email: 'cypress@test.com',
      password: 'CypressTest123!',
    },
    
    // Admin user credentials
    adminUser: {
      username: 'cypress_admin',
      email: 'admin@test.com',
      password: 'AdminTest123!',
    },
    
    // File upload settings
    fileUpload: {
      timeout: 30000,
      maxFileSize: 10485760, // 10MB
    }
  },
  
  // Retry settings
  retries: {
    runMode: 2,
    openMode: 0,
  },
  
  // Browser settings
  chromeWebSecurity: false,
  
  // Network settings
  modifyObstructiveCode: false,
  
  // Test isolation
  testIsolation: true,
  
  // Experimental features
  experimentalStudio: true,
  experimentalOriginDependencies: true,
}); 