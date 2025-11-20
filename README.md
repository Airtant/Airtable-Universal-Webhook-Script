# 🚀 Airtable Universal Webhook Script
![Airtable](https://img.shields.io/badge/Airtable-18BFFF?style=for-the-badge&logo=airtable&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![JSON](https://img.shields.io/badge/JSON-000000?style=for-the-badge&logo=json&logoColor=white)
![Webhooks](https://img.shields.io/badge/Webhooks-FCC624?style=for-the-badge&logo=webhooks&logoColor=black)
[![Maintained by Khan](https://img.shields.io/badge/Maintained%20by-Khan-blueviolet?style=for-the-badge)](https://github.com/Airtant/Airtable-Universal-Webhook-Script#author)

A robust, "copy-paste" JavaScript solution for **Airtable Automations**. This script acts as a universal HTTP client, allowing you to send **GET** or **POST** requests to any external API or Webhook (Zapier, Make, Stripe, OpenAI, etc.) directly from Airtable.

It handles URL parameter encoding, JSON body formatting, and Authentication headers automatically.

## ✨ Features

- **Method Agnostic:** Automatically handles `POST` (JSON Body) and `GET` (URL Query Parameters).
- **Secure Auth:** Built-in support for `Authorization` headers (Bearer Token, Basic Auth).
- **Dynamic Payload:** Any input variable you add to the automation is automatically sent as data.
- **Response Handling:** Returns the API status code and raw response body for use in subsequent automation steps.
- **Error Safety:** Intentionally fails the automation run if the API returns a 4xx or 5xx error, ensuring you don't miss failed syncs.

## 📦 Installation

1. Open your Airtable Base and click **Automations**.
2. Create a new automation or select an existing one.
3. Add a **"Run a script"** action.
4. Copy the code from `script.js` in this repository and paste it into the editor.
5. Configure your **Input Variables** on the left sidebar (see configuration below).

## ⚙️ Configuration

In the **Input Variables** section of the Airtable Script Editor, define the following:

### System Inputs

| **Input Name** | **Value Example** | **Required?** | **Description** |
| --- | --- | --- | --- |
| `webhookUrl` | `https://hooks.zapier.com/...` | **Yes** | The destination URL or API Endpoint. |
| `method` | `GET` or `POST` | No | Defaults to `POST` if left blank. |
| `authHeader` | `Bearer sk_test_123...` | No | Add this only if the API requires authentication. |

### Data Inputs (Payload)

Any *other* variable you add will be treated as data.

- **If Method is POST:** Inputs are sent as the **JSON Body**.
- **If Method is GET:** Inputs are converted to **URL Query Parameters** (e.g., `?email=test@test.com&id=123`).

**Example Setup:**

- `email`: `[Record Email]`
- `orderId`: `[Record ID]`
- `status`: `Active`

## 📤 Outputs

The script sets the following outputs for use in the next steps of your automation (e.g., "Update Record"):

| **Output Variable** | **Type** | **Description** |
| --- | --- | --- |
| `status` | Number | The HTTP status code (e.g., `200`, `201`, `404`). |
| `responseBody` | String | The raw JSON response from the API (Stringified). |

## 📝 Usage Examples

### Scenario 1: Sending data to a Webhook (Zapier/Make)

- **webhookUrl:** `https://hooks.zapier.com/hooks/catch/12345/abcde`
- **method:** (Leave blank, defaults to POST)
- **email:** `john@example.com`
- **name:** `John Doe`

### Scenario 2: Fetching data from an API (GET)

- **webhookUrl:** `https://api.example.com/v1/customers`
- **method:** `GET`
- **authHeader:** `Bearer my-secret-token`
- **email:** `john@example.com`
- *Result:* Script sends request to `https://api.example.com/v1/customers?email=john@example.com`

## 📄 The Script

```JavaScript

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
```
## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ✍️ Author

### Hi there, I'm Khan 👋
I’m the Lead Developer at **Airtant**, where we build specialized solutions for the Airtable ecosystem. I bridge the gap between standard Airtable features and complex backend requirements using JavaScript, Webhooks, and Data Scraping.

- 🔬 I’m currently building robust scripts and extensions to power **Airtant's** automation suite.
- ⚡️ I specialize in handling large datasets, API integrations, and "impossible" Airtable workflows.
- 🌱 I’m constantly exploring advanced Node.js patterns to optimize Airtable scripting performance.
- 👯‍♂️ I’m open to collaboration on open-source Airtable tools and data extraction pipelines.
- 🗯 Ask me about Scripting Block, Regex, API Connectivity, and Database Architecture.

### 🎓 Certifications
![Airtable Certified](https://img.shields.io/badge/Airtable-Certified-blue?style=for-the-badge&logo=airtable&logoColor=white) ![Make.com Certified](https://img.shields.io/badge/Make.com-Certified-purple?style=for-the-badge&logo=make&logoColor=white) ![Scrum Certified Product Owner](https://img.shields.io/badge/Scrum-Product%20Owner-red?style=for-the-badge&logo=scrumalliance&logoColor=white)
