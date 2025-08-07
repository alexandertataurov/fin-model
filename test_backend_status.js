// Simple test to check backend status
const API_BASE = "https://fin-model-production.up.railway.app";

async function testBackend() {
  console.log("🔍 Testing backend status...");

  try {
    // Test 1: Health endpoint
    console.log("\n📡 Testing health endpoint...");
    const healthResponse = await fetch(`${API_BASE}/health`);
    console.log(`Health Status: ${healthResponse.status}`);
    console.log(`CORS Headers:`, {
      "Access-Control-Allow-Origin": healthResponse.headers.get(
        "Access-Control-Allow-Origin"
      ),
      "Access-Control-Allow-Methods": healthResponse.headers.get(
        "Access-Control-Allow-Methods"
      ),
      "Access-Control-Allow-Headers": healthResponse.headers.get(
        "Access-Control-Allow-Headers"
      ),
    });

    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log("Health Data:", healthData);
    }

    // Test 2: CORS debug endpoint
    console.log("\n📡 Testing CORS debug endpoint...");
    const corsResponse = await fetch(`${API_BASE}/cors-debug`);
    console.log(`CORS Debug Status: ${corsResponse.status}`);

    if (corsResponse.ok) {
      const corsData = await corsResponse.json();
      console.log("CORS Debug Data:", corsData);
    }

    // Test 3: API root
    console.log("\n📡 Testing API root...");
    const apiResponse = await fetch(`${API_BASE}/api/v1/`);
    console.log(`API Root Status: ${apiResponse.status}`);

    if (apiResponse.ok) {
      const apiData = await apiResponse.json();
      console.log("API Root Data:", apiData);
    }

    // Test 4: OPTIONS preflight
    console.log("\n📡 Testing OPTIONS preflight...");
    const optionsResponse = await fetch(`${API_BASE}/health`, {
      method: "OPTIONS",
      headers: {
        Origin:
          "https://pre-production--advanced-financial-modeling.netlify.app",
        "Access-Control-Request-Method": "GET",
        "Access-Control-Request-Headers": "Content-Type",
      },
    });
    console.log(`OPTIONS Status: ${optionsResponse.status}`);
    console.log(`OPTIONS CORS Headers:`, {
      "Access-Control-Allow-Origin": optionsResponse.headers.get(
        "Access-Control-Allow-Origin"
      ),
      "Access-Control-Allow-Methods": optionsResponse.headers.get(
        "Access-Control-Allow-Methods"
      ),
      "Access-Control-Allow-Headers": optionsResponse.headers.get(
        "Access-Control-Allow-Headers"
      ),
    });
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run the test
testBackend();
