import http from "k6/http";
import { check, sleep } from "k6";
import { Rate, Trend } from "k6/metrics";

// Custom metrics
export const loginDuration = new Trend("login_duration");
export const fileUploadDuration = new Trend("file_upload_duration");
export const fileProcessingDuration = new Trend("file_processing_duration");
export const errorRate = new Rate("error_rate");

// Test configuration
export const options = {
  scenarios: {
    // Smoke test - verify basic functionality
    smoke_test: {
      executor: "constant-vus",
      vus: 1,
      duration: "1m",
      tags: { test_type: "smoke" },
    },

    // Load test - normal expected load
    load_test: {
      executor: "constant-vus",
      vus: 10,
      duration: "5m",
      tags: { test_type: "load" },
    },

    // Stress test - find breaking point
    stress_test: {
      executor: "ramping-vus",
      stages: [
        { duration: "2m", target: 20 },
        { duration: "5m", target: 20 },
        { duration: "2m", target: 40 },
        { duration: "5m", target: 40 },
        { duration: "2m", target: 0 },
      ],
      tags: { test_type: "stress" },
    },

    // Spike test - sudden traffic spikes
    spike_test: {
      executor: "ramping-vus",
      stages: [
        { duration: "10s", target: 100 },
        { duration: "1m", target: 100 },
        { duration: "10s", target: 1400 },
        { duration: "3m", target: 1400 },
        { duration: "10s", target: 100 },
        { duration: "3m", target: 100 },
        { duration: "10s", target: 0 },
      ],
      tags: { test_type: "spike" },
    },

    // Volume test - large amounts of data
    volume_test: {
      executor: "constant-vus",
      vus: 5,
      duration: "10m",
      tags: { test_type: "volume" },
    },
  },

  // Performance thresholds
  thresholds: {
    http_req_duration: ["p(95)<2000"], // 95% of requests must complete below 2s
    http_req_failed: ["rate<0.1"], // Error rate must be below 10%
    login_duration: ["p(95)<1000"], // Login must complete below 1s
    file_upload_duration: ["p(95)<5000"], // File upload below 5s
    error_rate: ["rate<0.05"], // Custom error rate below 5%
  },
};

// Test data
const BASE_URL = __ENV.BASE_URL || "http://localhost:8000";
const TEST_USERS = [
  { username: "load_user_1", password: "LoadTest123!" },
  { username: "load_user_2", password: "LoadTest123!" },
  { username: "load_user_3", password: "LoadTest123!" },
  { username: "load_user_4", password: "LoadTest123!" },
  { username: "load_user_5", password: "LoadTest123!" },
];

// Utility functions
function getRandomUser() {
  return TEST_USERS[Math.floor(Math.random() * TEST_USERS.length)];
}

function login(user) {
  const loginStart = Date.now();

  const loginPayload = {
    username: user.username,
    password: user.password,
  };

  const loginResponse = http.post(
    `${BASE_URL}/api/v1/auth/login`,
    loginPayload,
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      tags: { endpoint: "login" },
    }
  );

  const loginEnd = Date.now();
  loginDuration.add(loginEnd - loginStart);

  const loginSuccess = check(loginResponse, {
    "login status is 200": (r) => r.status === 200,
    "login returns token": (r) => r.json("access_token") !== undefined,
  });

  if (!loginSuccess) {
    errorRate.add(1);
    return null;
  }

  errorRate.add(0);
  return loginResponse.json("access_token");
}

function createAuthHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

// Test scenarios
export default function () {
  const user = getRandomUser();
  const token = login(user);

  if (!token) {
    console.log("Login failed, skipping user session");
    return;
  }

  const headers = createAuthHeaders(token);

  // Test dashboard metrics endpoint
  testDashboardMetrics(headers);

  // Test file operations
  testFileOperations(headers);

  // Test parameter operations
  testParameterOperations(headers);

  // Test report operations
  testReportOperations(headers);

  sleep(1);
}

function testDashboardMetrics(headers) {
  const response = http.get(`${BASE_URL}/api/v1/dashboard/metrics`, {
    headers,
    tags: { endpoint: "dashboard_metrics" },
  });

  check(response, {
    "dashboard metrics status is 200": (r) => r.status === 200,
    "dashboard metrics response time < 500ms": (r) => r.timings.duration < 500,
    "dashboard metrics returns data": (r) => {
      const data = r.json();
      return (
        data.total_files !== undefined && data.total_parameters !== undefined
      );
    },
  });
}

