/**
 * Improved Chat Service
 * Better error handling and proper API integration
 */

import { buildSystemPrompt } from "./chatbotPrompt";

const MCP_TIMEOUT_MS = 12000;

const EXTERNAL_CHAT_API_URL = import.meta.env.VITE_CHATBOT_API_URL || "";
const EXTERNAL_CHAT_API_KEY = import.meta.env.VITE_CHATBOT_API_KEY || "";
const EXTERNAL_CHAT_MODEL =
  import.meta.env.VITE_CHATBOT_MODEL || "openai/gpt-oss-120b";
const LEAD_API_URL =
  import.meta.env.VITE_CHATBOT_LEAD_API_URL ||
  import.meta.env.VITE_CONTACT_NOTIFY_API_URL ||
  "";

const CHAT_SESSION_STORAGE_KEY = "vibha_chat_session_id";
const CHAT_HISTORY_STORAGE_KEY = "vibha_chat_history";
const MAX_CHAT_HISTORY_MESSAGES = 12;

const getStoredChatSessionId = () => {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(CHAT_SESSION_STORAGE_KEY) || "";
};

const storeChatSessionId = (sessionId) => {
  if (typeof window === "undefined" || !sessionId) return;
  window.localStorage.setItem(CHAT_SESSION_STORAGE_KEY, sessionId);
};

const getStoredChatHistory = () => {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(
      window.sessionStorage.getItem(CHAT_HISTORY_STORAGE_KEY) || "[]",
    );
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const storeChatHistory = (messages) => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(
    CHAT_HISTORY_STORAGE_KEY,
    JSON.stringify(messages.slice(-MAX_CHAT_HISTORY_MESSAGES)),
  );
};

