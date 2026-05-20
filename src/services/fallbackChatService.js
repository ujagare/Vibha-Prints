/**
 * Fallback Chat Service
 *
 * This service provides a fallback implementation for the chatbot
 * when Socket.io connection fails.
 */

import { VIBHA_CHATBOT_SYSTEM_PROMPT } from "./chatbotPrompt";

const MCP_TIMEOUT_MS = 12000;

// Optional custom chatbot API (your own provider)
const EXTERNAL_CHAT_API_URL = import.meta.env.VITE_CHATBOT_API_URL || "";
const EXTERNAL_CHAT_API_KEY = import.meta.env.VITE_CHATBOT_API_KEY || "";
const EXTERNAL_CHAT_API_AUTH_HEADER =
  import.meta.env.VITE_CHATBOT_API_AUTH_HEADER || "Authorization";
const EXTERNAL_CHAT_API_KEY_PREFIX =
  import.meta.env.VITE_CHATBOT_API_KEY_PREFIX || "Bearer ";
const EXTERNAL_CHAT_API_MESSAGE_FIELD =
  import.meta.env.VITE_CHATBOT_API_MESSAGE_FIELD || "message";
const EXTERNAL_CHAT_API_RESPONSE_PATH =
  import.meta.env.VITE_CHATBOT_API_RESPONSE_PATH || "";
const EXTERNAL_LEAD_API_URL = import.meta.env.VITE_CHATBOT_LEAD_API_URL || "";
const EXTERNAL_CHAT_MODEL = import.meta.env.VITE_CHATBOT_MODEL || "";
const EXTERNAL_CHAT_REQUEST_ID = import.meta.env.VITE_CHATBOT_REQUEST_ID || "";
const EXTERNAL_CHAT_OPENAI_COMPAT =
  (import.meta.env.VITE_CHATBOT_OPENAI_COMPAT || "").toLowerCase() === "true";

const normalizeBranding = (text) => {
  if (typeof text !== "string") return text;
  return text
    .replaceAll("CodeSunny", "Vibha Prints")
    .replaceAll("codesunny.com", "www.vibhaprints.com")
    .replaceAll("codesunny.in", "www.vibhaprints.com")
    .replaceAll("information@codesunny.in", "info@vibhapints.com")
    .replaceAll("hello@codesunny.com", "vibhart07@gmail.com")
    .replaceAll("+91 89758075789", "+91 86249 48046")
    .replaceAll("+91 86259 48046", "+91 86249 48046")
    .replaceAll("https://vibha-prints.vercel.app", "https://www.vibhaprints.com/")
    .replaceAll("http://localhost:5173", "https://www.vibhaprints.com/");
};

// Predefined responses for the chatbot
const botResponses = {
  greeting: [
    "Hello! Welcome to Vibha Art. How can I help you today?",
    "Hi there! I'm Vibha's virtual assistant. What can I do for you?",
    "Welcome to Vibha Art! I'm here to assist you with any questions about our services.",
  ],
  services: [
    "We offer a range of graphic design and printing services including:\n\n• Logo Design\n• Business Cards\n• Brochures & Booklets\n• Packaging Design\n• Brand Identity\n\nWould you like to know more about any specific service?",
  ],
  logo: [
    "Our logo design services include concept development, multiple revisions, and delivery in all necessary formats. We focus on creating unique, memorable logos that represent your brand identity. Would you like to see some examples of our work?",
  ],
  business_cards: [
    "We create professional business card designs with options for various printing finishes including matte, glossy, and specialty papers. Would you like to discuss your business card requirements?",
  ],
  brochures: [
    "Our brochure and booklet design services include layout design, content organization, and print preparation. We can create anything from simple tri-fold brochures to elaborate multi-page booklets. What kind of brochure are you looking for?",
  ],
  packaging: [
    "Our packaging design services help your products stand out on the shelf. We create designs for boxes, labels, bags, and other packaging materials. Would you like to discuss your packaging design needs?",
  ],
  contact: [
    "You can reach us at info@vibhapints.com / vibhart07@gmail.com, call or WhatsApp us at +91 86249 48046, or visit https://www.vibhaprints.com/. Would you like us to contact you instead? I can take your details right now.",
  ],
  pricing: [
    "Our pricing varies based on the specific requirements of your project. Here's a general range:\n\n• Logo Design: ₹5,000 - ₹15,000\n• Business Cards: ₹2,000 - ₹5,000\n• Brochures: ₹3,000 - ₹10,000\n\nWould you like to get a custom quote for your project?",
  ],
  turnaround: [
    "Our typical turnaround times are:\n\n• Logo Design: 3-5 business days\n• Business Cards: 2-3 business days\n• Brochures: 3-7 business days\n• Complex Projects: 1-2 weeks\n\nWould you like to discuss your specific timeline?",
  ],
  portfolio: [
    "You can view our portfolio on our website. We have dedicated galleries for logo design, business cards, brochures, and packaging design. Would you like me to direct you to a specific section?",
  ],
  process: [
    "Our design process typically includes:\n\n1. Initial consultation\n2. Research & concept development\n3. Design presentation\n4. Revisions based on feedback\n5. Final delivery\n\nWould you like more details about any of these steps?",
  ],
  default: [
    "I'm not sure I understand. Could you please rephrase your question or select from one of these common topics: services, pricing, contact information, or turnaround time?",
    "I didn't quite catch that. Can you try asking in a different way or let me know if you need information about our design services, pricing, or how to contact us?",
    "I'm still learning! Could you please clarify what you're looking for? You can ask about our design services, printing options, or how to get in touch with our team.",
  ],
};