function testFileOperations(headers) {
  // List files
  const listResponse = http.get(`${BASE_URL}/api/v1/files/`, {
    headers,
    tags: { endpoint: "list_files" },
  });

  check(listResponse, {
    "list files status is 200": (r) => r.status === 200,
    "list files response time < 1000ms": (r) => r.timings.duration < 1000,
    "list files returns array": (r) => Array.isArray(r.json()),
  });

  // Simulate file upload (using mock file data)
  testFileUpload(headers);
}

function testFileUpload(headers) {
  const uploadStart = Date.now();

  // Create mock Excel file data
  const mockExcelData = new Uint8Array(1024 * 10); // 10KB mock file
  mockExcelData.fill(65); // Fill with 'A' characters

  const uploadPayload = {
    file: http.file(
      mockExcelData,
      "test-file.xlsx",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ),
  };

  const uploadResponse = http.post(
    `${BASE_URL}/api/v1/files/upload`,
    uploadPayload,
    {
      headers: { Authorization: headers.Authorization },
      tags: { endpoint: "file_upload" },
    }
  );

  const uploadEnd = Date.now();
  fileUploadDuration.add(uploadEnd - uploadStart);

  const uploadSuccess = check(uploadResponse, {
    "file upload status is 201": (r) => r.status === 201,
    "file upload returns file data": (r) => r.json("id") !== undefined,
    "file upload response time < 10s": (r) => r.timings.duration < 10000,
  });

  if (uploadSuccess) {
    const fileId = uploadResponse.json("id");
    testFileProcessingStatus(headers, fileId);
  }
}

function testFileProcessingStatus(headers, fileId) {
  const processingStart = Date.now();
  let processingComplete = false;
  let attempts = 0;
  const maxAttempts = 30; // 30 seconds timeout

  while (!processingComplete && attempts < maxAttempts) {
    const statusResponse = http.get(
      `${BASE_URL}/api/v1/files/${fileId}/status`,
      { headers, tags: { endpoint: "file_status" } }
    );

    check(statusResponse, {
      "file status check is 200": (r) => r.status === 200,
    });

    if (statusResponse.status === 200) {
      const status = statusResponse.json("processing_status");
      if (status === "completed" || status === "failed") {
        processingComplete = true;
        const processingEnd = Date.now();
        fileProcessingDuration.add(processingEnd - processingStart);
      }
    }

    if (!processingComplete) {
      sleep(1);
      attempts++;
    }
  }

  if (!processingComplete) {
    console.log(`File processing timeout for file ${fileId}`);
  }
}

function testParameterOperations(headers) {
  // List parameters
  const listResponse = http.get(`${BASE_URL}/api/v1/parameters/`, {
    headers,
    tags: { endpoint: "list_parameters" },
  });

  check(listResponse, {
    "list parameters status is 200": (r) => r.status === 200,
    "list parameters response time < 500ms": (r) => r.timings.duration < 500,
  });

  // Create parameter
  const createPayload = {
    name: `Load Test Parameter ${Date.now()}`,
    value: Math.random(),
    category: "load_test",
    description: "Parameter created during load testing",
  };

  const createResponse = http.post(
    `${BASE_URL}/api/v1/parameters/`,
    JSON.stringify(createPayload),
    { headers, tags: { endpoint: "create_parameter" } }
  );

  check(createResponse, {
    "create parameter status is 201": (r) => r.status === 201,
    "create parameter returns data": (r) => r.json("id") !== undefined,
  });

  if (createResponse.status === 201) {
    const parameterId = createResponse.json("id");

    // Update parameter
    const updatePayload = {
      value: Math.random(),
      description: "Updated during load testing",
    };

    const updateResponse = http.put(
      `${BASE_URL}/api/v1/parameters/${parameterId}`,
      JSON.stringify(updatePayload),
      { headers, tags: { endpoint: "update_parameter" } }
    );

    check(updateResponse, {
      "update parameter status is 200": (r) => r.status === 200,
    });

    // Delete parameter
    const deleteResponse = http.del(
      `${BASE_URL}/api/v1/parameters/${parameterId}`,
      null,
      { headers, tags: { endpoint: "delete_parameter" } }
    );

    check(deleteResponse, {
      "delete parameter status is 204": (r) => r.status === 204,
    });
  }
}

function testReportOperations(headers) {
  // List reports
  const listResponse = http.get(`${BASE_URL}/api/v1/reports/`, {
    headers,
    tags: { endpoint: "list_reports" },
  });

  check(listResponse, {
    "list reports status is 200": (r) => r.status === 200,
    "list reports response time < 1000ms": (r) => r.timings.duration < 1000,
  });
}

