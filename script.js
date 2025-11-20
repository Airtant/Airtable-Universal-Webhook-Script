
const config = input.config();

// 1. CONFIGURATION
const { webhookUrl, method, authHeader, ...payload } = config;

if (!webhookUrl) throw new Error("❌ Error: 'webhookUrl' input is required.");

const httpMethod = (method || "POST").toUpperCase();

// 2. PREPARE REQUEST
let fetchOptions = {
    method: httpMethod,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
};

if (authHeader) fetchOptions.headers["Authorization"] = authHeader;

let finalUrl = webhookUrl;

if (httpMethod === "GET") {
    const queryString = new URLSearchParams(payload).toString();
    if (queryString) {
        const separator = finalUrl.includes("?") ? "&" : "?";
        finalUrl = `${finalUrl}${separator}${queryString}`;
    }
    delete fetchOptions.body; 
} else {
    fetchOptions.body = JSON.stringify(payload);
}

console.log(`🚀 Sending ${httpMethod} to: ${finalUrl}`);

// 3. EXECUTE
try {
    const response = await fetch(finalUrl, fetchOptions);
    console.log(`✅ Status: ${response.status} ${response.statusText}`);

    const contentType = response.headers.get("content-type");
    let responseData;

    if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
    } else {
        responseData = await response.text();
    }

    console.log(`🔁 Response:`, responseData);

    if (!response.ok) {
        throw new Error(`Request failed [${response.status}]: ${JSON.stringify(responseData)}`);
    }

    output.set("status", response.status);
    output.set("responseBody", typeof responseData === 'object' ? JSON.stringify(responseData) : responseData);

} catch (error) {
    console.error(`❌ Webhook Error: ${error.message}`);
    throw error;
}