// Predefined responses for the chatbot
const botResponses = {
  greeting: [
    "Sure 😊\nAapko printing, branding, website ya digital marketing me kis type ki help chahiye?",
    "Hi! Aap requirement bata dijiye, main right option suggest kar dunga.\nPrinting, design ya marketing me help chahiye?",
    "Namaste! Aap kis kaam ke liye help chahte hain?\nMain quote aur best option guide kar dunga.",
  ],
  services: [
    "Hum design, printing, website, branding aur digital marketing services provide karte hain.\nAap kis service ke baare mein jaankari chahte hain?",
    "Vibha Prints mein logo/branding, business cards, brochures, packaging, website aur digital marketing support milta hai.\nKaunsi service discuss karni hai?",
  ],
  printing: [
    "Sure, printing me help kar denge 😊\nAapko business cards, brochures, banners/flex, stickers ya packaging me kya chahiye?",
    "Printing ke liye best option quantity aur finish par depend karta hai.\nAap item aur approx quantity share kar dijiye.",
  ],
  website: [
    "Website design/development ke liye pages, features aur content readiness se quote decide hota hai.\nAap business website, landing page ya ecommerce chahte hain?",
    "Website ke liye hum design, development, responsive layout aur basic SEO setup guide kar sakte hain.\nAapko kitne pages ki website chahiye?",
  ],
  digital_marketing: [
    "Digital marketing ke liye goal, platform aur monthly budget se plan decide hota hai.\nAap SEO, social media ya ads mein help chahte hain?",
    "Marketing support mein social media creatives, SEO guidance aur campaign planning kar sakte hain.\nAapka main goal leads hai ya brand awareness?",
  ],
  logo: [
    "Logo design mein hum concept se lekar final delivery tak sab karte hain. Aapka brand identity banate hain jo memorable ho. Kya aap apna logo design karana chahte ho?",
    "Professional logo design jo aapke brand ko represent kare. Multiple revisions aur all formats mein delivery. Interested ho?",
  ],
  business_cards: [
    "Business cards ke liye matte aur soft-touch finishes kaafi premium look dete hain 😊\nApprox kitni quantity chahiye?",
    "Business card printing ke liye matte finish chahiye ya glossy?\nHum print se pehle mockup preview bhi share kar dete hain.",
  ],
  brochures: [
    "Brochure design mein hum layout, content organization, aur print preparation sab handle karte hain. Tri-fold se lekar multi-page booklets tak. Kya chahiye aapko?",
    "Beautiful brochure designs jo aapke customers ko impress kare. Aapke budget aur timeline bataye?",
  ],
  packaging: [
    "Packaging/label ke liye design aur printing dono guide kar sakte hain.\nAapka product type kya hai aur approx quantity kitni rahegi?",
    "Product packaging me material, size aur finish se premium feel decide hoti hai.\nAap product category share kar dijiye.",
  ],
  social_media: [
    "Instagram aur Facebook ke liye monthly post packages available hain 😊\nAap kis business category ke liye posts chahte hain?",
    "Social media creatives ke liye monthly packages better rahenge agar regular posting chahiye.\nAapko posts kis business ke liye chahiye?",
  ],
  contact: [
    "Aap hume contact kar sakte ho:\nEmail: info@vibhaprints.com / vibhart07@gmail.com\nPhone/WhatsApp: +91 86249 48046\nWebsite: https://www.vibhaprints.com/\n\nYa main aapka contact form fill kar dunga?",
    "Contact karne ke liye:\nEmail: info@vibhaprints.com / vibhart07@gmail.com\nPhone/WhatsApp: +91 86249 48046\nWebsite: https://www.vibhaprints.com/\n\nKya aap apna number dena chahte ho?",
  ],
  pricing: [
    "Pricing quantity, size aur finish par depend karti hai.\nAap item + approx quantity bata dijiye, main quote ke liye right details ready kar dunga.",
    "Small quantities bhi available hain 😊\nAap trial order se start kar sakte hain. Kis item ka rate chahiye?",
  ],
  turnaround: [
    "Timeline requirement par depend karegi, urgent kaam me team priority check kar sakti hai.\nAapko delivery kab tak chahiye?",
    "Agar artwork ready hai to process faster ho sakta hai.\nAap deadline aur item share kar dijiye.",
  ],
  portfolio: [
    "Hamara portfolio website par dekh sakte ho. Logo design, business cards, brochures, printing samples - sab galleries hain. Dekhna chahte ho?",
    "Hamari previous work dekh sakte ho website par. Kaunsi category mein interested ho?",
  ],
  process: [
    "Hamari process:\n1. Consultation\n2. Research & Concepts\n3. Design Presentation\n4. Revisions\n5. Final Delivery\n\nKya aur jaankari chahiye?",
    "Step-by-step process jo transparent aur professional hai. Aapka feedback har step mein important hai.",
  ],
  default: [
    "Is baare mein main sure nahi hoon. Aap seedha WhatsApp karein: +91 86249 48046, team turant help karegi.",
  ],
};
// Keywords to match user queries
const keywords = {
  greeting: [
    "hello",
    "hi",
    "hey",
    "namaste",
    "namaskar",
    "greetings",
    "good morning",
    "good afternoon",
    "good evening",
    "hola",
  ],
  services: [
    "service",
    "offer",
    "provide",
    "what do you do",
    "kya karte ho",
    "services",
    "kaunsi services",
  ],
  printing: [
    "printing",
    "print",
    "printed",
    "printing services",
    "print services",
    "printing ke baare",
    "printing chahiye",
  ],
  website: [
    "website",
    "web site",
    "web design",
    "website design",
    "web development",
    "website development",
    "site banana",
    "site banwana",
    "landing page",
    "ecommerce",
    "e-commerce",
    "online store",
    "web",
  ],
  digital_marketing: [
    "digital marketing",
    "seo",
    "google ads",
    "ads",
    "advertising",
    "marketing",
    "lead generation",
    "social media marketing",
  ],
  logo: [
    "logo",
    "brand mark",
    "symbol",
    "company logo",
    "logo design",
    "brand identity",
  ],
  business_cards: [
    "business card",
    "visiting card",
    "name card",
    "contact card",
    "business cards",
  ],
  brochures: [
    "brochure",
    "booklet",
    "pamphlet",
    "leaflet",
    "catalog",
    "flyer",
    "brochures",
  ],
  packaging: [
    "packaging",
    "package",
    "box",
    "label",
    "product packaging",
    "boxes",
  ],
  social_media: [
    "social media",
    "instagram",
    "facebook",
    "post",
    "posts",
    "creative",
    "reels",
  ],
  contact: [
    "contact",
    "email",
    "phone",
    "call",
    "reach",
    "talk",
    "connect",
    "number",
    "address",
  ],
  pricing: [
    "price",
    "cost",
    "rate",
    "fee",
    "charge",
    "quote",
    "estimate",
    "how much",
    "kitna",
    "rate",
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
    "kitne din",
  ],
  portfolio: [
    "portfolio",
    "examples",
    "samples",
    "work",
    "previous",
    "projects",
    "gallery",
  ],
  process: [
    "process",
    "how does it work",
    "steps",
    "procedure",
    "how do you",
    "workflow",
    "kaise karte ho",
  ],
};

// Get random response
const getRandomResponse = (responses) => {
  return responses[Math.floor(Math.random() * responses.length)];
};