// Keywords to match user queries
const keywords = {
  greeting: [
    "hello",
    "hi",
    "hey",
    "greetings",
    "good morning",
    "good afternoon",
    "good evening",
  ],
  services: [
    "service",
    "offer",
    "provide",
    "design",
    "print",
    "what do you do",
  ],
  logo: ["logo", "brand mark", "symbol", "company logo", "logo design"],
  business_cards: [
    "business card",
    "visiting card",
    "name card",
    "contact card",
  ],
  brochures: ["brochure", "booklet", "pamphlet", "leaflet", "catalog", "flyer"],
  packaging: ["packaging", "package", "box", "label", "product packaging"],
  contact: ["contact", "email", "phone", "call", "reach", "talk", "connect"],
  pricing: [
    "price",
    "cost",
    "rate",
    "fee",
    "charge",
    "quote",
    "estimate",
    "how much",
  ],
  turnaround: [
    "time",
    "long",
    "fast",
    "quick",
    "turnaround",
    "deadline",
    "when",
    "how soon",
  ],
  portfolio: [
    "portfolio",
    "examples",
    "samples",
    "work",
    "previous",
    "projects",
  ],
  process: [
    "process",
    "how does it work",
    "steps",
    "procedure",
    "how do you",
    "workflow",
  ],
};

// Function to get a random response from an array
const getRandomResponse = (responses) => {
  return responses[Math.floor(Math.random() * responses.length)];
};

const postWithTimeout = async (url, payload, extraHeaders = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), MCP_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...extraHeaders },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
};

const getByPath = (obj, path) => {
  if (!obj || !path) return undefined;
  return path
    .split(".")
    .reduce((acc, key) => (acc && key in acc ? acc[key] : undefined), obj);
};

const extractReplyFromApiResponse = (response) => {
  if (!response || typeof response !== "object") return "";

  if (EXTERNAL_CHAT_API_RESPONSE_PATH) {
    const byPath = getByPath(response, EXTERNAL_CHAT_API_RESPONSE_PATH);
    if (typeof byPath === "string" && byPath.trim()) return byPath;
  }

  const directCandidates = ["reply", "response", "message", "text", "output"];
  for (const key of directCandidates) {
    if (typeof response[key] === "string" && response[key].trim()) {
      return response[key];
    }
  }

  const nestedCandidates = [
    getByPath(response, "data.reply"),
    getByPath(response, "data.message"),
    getByPath(response, "result.reply"),
    getByPath(response, "choices.0.message.content"),
  ];

  const nested = nestedCandidates.find(
    (value) => typeof value === "string" && value.trim(),
  );

  return nested || "";
};