// Setup function - runs once per VU
export function setup() {
  console.log("Setting up load test...");

  // Create test users if they don't exist
  TEST_USERS.forEach((user) => {
    const registerPayload = {
      username: user.username,
      email: `${user.username}@loadtest.com`,
      password: user.password,
      full_name: `Load Test User ${user.username}`,
    };

    http.post(
      `${BASE_URL}/api/v1/auth/register`,
      JSON.stringify(registerPayload),
      { headers: { "Content-Type": "application/json" } }
    );
  });

  console.log("Load test setup completed");
}

// Teardown function - runs once after all VUs finish
export function teardown(data) {
  console.log("Cleaning up load test...");
  // Cleanup could include deleting test users and data
  console.log("Load test cleanup completed");
}

// Handle summary for custom reporting
export function handleSummary(data) {
  return {
    "performance-report.html": htmlReport(data),
    "performance-report.json": JSON.stringify(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}

function htmlReport(data) {
  return `
<!DOCTYPE html>
<html>
<head>
    <title>Performance Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .metric { margin: 10px 0; padding: 10px; border: 1px solid #ddd; }
        .pass { background-color: #d4edda; }
        .fail { background-color: #f8d7da; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h1>Performance Test Report</h1>
    <h2>Test Summary</h2>
    <p>Duration: ${data.state.testRunDurationMs}ms</p>
    <p>Virtual Users: ${data.metrics.vus.values.max}</p>
    <p>Iterations: ${data.metrics.iterations.values.count}</p>
    
    <h2>HTTP Metrics</h2>
    <table>
        <tr><th>Metric</th><th>Average</th><th>P95</th><th>Max</th></tr>
        <tr><td>Request Duration</td><td>${data.metrics.http_req_duration.values.avg.toFixed(
          2
        )}ms</td><td>${data.metrics.http_req_duration.values["p(95)"].toFixed(
    2
  )}ms</td><td>${data.metrics.http_req_duration.values.max.toFixed(
    2
  )}ms</td></tr>
        <tr><td>Request Rate</td><td>${data.metrics.http_reqs.values.rate.toFixed(
          2
        )}/s</td><td>-</td><td>-</td></tr>
        <tr><td>Failed Requests</td><td>${(
          data.metrics.http_req_failed.values.rate * 100
        ).toFixed(2)}%</td><td>-</td><td>-</td></tr>
    </table>
    
    <h2>Custom Metrics</h2>
    <table>
        <tr><th>Metric</th><th>Average</th><th>P95</th><th>Max</th></tr>
        <tr><td>Login Duration</td><td>${
          data.metrics.login_duration?.values.avg?.toFixed(2) || "N/A"
        }ms</td><td>${
    data.metrics.login_duration?.values["p(95)"]?.toFixed(2) || "N/A"
  }ms</td><td>${
    data.metrics.login_duration?.values.max?.toFixed(2) || "N/A"
  }ms</td></tr>
        <tr><td>File Upload Duration</td><td>${
          data.metrics.file_upload_duration?.values.avg?.toFixed(2) || "N/A"
        }ms</td><td>${
    data.metrics.file_upload_duration?.values["p(95)"]?.toFixed(2) || "N/A"
  }ms</td><td>${
    data.metrics.file_upload_duration?.values.max?.toFixed(2) || "N/A"
  }ms</td></tr>
    </table>
    
    <h2>Threshold Results</h2>
    ${Object.entries(data.thresholds || {})
      .map(
        ([name, result]) =>
          `<div class="metric ${result.ok ? "pass" : "fail"}">
        ${name}: ${result.ok ? "PASS" : "FAIL"}
      </div>`
      )
      .join("")}
</body>
</html>`;
}

function textSummary(data, options) {
  return `
Performance Test Summary
========================
Duration: ${data.state.testRunDurationMs}ms
Virtual Users: ${data.metrics.vus.values.max}
Iterations: ${data.metrics.iterations.values.count}

HTTP Request Metrics:
- Average Duration: ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms
- P95 Duration: ${data.metrics.http_req_duration.values["p(95)"].toFixed(2)}ms
- Request Rate: ${data.metrics.http_reqs.values.rate.toFixed(2)}/s
- Failed Requests: ${(data.metrics.http_req_failed.values.rate * 100).toFixed(
    2
  )}%

Custom Metrics:
- Login Duration (avg): ${
    data.metrics.login_duration?.values.avg?.toFixed(2) || "N/A"
  }ms
- File Upload Duration (avg): ${
    data.metrics.file_upload_duration?.values.avg?.toFixed(2) || "N/A"
  }ms

Thresholds: ${Object.keys(data.thresholds || {}).length} total
- Passed: ${Object.values(data.thresholds || {}).filter((t) => t.ok).length}
- Failed: ${Object.values(data.thresholds || {}).filter((t) => !t.ok).length}
`;
}
