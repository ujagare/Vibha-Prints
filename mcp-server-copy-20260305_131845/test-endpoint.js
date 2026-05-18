// Test MCP endpoint directly
const axios = require("axios");
const MCP_URL = "http://localhost:8001";

async function testMCP() {
  console.log("Testing MCP endpoint:", MCP_URL);

  // Test 1: Initialize
  const initPayload = {
    jsonrpc: "2.0",
    id: "test-init-1",
    method: "initialize",
    params: {
      protocolVersion: "2025-03-26",
      capabilities: { tools: { listChanged: false } },
      clientInfo: { name: "test-client", version: "1.0.0" },
    },
  };

  try {
    const initRes = await axios.post(MCP_URL, initPayload, {
      headers: {
        "Content-Type": "application/json",
        "MCP-Protocol-Version": "2025-03-26",
      },
      responseType: "text",
      transformResponse: [(v) => v],
      validateStatus: () => true,
    });

    console.log("\n1. Initialize Response:");
    console.log("Status:", initRes.status);
    console.log("Headers:", initRes.headers);
    const initText = initRes.data;
    console.log("Body:", initText);

    const sessionId = initRes.headers["mcp-session-id"];

    // Test 2: Call chat tool
    const chatPayload = {
      jsonrpc: "2.0",
      id: "test-chat-1",
      method: "tools/call",
      params: {
        name: "chat",
        arguments: { message: "Hello" },
      },
    };

    const headers = {
      "Content-Type": "application/json",
      "MCP-Protocol-Version": "2025-03-26",
    };
    if (sessionId) headers["MCP-Session-Id"] = sessionId;

    const chatRes = await axios.post(MCP_URL, chatPayload, {
      headers,
      responseType: "text",
      transformResponse: [(v) => v],
      validateStatus: () => true,
    });

    console.log("\n2. Chat Tool Response:");
    console.log("Status:", chatRes.status);
    const chatText = chatRes.data;
    console.log("Body:", chatText);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testMCP();