const callExternalChatApi = async (message) => {
  if (!EXTERNAL_CHAT_API_URL) {
    console.log("Chat API not configured, using local responses");
    return "";
  }

  try {
    const headers = { "Content-Type": "application/json" };
    if (EXTERNAL_CHAT_API_KEY) {
      headers[EXTERNAL_CHAT_API_AUTH_HEADER] =
        `${EXTERNAL_CHAT_API_KEY_PREFIX}${EXTERNAL_CHAT_API_KEY}`;
    }

    const isOpenAICompatEndpoint =
      EXTERNAL_CHAT_OPENAI_COMPAT ||
      EXTERNAL_CHAT_API_URL.includes("/chat/completions");
    const isBackendGroqEndpoint = EXTERNAL_CHAT_API_URL.includes("/api/groq/chat");

    const payload = isBackendGroqEndpoint
      ? {
          input: message,
          ...(EXTERNAL_CHAT_MODEL ? { model: EXTERNAL_CHAT_MODEL } : {}),
        }
      : isOpenAICompatEndpoint
      ? {
          model: EXTERNAL_CHAT_MODEL || "openai/gpt-oss-120b",
          messages: [
            {
              role: "system",
              content: VIBHA_CHATBOT_SYSTEM_PROMPT,
            },
            { role: "user", content: message },
          ],
          temperature: 0.4,
          max_tokens: 320,
        }
      : {
          [EXTERNAL_CHAT_API_MESSAGE_FIELD]: message,
          session_id: "website-chat",
          source: "vibha-art-website",
          ...(EXTERNAL_CHAT_MODEL ? { model: EXTERNAL_CHAT_MODEL } : {}),
          ...(EXTERNAL_CHAT_REQUEST_ID
            ? { request_id: EXTERNAL_CHAT_REQUEST_ID }
            : {}),
        };

    console.log("Calling chat API with payload:", {
      url: EXTERNAL_CHAT_API_URL,
      model: EXTERNAL_CHAT_MODEL,
    });

    const response = await postWithTimeout(
      EXTERNAL_CHAT_API_URL,
      payload,
      headers,
    );

    if (response && response.choices && response.choices[0]) {
      const reply =
        response.choices[0].message?.content || response.choices[0].text || "";
      console.log("API Response received:", reply);
      return reply;
    }

    const extracted = extractReplyFromApiResponse(response);
    console.log("Extracted response:", extracted);
    return extracted;
  } catch (error) {
    console.error("Chat API error:", error.message);
    return "";
  }
};

const callExternalLeadApi = async (formData) => {
  if (!EXTERNAL_LEAD_API_URL) return false;

  const headers = { "Content-Type": "application/json" };
  if (EXTERNAL_CHAT_API_KEY) {
    headers[EXTERNAL_CHAT_API_AUTH_HEADER] =
      `${EXTERNAL_CHAT_API_KEY_PREFIX}${EXTERNAL_CHAT_API_KEY}`;
  }

  const response = await postWithTimeout(
    EXTERNAL_LEAD_API_URL,
    {
      name: formData?.name || "Website Visitor",
      email: formData?.email || "",
      mobile: formData?.phone || "",
      message: formData?.message || "",
      source: "vibha-art-website",
    },
    headers,
  );

  return Boolean(
    response?.success ||
      response?.ok ||
      response?.status === "success" ||
      response?.status === "received",
  );
};

// Function to determine the bot's response based on user input
export const getBotResponse = (message) => {
  const lowerMessage = message.toLowerCase();

  // Check for keywords in the message
  for (const [category, categoryKeywords] of Object.entries(keywords)) {
    if (categoryKeywords.some((keyword) => lowerMessage.includes(keyword))) {
      return getRandomResponse(botResponses[category]);
    }
  }

  // If no keywords match, return a default response
  return getRandomResponse(botResponses.default);
};

// Function to simulate a bot response with a delay
export const getDelayedBotResponse = (message) => {
  return new Promise((resolve) => {
    setTimeout(
      async () => {
        try {
          const externalReply = await callExternalChatApi(message);
          if (externalReply) {
            resolve(normalizeBranding(externalReply));
            return;
          }
        } catch (error) {
          console.warn(
            "Custom chatbot API unavailable, using local fallback:",
            error.message,
          );
        }

        const response = getBotResponse(message);
        resolve(normalizeBranding(response));
      },
      1000 + Math.random() * 1000,
    );
  });
};

// Function to simulate form submission
export const submitContactForm = async (formData) => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  try {
    const leadSaved = await callExternalLeadApi(formData);
    if (leadSaved) {
      return {
        success: true,
        message: "Form submitted successfully",
      };
    }
  } catch (error) {
    console.warn(
      "Custom lead API unavailable, using local success fallback:",
      error.message,
    );
  }

  return {
    success: true,
    message: "Form submitted successfully",
  };
};

// Function to log chat interactions (dummy implementation)
export const logChatInteraction = (data) => {
  console.log("Chat interaction logged:", data);
  return true;
};
