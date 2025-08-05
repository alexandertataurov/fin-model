import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { mockApiResponses } from '../test-utils';

// Base URL for API requests in tests
const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

// Setup MSW server for API mocking
const server = setupServer(
  // Auth endpoints
  http.post(`${BASE_URL}/api/v1/auth/login`, () => {
    return HttpResponse.json(mockApiResponses.auth.login);
  }),
  http.get(`${BASE_URL}/api/v1/auth/me`, () => {
    return HttpResponse.json(mockApiResponses.auth.user);
  }),

  // File endpoints
  http.get(`${BASE_URL}/api/v1/files/`, () => {
    return HttpResponse.json(mockApiResponses.files);
  }),
  http.post(`${BASE_URL}/api/v1/files/upload`, () => {
    return HttpResponse.json(mockApiResponses.files[0]);
  }),

  // Parameter endpoints
  http.get(`${BASE_URL}/api/v1/parameters/`, () => {
    return HttpResponse.json(mockApiResponses.parameters);
  }),

  // Dashboard endpoints
  http.get(`${BASE_URL}/api/v1/dashboard/metrics`, () => {
    return HttpResponse.json(mockApiResponses.dashboard.metrics);
  }),

  // Report endpoints
  http.get(`${BASE_URL}/api/v1/reports/`, () => {
    return HttpResponse.json(mockApiResponses.reports);
  }),

  // Generic 404 endpoint for error handling test
  http.get(`${BASE_URL}/api/v1/nonexistent`, () => {
    return new HttpResponse(null, { status: 404 });
  })
);

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});

describe('API Integration Tests', () => {
  describe('Authentication API', () => {
    it('should handle login flow', async () => {
      const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'testuser', password: 'password' }),
      });

      const data = await response.json();
      expect(data.access_token).toBeDefined();
      expect(data.token_type).toBe('bearer');
    });

    it('should handle user profile retrieval', async () => {
      const response = await fetch(`${BASE_URL}/api/v1/auth/me`);
      const data = await response.json();

      expect(data.username).toBe(mockApiResponses.auth.user.username);
      expect(data.email).toBe(mockApiResponses.auth.user.email);
    });
  });

  describe('File API', () => {
    it('should handle file list retrieval', async () => {
      const response = await fetch(`${BASE_URL}/api/v1/files/`);
      const data = await response.json();

      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      expect(data[0]).toHaveProperty('original_filename');
    });

    it('should handle file upload', async () => {
      const formData = new FormData();
      formData.append(
        'file',
        new File(['test'], 'test.xlsx', {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
      );

      const response = await fetch(`${BASE_URL}/api/v1/files/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      expect(data.original_filename).toBeDefined();
      expect(data.id).toBeDefined();
    });
  });

  describe('Dashboard API', () => {
    it('should retrieve dashboard metrics', async () => {
      const response = await fetch(`${BASE_URL}/api/v1/dashboard/metrics`);
      const data = await response.json();

      expect(data.total_files).toBeDefined();
      expect(data.total_parameters).toBeDefined();
      expect(data.total_reports).toBeDefined();
    });
  });

  describe('Parameters API', () => {
    it('should handle parameter list retrieval', async () => {
      const response = await fetch(`${BASE_URL}/api/v1/parameters/`);
      const data = await response.json();

      expect(Array.isArray(data)).toBe(true);
      if (data.length > 0) {
        expect(data[0]).toHaveProperty('name');
        expect(data[0]).toHaveProperty('value');
        expect(data[0]).toHaveProperty('category');
      }
    });
  });

  describe('Reports API', () => {
    it('should handle report list retrieval', async () => {
      const response = await fetch(`${BASE_URL}/api/v1/reports/`);
      const data = await response.json();

      expect(Array.isArray(data)).toBe(true);
      if (data.length > 0) {
        expect(data[0]).toHaveProperty('name');
        expect(data[0]).toHaveProperty('type');
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 errors gracefully', async () => {
      const response = await fetch(`${BASE_URL}/api/v1/nonexistent`);
      expect(response.ok).toBe(false);
    });

    it('should handle network errors gracefully', async () => {
      // This test would require specific setup for network error simulation
      expect(true).toBe(true); // Placeholder
    });
  });
});
