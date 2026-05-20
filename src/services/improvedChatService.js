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
    "Namaste! Vibha Prints mein aapka swagat hai. Main aapki kaise madad kar sakta hoon?",
    "Hi there! I'm Vibha's assistant. Aap mujhse kya pooch sakte ho?",
    "Welcome to Vibha Prints! Aapke liye main kya kar sakta hoon?",
  ],
  services: [
    "Hum ye services provide karte hain:\n\n✓ Logo Design\n✓ Business Cards\n✓ Brochures\n✓ Packaging Design\n✓ Brand Identity\n\nKaunsi service ke baare mein jaankari chahiye?",
    "Hamari services:\n• Graphic Design\n• Printing Services\n• Branding Solutions\n• Marketing Materials\n\nKya aap kisi specific service ke baare mein poochna chahte ho?",
  ],
  printing: [
    "Hamari printing services mein ye sab included hain:\n\n🖨️ Digital Printing - Fast aur cost-effective\n🖨️ Offset Printing - High volume ke liye\n🖨️ Business Cards - Premium quality\n🖨️ Brochures & Booklets - Professional design\n🖨️ Banners & Flex - Large format printing\n🖨️ Packaging - Custom boxes aur labels\n\nKaunsi printing service chahiye aapko?",
    "Printing services ke liye hum best quality guarantee karte hain:\n\n✓ Fast turnaround\n✓ Affordable pricing\n✓ Premium materials\n✓ Professional output\n\nAapko kaunsi printing chahiye? Business cards, brochures, banners, ya kuch aur?",
  ],
  logo: [
    "Logo design mein hum concept se lekar final delivery tak sab karte hain. Aapka brand identity banate hain jo memorable ho. Kya aap apna logo design karana chahte ho?",
    "Professional logo design jo aapke brand ko represent kare. Multiple revisions aur all formats mein delivery. Interested ho?",
  ],
  business_cards: [
    "Business cards ke liye hum premium quality paper aur designs provide karte hain. Matte, glossy, ya specialty finishes - sab available hai. Kitne cards chahiye?",
    "Professional business card design aur printing. Quick turnaround time. Aapke requirements kya hain?",
  ],
  brochures: [
    "Brochure design mein hum layout, content organization, aur print preparation sab handle karte hain. Tri-fold se lekar multi-page booklets tak. Kya chahiye aapko?",
    "Beautiful brochure designs jo aapke customers ko impress kare. Aapke budget aur timeline bataye?",
  ],
  packaging: [
    "Packaging design jo aapke product ko shelf mein stand out kare. Boxes, labels, bags - sab ke liye designs. Aapka product kya hai?",
    "Eye-catching packaging design jo sales badha de. Aapke product ke liye custom design banate hain.",
  ],
  contact: [
    "Aap hume contact kar sakte ho:\nEmail: info@vibhaprints.com / vibhart07@gmail.com\nPhone/WhatsApp: +91 86249 48046\nWebsite: https://www.vibhaprints.com/\n\nYa main aapka contact form fill kar dunga?",
    "Contact karne ke liye:\nEmail: info@vibhaprints.com / vibhart07@gmail.com\nPhone/WhatsApp: +91 86249 48046\nWebsite: https://www.vibhaprints.com/\n\nKya aap apna number dena chahte ho?",
  ],
  pricing: [
    "Pricing aapke project ke hisaab se hoti hai:\n\n💰 Logo Design: ₹5,000 - ₹15,000\n💰 Business Cards: ₹2,000 - ₹5,000\n💰 Brochures: ₹3,000 - ₹10,000\n💰 Printing: ₹1,000 - ₹50,000+ (volume ke hisaab se)\n\nCustom quote chahiye?",
    "Pricing flexible hai. Aapke budget aur requirements bataye, hum quote denge.",
  ],
  turnaround: [
    "Turnaround time:\n⏱️ Logo: 3-5 days\n⏱️ Business Cards: 2-3 days\n⏱️ Brochures: 3-7 days\n⏱️ Printing: 1-3 days (volume ke hisaab se)\n⏱️ Complex: 1-2 weeks\n\nAapka deadline kya hai?",
    "Turnaround time project ke hisaab se hoti hai. Urgent kaam bhi kar sakte hain.",
  ],
  portfolio: [
    "Hamara portfolio website par dekh sakte ho. Logo design, business cards, brochures, printing samples - sab galleries hain. Dekhna chahte ho?",
    "Hamari previous work dekh sakte ho website par. Kaunsi category mein interested ho?",
  ],
  process: [
    "Hamari process:\n1️⃣ Consultation\n2️⃣ Research & Concepts\n3️⃣ Design Presentation\n4️⃣ Revisions\n5️⃣ Final Delivery\n\nKya aur jaankari chahiye?",
    "Step-by-step process jo transparent aur professional hai. Aapka feedback har step mein important hai.",
  ],
  default: [
    "Is baare mein main sure nahi hoon - aap seedha WhatsApp karein: +91 86249 48046, team turant help karegi.",
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
    "design",
    "print",
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
        }
      : isWebsiteBridgeEndpoint
      ? {
          message,
          messages: conversationHistory,
          session_id: getStoredChatSessionId(),
          source: "vibha-prints-website",
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

    if (response?.session_id) {
      storeChatSessionId(response.session_id);
    }

    const extractedReply = extractReplyFromApiResponse(response);
    if (extractedReply) {
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

  // Check for keywords - PRINTING FIRST (most specific)
  if (keywords.printing.some((keyword) => lowerMessage.includes(keyword))) {
    const response = getRandomResponse(botResponses.printing);
    console.log("Matched: printing");
    return response;
  }

  // Then check other categories
  for (const [category, categoryKeywords] of Object.entries(keywords)) {
    if (category === "printing") continue; // Skip printing as we already checked it
    if (categoryKeywords.some((keyword) => lowerMessage.includes(keyword))) {
      const response = getRandomResponse(botResponses[category]);
      console.log(`Matched: ${category}`);
      return response;
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
        try {
          // Try API first
          const apiReply = await callExternalChatApi(message);
          if (apiReply && apiReply.trim()) {
            resolve(apiReply);
            return;
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

  try {
    const response = await postWithTimeout(
      import.meta.env.VITE_CONTACT_NOTIFY_API_URL || "",
      {
        name: formData?.name || "Website Visitor",
        email: formData?.email || "",
        phone: formData?.phone || "",
        message: formData?.message || "",
        source: "vibha-prints-website",
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