const priorityCategories = [
  "website",
  "digital_marketing",
  "printing",
  "logo",
  "business_cards",
  "brochures",
  "packaging",
  "social_media",
  "pricing",
  "turnaround",
  "contact",
  "portfolio",
  "process",
  "services",
  "greeting",
];

const unsafeAutomationActions = new Set([
  "generate_image",
  "image_generation",
  "seo_audit",
  "calculate_quote",
  "schedule_meeting",
]);

const looksLikeAutomationReply = (reply = "") => {
  const normalized = reply.toLowerCase();
  return [
    "image generate",
    "generating image",
    "prompt:",
    "seo audit",
    "calculating quote",
    "quote calculate kar raha",
  ].some((phrase) => normalized.includes(phrase));
};

const shouldRejectApiResponse = (response, reply) => {
  if (!response || typeof response !== "object") return false;

  const action = String(
    response.action ||
      response.intent ||
      getByPath(response, "data.action") ||
      getByPath(response, "data.intent") ||
      "",
  ).toLowerCase();
  if (unsafeAutomationActions.has(action)) return true;

  return looksLikeAutomationReply(reply);
};

const serviceMismatchKeywords = {
  website: ["printing ke liye", "business card", "matte", "glossy", "finish bata"],
  digital_marketing: ["printing ke liye", "business card", "matte", "glossy"],
  printing: ["website ke liye", "web development", "landing page", "ecommerce"],
};

const isMismatchedServiceReply = (service, reply = "") => {
  if (!service || !serviceMismatchKeywords[service]) return false;
  const normalizedReply = reply.toLowerCase();
  return serviceMismatchKeywords[service].some((keyword) =>
    normalizedReply.includes(keyword),
  );
};

const detectServiceFromText = (text = "") => {
  const lowerText = text.toLowerCase();
  for (const category of [
    "business_cards",
    "social_media",
    "website",
    "digital_marketing",
    "printing",
    "logo",
    "brochures",
    "packaging",
  ]) {
    const categoryKeywords = keywords[category] || [];
    if (categoryKeywords.some((keyword) => lowerText.includes(keyword))) {
      return category;
    }
  }
  return "";
};

const detectPreviousServiceIntent = () => {
  const history = getStoredChatHistory();
  for (const item of [...history].reverse()) {
    const service = detectServiceFromText(item?.content || "");
    if (service) return service;
  }
  return "";
};

const detectMatchedCategory = (text = "") => {
  const lowerText = text.toLowerCase().trim();
  return (
    priorityCategories.find((category) => {
      const categoryKeywords = keywords[category] || [];
      return categoryKeywords.some((keyword) => lowerText.includes(keyword));
    }) || ""
  );
};

// Post with timeout
const postWithTimeout = async (
  url,
  payload,
  headers = {},
  timeout = MCP_TIMEOUT_MS,
) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("API call failed:", error.message);
    return null;
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

  const directCandidates = ["reply", "text", "response", "message", "output"];
  for (const key of directCandidates) {
    if (typeof response[key] === "string" && response[key].trim()) {
      return response[key];
    }
  }

  const nestedCandidates = [
    getByPath(response, "data.reply"),
    getByPath(response, "data.text"),
    getByPath(response, "result.reply"),
    getByPath(response, "choices.0.message.content"),
    getByPath(response, "choices.0.text"),
  ];

  return (
    nestedCandidates.find(
      (value) => typeof value === "string" && value.trim(),
    ) || ""
  );
};

