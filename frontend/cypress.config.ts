import { defineConfig } from 'cypress';

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
      on('task', {

        // WAVE accessibility testing
        waveCheck: async ({ url, options }) => {
          const { default: axios } = await import('axios');
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
        generatePerformanceReport: async (data) => {
          const { promises: fs } = await import('fs');
          const { default: path } = await import('path');
          
          const reportPath = path.join('cypress', 'reports', 'performance-report.json');
          await fs.writeFile(reportPath, JSON.stringify(data, null, 2));
          
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
    supportFile: 'cypress/support/component.tsx',
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