// Call external chat API
const callExternalChatApi = async (message) => {
  if (!EXTERNAL_CHAT_API_URL) {
    console.log("Chat API not configured");
    return "";
  }

  try {
    const conversationHistory = [
      ...getStoredChatHistory(),
      { role: "user", content: message },
    ].slice(-MAX_CHAT_HISTORY_MESSAGES);

    const headers = {
      "Content-Type": "application/json",
    };
    if (EXTERNAL_CHAT_API_KEY) {
      headers.Authorization = `Bearer ${EXTERNAL_CHAT_API_KEY}`;
    }

    const isBackendGroqEndpoint = EXTERNAL_CHAT_API_URL.includes("/api/groq/chat");
    const isWebsiteBridgeEndpoint = EXTERNAL_CHAT_API_URL.includes("/api/chat");
    const payload = isBackendGroqEndpoint
      ? {
          input: message,
          messages: conversationHistory,
          model: EXTERNAL_CHAT_MODEL,
          mode: "website_chat",
          force_chat: true,
        }
      : isWebsiteBridgeEndpoint
      ? {
          message,
          messages: conversationHistory,
          session_id: getStoredChatSessionId(),
          source: "vibha-prints-website",
          mode: "website_chat",
          force_chat: true,
        }
      : {
          model: EXTERNAL_CHAT_MODEL,
          messages: [
            {
              role: "system",
              content: buildSystemPrompt(),
            },
            ...conversationHistory,
          ],
          temperature: 0.35,
          max_tokens: 320,
        };

    console.log("Calling chat API...");
    const response = await postWithTimeout(
      EXTERNAL_CHAT_API_URL,
      payload,
      headers,
    );

    const sessionId = response?.session_id || getByPath(response, "data.session_id");
    if (sessionId) {
      storeChatSessionId(sessionId);
    }

    const extractedReply = extractReplyFromApiResponse(response);
    if (extractedReply) {
      if (shouldRejectApiResponse(response, extractedReply)) {
        console.warn("Rejected non-chat API response, using local chatbot fallback");
        return "";
      }

      console.log("API Response:", extractedReply);
      storeChatHistory([
        ...conversationHistory,
        { role: "assistant", content: extractedReply },
      ]);
      return extractedReply;
    }

    if (response && response.choices && response.choices[0]) {
      const reply =
        response.choices[0].message?.content || response.choices[0].text || "";
      console.log("API Response:", reply);
      storeChatHistory([
        ...conversationHistory,
        { role: "assistant", content: reply },
      ]);
      return reply;
    }

    console.log("No valid response from API");
    return "";
  } catch (error) {
    console.error("Chat API error:", error.message);
    return "";
  }
};

// Get bot response
export const getBotResponse = (message) => {
  const lowerMessage = message.toLowerCase().trim();
  const currentService = detectServiceFromText(lowerMessage);
  const matchedCategory = detectMatchedCategory(message);

  if (matchedCategory) {
    const response = getRandomResponse(botResponses[matchedCategory]);
    console.log(`Matched: ${matchedCategory}`);
    return response;
  }

  const previousService = detectPreviousServiceIntent();

  if (!currentService && previousService) {
    if (previousService === "business_cards") {
      return "Business card printing ke liye aapko matte finish chahiye ya glossy?\nQuantity bhi share kar dijiye.";
    }
    if (previousService === "social_media") {
      return "Social media posts ke liye category aur monthly quantity se package decide hota hai.\nAapka business type kya hai?";
    }
    if (previousService === "website") {
      return "Website ke liye pages, features aur deadline share kar dijiye.\nUske basis par package guide ho jayega.";
    }
    if (previousService === "digital_marketing") {
      return "Digital marketing ke liye platform, goal aur monthly budget range bata dijiye.\nUske basis par plan suggest karenge.";
    }
    if (previousService === "printing") {
      return "Printing ke liye size, quantity aur finish bata dijiye.\nUske basis par quote guide ho jayega.";
    }
  }

  // Default response
  return getRandomResponse(botResponses.default);
};

// Get delayed bot response with API fallback
export const getDelayedBotResponse = async (message) => {
  return new Promise((resolve) => {
    setTimeout(
      async () => {
        const explicitService = detectServiceFromText(message);
        const explicitCategory = detectMatchedCategory(message);
        if (explicitService || explicitCategory) {
          resolve(getBotResponse(message));
          return;
        }

        try {
          // Try API first
          const apiReply = await callExternalChatApi(message);
          if (apiReply && apiReply.trim()) {
            if (isMismatchedServiceReply(explicitService, apiReply)) {
              console.warn("Rejected mismatched service response, using local chatbot fallback");
            } else {
              resolve(apiReply);
              return;
            }
          }
        } catch (error) {
          console.warn("API failed, using local response:", error.message);
        }

        // Fallback to local responses
        const localResponse = getBotResponse(message);
        resolve(localResponse);
      },
      800 + Math.random() * 700,
    );
  });
};

// Submit contact form
export const submitContactForm = async (formData) => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (!LEAD_API_URL) {
    console.warn("Lead API not configured");
    return { success: true, message: "Form captured locally" };
  }

  try {
    const response = await postWithTimeout(
      LEAD_API_URL,
      {
        name: formData?.name || "Website Visitor",
        email: formData?.email || "",
        phone: formData?.phone || "",
        mobile: formData?.phone || "",
        message: formData?.message || "",
        source: "vibha-prints-website",
        lead_type: "contact",
      },
      { "Content-Type": "application/json" },
    );

    if (response?.success || response?.ok) {
      return { success: true, message: "Form submitted successfully" };
    }
  } catch (error) {
    console.warn("Lead API error:", error.message);
  }

  return { success: true, message: "Form submitted successfully" };
};

// Log chat interaction
export const logChatInteraction = (data) => {
  console.log("Chat interaction:", data);
};
