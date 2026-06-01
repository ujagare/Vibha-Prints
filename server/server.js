const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// Initialize Supabase client only when chat persistence is configured.
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

const supabase =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

const SYSTEM_PROMPT = `
You are Vibha, Vibha Art's senior website chat assistant.

Rules:
- Reply like a calm, experienced Vibha Prints support person chatting on WhatsApp.
- Sound natural, warm, and human-like, but never falsely claim you are a human.
- Be short, clear, and conversational.
- Use the customer's words and intent; do not give robotic menu-style answers.
- If the customer asks casually, reply casually. If they ask business details, become precise.
- Help users with printing services, graphic design, branding, digital marketing, and web development.
- Main goal is conversion: identify intent, recommend the best option, qualify gently, build trust, then collect lead details gradually.
- Services include logo design, brand identity, business cards, brochures, pamphlets, posters, catalogs, company profile, packaging, labels, stickers, hangtags, corporate stationery, flex/vinyl/banner printing, bags, T-shirts, social media creatives, websites, landing pages, ecommerce, SEO, ads, and email marketing.
- Contact details: info@vibhaprints.com, +91 86249 48046, and https://www.vibhaprints.com/.
- Accurate quote ke liye item type, size, quantity, material/paper, finish, delivery city aur deadline chahiye.
- Always refer to what the user has already shared in this conversation. If user already gave their name or requirement, do not ask again.
- Suggest relevant Vibha Prints services when helpful, like a consultant.
- For business cards, suggest matte or soft-touch laminated finish for a premium impression.
- For social media posts, suggest Instagram/Facebook monthly post packages and ask business category.
- For printing, mention mockup/proof preview before printing when it builds trust.
- For price concerns, suggest starting with a small or trial quantity where possible.
- Treat urgent, today/aaj, bulk, 1000+, deadline, ready artwork, order, or call me as high-intent and suggest quick team follow-up.
- Speak Hindi + English naturally using Roman Hindi/Hinglish.
- Do not use emojis, Devanagari, Marathi script, or long paragraphs.
- Keep WhatsApp-style replies complete in 2 to 4 short sentences.
- Ask maximum 1-2 useful follow-up questions at a time. Prefer 1 question early in the chat.
- Do not sound like a police interrogation. Avoid rapid-fire questions.
- Avoid repeating the company name in every reply.
- Avoid saying "as an AI", "I am a bot", or "I cannot" unless directly necessary.
- If the customer only says hi/hello, greet them warmly and ask how you can help.
- If the customer is confused, guide them step by step in simple language.
- If details are missing, ask naturally instead of listing too many questions.
- For quotes, ask for service type, quantity, size, material/finish, design status, deadline, and city as needed.
- For design projects, ask about business name, industry, style preference, colors, timeline, and budget range as needed.
- Do not invent fixed prices unless they are already provided by the user or business data.
- If the user wants pricing, give only estimate ranges and say final quote depends on requirements.
- Estimate ranges: logo design Rs 5,000-15,000+, business cards Rs 2,000-5,000+, brochures/pamphlets Rs 3,000-10,000+. Printing, packaging and websites depend on size, material, quantity, features and deadline.
- For printing quotes, collect item type, size, quantity, paper/material, finish, single/double side, delivery city and deadline.
- If the user is ready to proceed, collect name, phone, service requirement, and preferred callback time.
- If the request is urgent or complex, say the Vibha Prints team can follow up.
- Never claim an order is confirmed, payment is received, or production has started unless the user explicitly provides that status.
- If you don't know the answer or the question is outside Vibha Art's scope, say exactly: "Is baare mein main sure nahi hoon - aap seedha WhatsApp karein: +91 86249 48046, team turant help karegi."
- Never guess or make up information you are not sure about.
- Stay polite, helpful, and sales-focused without sounding pushy.
- Prefer replies like:
  "Haan, ye ho jayega. Aap quantity aur size bata do, main aapko proper quote ke liye guide kar deta hoon."
  "Samajh gaya. Aapko logo modern chahiye ya premium/classic style me?"
  "Sure, iske liye design ready hai ya design bhi banana hai?"
`.trim();

const VIBHA_LOCAL_KNOWLEDGE = {
  contact:
    "Aap hume info@vibhaprints.com / vibhart07@gmail.com par email kar sakte hain ya +91 86249 48046 par call/WhatsApp kar sakte hain. Monday to Saturday, business hours.",
  quote:
    "Accurate quote ke liye item type, size, quantity, material/paper, finish, delivery city aur deadline chahiye. Details milte hi team proper quotation share kar sakti hai.",
  services:
    "Vibha Art logo design, branding, business cards, brochures, packaging, stickers, labels, flex/banner printing, corporate stationery, social media creatives, website design/development aur digital marketing support provide karta hai.",
};

const buildSystemPrompt = () =>
  `${SYSTEM_PROMPT}

## Knowledge Base
Contact: ${VIBHA_LOCAL_KNOWLEDGE.contact}
Quote process: ${VIBHA_LOCAL_KNOWLEDGE.quote}
Services: ${VIBHA_LOCAL_KNOWLEDGE.services}`;

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);

const getEmailProvider = () =>
  String(process.env.EMAIL_PROVIDER || "smtp").trim().toLowerCase();

const buildResendAttachment = (attachment) => {
  if (!attachment?.path) return null;

  return {
    filename: attachment.filename || path.basename(attachment.path),
    content: fs.readFileSync(attachment.path).toString("base64"),
  };
};

const sendMailWithResend = async ({
  from,
  to,
  subject,
  text,
  html,
  replyTo,
  attachments = [],
}) => {
  const apiKey = process.env.RESEND_API_KEY || "";
  const apiUrl = process.env.RESEND_API_URL || "https://api.resend.com/emails";

  if (!apiKey) throw new Error("RESEND_API_KEY is not configured");

  const payload = {
    from: process.env.RESEND_FROM || from,
    to: Array.isArray(to) ? to : [to],
    subject,
    text,
  };

  if (html) payload.html = html;
  if (replyTo) payload.reply_to = replyTo;

  const resendAttachments = attachments
    .map(buildResendAttachment)
    .filter(Boolean);
  if (resendAttachments.length) payload.attachments = resendAttachments;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Resend email failed");
  }

  return { messageId: data?.id || "" };
};

const createMailTransporter = () => {
  if (getEmailProvider() === "resend") {
    if (!process.env.RESEND_API_KEY) return null;
    return { sendMail: sendMailWithResend };
  }

  const host = process.env.ZOHO_SMTP_HOST;
  const port = Number(process.env.ZOHO_SMTP_PORT || 587);
  const user = process.env.ZOHO_SMTP_USER;
  const pass = process.env.ZOHO_SMTP_PASS;

  if (!host || !port || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
};

const getMailIdentity = () => ({
  from:
    process.env.RESEND_FROM ||
    process.env.MAIL_FROM ||
    process.env.ZOHO_SMTP_USER,
  adminTo: process.env.MAIL_TO || process.env.ZOHO_SMTP_USER,
});

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const brandEmailHtml = ({ title, name, body, ctaText = "", ctaHref = "" }) => `
  <div style="font-family:Arial,sans-serif;background:#f6f7fb;padding:24px;color:#1f2937;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
      <div style="background:#111827;color:#ffffff;padding:20px 24px;">
        <h1 style="margin:0;font-size:22px;">Vibha Prints</h1>
        <p style="margin:6px 0 0;color:#d1d5db;">Design, Printing & Digital Growth</p>
      </div>
      <div style="padding:24px;">
        <h2 style="margin:0 0 12px;font-size:20px;color:#111827;">${escapeHtml(title)}</h2>
        <p style="margin:0 0 14px;">Hi ${escapeHtml(name || "there")},</p>
        ${body}
        ${
          ctaText && ctaHref
            ? `<p style="margin:22px 0;"><a href="${escapeHtml(ctaHref)}" style="background:#e65056;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:8px;display:inline-block;">${escapeHtml(ctaText)}</a></p>`
            : ""
        }
        <p style="margin:24px 0 0;color:#4b5563;">Regards,<br/>Vibha Prints Team</p>
      </div>
      <div style="border-top:1px solid #e5e7eb;padding:16px 24px;color:#6b7280;font-size:13px;">
        Email: ${escapeHtml(process.env.MAIL_FROM || "info@vibhaprints.com")}<br/>
        Phone/WhatsApp: +91 86249 48046<br/>
        Website: https://www.vibhaprints.com/
      </div>
    </div>
  </div>
`;

const textFromLines = (lines) => lines.filter(Boolean).join("\n");

const sendContactAutomationEmails = async ({ name, email, mobile, message, source }) => {
  const transporter = createMailTransporter();
  if (!transporter) throw new Error("Email provider is not configured");

  const { from, adminTo } = getMailIdentity();
  const adminText = textFromLines([
    "New Contact Form Lead",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Mobile: ${mobile}`,
    `Message: ${message || "N/A"}`,
    `Source: ${source || "website-contact-form"}`,
    `Received At: ${new Date().toISOString()}`,
  ]);

  const customerHtml = brandEmailHtml({
    title: "Thanks for contacting Vibha Prints",
    name,
    body: `
      <p style="line-height:1.6;margin:0 0 14px;">Aapka enquiry mil gaya hai. Hamari team aapki requirement check karke jaldi follow up karegi.</p>
      <p style="line-height:1.6;margin:0 0 14px;">Agar aap quick quote chahte hain, to quantity, size, material/finish, deadline aur city reply me share kar dijiye.</p>
    `,
  });

  const customerText = textFromLines([
    `Hi ${name},`,
    "",
    "Aapka enquiry mil gaya hai. Hamari team aapki requirement check karke jaldi follow up karegi.",
    "Quick quote ke liye quantity, size, material/finish, deadline aur city reply me share kar dijiye.",
    "",
    "Regards,",
    "Vibha Prints Team",
  ]);

  const [adminInfo, customerInfo] = await Promise.all([
    transporter.sendMail({
      from,
      to: adminTo,
      subject: `Contact Lead: ${name}`,
      text: adminText,
      replyTo: email,
    }),
    transporter.sendMail({
      from,
      to: email,
      subject: "Thanks for contacting Vibha Prints",
      text: customerText,
      html: customerHtml,
      replyTo: from,
    }),
  ]);

  return {
    adminMessageId: adminInfo.messageId,
    customerMessageId: customerInfo.messageId,
  };
};

const sendBrochureAutomationEmails = async ({
  name,
  email,
  phone,
  company,
  brochure_name,
  source,
}) => {
  const transporter = createMailTransporter();
  if (!transporter) throw new Error("Email provider is not configured");

  const { from, adminTo } = getMailIdentity();
  const brochurePath = process.env.BROCHURE_PATH || "";
  const attachments =
    brochurePath && fs.existsSync(brochurePath)
      ? [{ filename: path.basename(brochurePath), path: brochurePath }]
      : [];

  const adminText = textFromLines([
    "New Brochure Download Lead",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Company: ${company || "N/A"}`,
    `Brochure: ${brochure_name || "Vibha_Printing Media"}`,
    `Source: ${source || "website"}`,
    `Attachment Found: ${attachments.length ? "yes" : "no"}`,
    `Received At: ${new Date().toISOString()}`,
  ]);

  const customerHtml = brandEmailHtml({
    title: "Your Vibha Prints brochure is here",
    name,
    body: `
      <p style="line-height:1.6;margin:0 0 14px;">Thanks for your interest. Brochure attached hai, aap services aur work details check kar sakte hain.</p>
      <p style="line-height:1.6;margin:0 0 14px;">Agar aap kisi design/printing requirement ke liye quote chahte hain, to service, quantity, size, deadline aur city reply me share kar dijiye.</p>
    `,
  });

  const customerText = textFromLines([
    `Hi ${name},`,
    "",
    "Thanks for your interest. Brochure attached hai, aap services aur work details check kar sakte hain.",
    "Quote ke liye service, quantity, size, deadline aur city reply me share kar dijiye.",
    "",
    "Regards,",
    "Vibha Prints Team",
  ]);

  const [adminInfo, customerInfo] = await Promise.all([
    transporter.sendMail({
      from,
      to: adminTo,
      subject: `Brochure Lead: ${name}`,
      text: adminText,
      replyTo: email,
    }),
    transporter.sendMail({
      from,
      to: email,
      subject: "Vibha Prints Brochure",
      text: customerText,
      html: customerHtml,
      attachments,
      replyTo: from,
    }),
  ]);

  return {
    adminMessageId: adminInfo.messageId,
    customerMessageId: customerInfo.messageId,
    brochureAttached: attachments.length > 0,
  };
};

const normalizeIndianChatId = (phoneOrChatId) => {
  const value = String(phoneOrChatId || "").trim();
  if (!value) return "";
  if (value.endsWith("@c.us") || value.endsWith("@g.us")) return value;

  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  const withCountryCode = digits.length === 10 ? `91${digits}` : digits;
  return `${withCountryCode}@c.us`;
};

const whatsappWebsiteSessions = new Map();
const whatsappWebsiteAutoReplyOnly = !["0", "false", "no"].includes(
  String(process.env.WHATSAPP_WEBSITE_AUTO_REPLY_ONLY || "true")
    .trim()
    .toLowerCase(),
);
const whatsappWebsiteSessionTtlSeconds = Number(
  process.env.WHATSAPP_WEBSITE_SESSION_TTL_SECONDS || 86400,
);
const whatsappWebsiteSessionTtlMs = Math.max(
  300,
  Number.isFinite(whatsappWebsiteSessionTtlSeconds)
    ? whatsappWebsiteSessionTtlSeconds
    : 86400,
) * 1000;
const whatsappManualTakeoverTtlSeconds = Number(
  process.env.WHATSAPP_MANUAL_TAKEOVER_TTL_SECONDS ||
    process.env.WHATSAPP_WEBSITE_SESSION_TTL_SECONDS ||
    86400,
);
const whatsappManualTakeoverTtlMs = Math.max(
  300,
  Number.isFinite(whatsappManualTakeoverTtlSeconds)
    ? whatsappManualTakeoverTtlSeconds
    : 86400,
) * 1000;
const whatsappManualPausedSessions = new Map();
const whatsappReplyMode = ["manual", "draft"].includes(
  String(process.env.WHATSAPP_REPLY_MODE || "auto").trim().toLowerCase(),
)
  ? "manual"
  : "auto";

const pruneWhatsAppSessionMap = (sessions, ttlMs) => {
  const now = Date.now();
  for (const [key, seenAt] of sessions.entries()) {
    if (now - seenAt > ttlMs) sessions.delete(key);
  }
};

const rememberWebsiteWhatsAppSession = (phoneOrChatId) => {
  const chatId = normalizeIndianChatId(phoneOrChatId);
  if (chatId) whatsappWebsiteSessions.set(chatId, Date.now());
};

const forgetWebsiteWhatsAppSession = (phoneOrChatId) => {
  const chatId = normalizeIndianChatId(phoneOrChatId);
  if (chatId) whatsappWebsiteSessions.delete(chatId);
};

const hasRecentWebsiteWhatsAppSession = (chatId) => {
  pruneWhatsAppSessionMap(whatsappWebsiteSessions, whatsappWebsiteSessionTtlMs);

  const seenAt = whatsappWebsiteSessions.get(chatId);
  return Boolean(seenAt && Date.now() - seenAt <= whatsappWebsiteSessionTtlMs);
};

const pauseWhatsAppAutoReplyForManualTakeover = (phoneOrChatId) => {
  const chatId = normalizeIndianChatId(phoneOrChatId);
  if (!chatId) return "";
  whatsappManualPausedSessions.set(chatId, Date.now());
  forgetWebsiteWhatsAppSession(chatId);
  return chatId;
};

const isWhatsAppAutoReplyPaused = (phoneOrChatId) => {
  const chatId = normalizeIndianChatId(phoneOrChatId);
  if (!chatId) return false;
  pruneWhatsAppSessionMap(whatsappManualPausedSessions, whatsappManualTakeoverTtlMs);

  const pausedAt = whatsappManualPausedSessions.get(chatId);
  return Boolean(pausedAt && Date.now() - pausedAt <= whatsappManualTakeoverTtlMs);
};

const isWebsiteOriginWhatsAppMessage = (payload, message) => {
  const senderData = payload?.senderData || {};
  const messageData = payload?.messageData || {};
  const haystack = [
    payload?.source,
    payload?.origin,
    payload?.mode,
    payload?.referrer,
    payload?.utm_source,
    senderData.source,
    senderData.origin,
    messageData.source,
    message,
  ]
    .map((value) => String(value || "").toLowerCase())
    .join(" ");

  return [
    "website",
    "vibha-prints-website",
    "vibhaprints.com",
    "vibha prints website",
    "vibha art website",
    "website chat",
    "sent from vibha art website",
    "contacting you from your website",
    "from your website",
  ].some((marker) => haystack.includes(marker));
};

const getGreenApiConfig = () => {
  const instanceId = process.env.GREEN_API_INSTANCE_ID || "";
  const token = process.env.GREEN_API_TOKEN || process.env.GREEN_API_TOKEN_INSTANCE || "";
  const baseUrl = process.env.GREEN_API_BASE_URL || "https://api.green-api.com";

  if (!instanceId || !token) {
    throw new Error("GREEN_API_INSTANCE_ID and GREEN_API_TOKEN are required");
  }

  return { instanceId, token, baseUrl: baseUrl.replace(/\/$/, "") };
};

const sendGreenApiMessage = async ({ chatId, phone, message }) => {
  const { instanceId, token, baseUrl } = getGreenApiConfig();
  const resolvedChatId = normalizeIndianChatId(chatId || phone);

  if (!resolvedChatId || !message) {
    throw new Error("chatId/phone and message are required");
  }

  const response = await fetch(
    `${baseUrl}/waInstance${instanceId}/sendMessage/${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatId: resolvedChatId,
        message,
      }),
    },
  );

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || data?.error || "GREEN-API sendMessage failed");
  }

  return data;
};

const extractGreenApiText = (payload) => {
  const messageData = payload?.messageData || {};
  const typeMessage = messageData.typeMessage;

  if (typeMessage === "textMessage") {
    return messageData.textMessageData?.textMessage || "";
  }

  if (typeMessage === "extendedTextMessage") {
    return messageData.extendedTextMessageData?.text || "";
  }

  return "";
};

const extractGreenApiChatId = (payload) => (
  payload?.senderData?.chatId ||
  payload?.chatId ||
  payload?.messageData?.chatId ||
  payload?.recipientData?.chatId ||
  ""
);

const isManualOutgoingGreenApiWebhook = (payload) => {
  const typeWebhook = String(payload?.typeWebhook || "");
  if (!typeWebhook || typeWebhook.toLowerCase().includes("api")) return false;
  return typeWebhook === "outgoingMessageReceived";
};

const generateGeminiReply = async ({ message, senderName }) => {
  const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY || "";
  const configuredModels = (
    process.env.GOOGLE_AI_MODEL ||
    process.env.GEMINI_MODEL ||
    "gemini-2.5-flash,gemini-2.0-flash,gemini-2.0-flash-lite"
  )
    .split(",")
    .map((model) => model.trim())
    .filter(Boolean);
  const models = [...new Set([...configuredModels, "gemini-2.0-flash", "gemini-2.0-flash-lite"])];

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is required for WhatsApp auto-reply");
  }

  let lastError = null;

  for (const model of models) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: buildSystemPrompt(),
              },
            ],
          },
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Customer name: ${senderName || "Customer"}\nMessage: ${message}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 500,
          },
        }),
      },
    );

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      lastError = new Error(data?.error?.message || `${model} generateContent failed`);
      console.warn(`Gemini model failed (${model}):`, lastError.message);
      continue;
    }

    const text = data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim();

    if (text) return text;

    lastError = new Error(`${model} returned an empty response`);
  }

  throw lastError || new Error("Gemini generateContent failed");
};

const handleGreenApiAutoReply = async (payload) => {
  if ((process.env.WHATSAPP_AUTO_REPLY_ENABLED || "true").toLowerCase() === "false") {
    return;
  }

  if (isManualOutgoingGreenApiWebhook(payload)) {
    const pausedChatId = pauseWhatsAppAutoReplyForManualTakeover(extractGreenApiChatId(payload));
    if (pausedChatId) {
      console.log(
        "WhatsApp auto-reply paused: manual takeover",
        JSON.stringify({ chatId: pausedChatId }),
      );
    }
    return;
  }

  if (payload?.typeWebhook !== "incomingMessageReceived") {
    return;
  }

  const chatId = extractGreenApiChatId(payload);
  const senderName =
    payload?.senderData?.senderContactName ||
    payload?.senderData?.senderName ||
    payload?.senderData?.chatName ||
    "";
  const message = extractGreenApiText(payload).trim();

  if (!chatId || !message) {
    console.log("WhatsApp auto-reply skipped: missing chatId or text message");
    return;
  }

  if (isWhatsAppAutoReplyPaused(chatId)) {
    console.log(
      "WhatsApp auto-reply skipped: manual takeover active",
      JSON.stringify({ chatId, inbound: message }),
    );
    return;
  }

  const isWebsiteOrigin =
    hasRecentWebsiteWhatsAppSession(chatId) ||
    isWebsiteOriginWhatsAppMessage(payload, message);

  if (whatsappWebsiteAutoReplyOnly && !isWebsiteOrigin) {
    console.log(
      "WhatsApp auto-reply skipped: not website-origin",
      JSON.stringify({ chatId, inbound: message }),
    );
    return;
  }

  if (isWebsiteOrigin) {
    rememberWebsiteWhatsAppSession(chatId);
  }

  const reply = await generateGeminiReply({ message, senderName });
  if (whatsappReplyMode === "manual") {
    console.log(
      "WhatsApp auto-reply drafted:",
      JSON.stringify({ chatId, inbound: message, reply }),
    );
    return;
  }

  const result = await sendGreenApiMessage({ chatId, message: reply });

  console.log(
    "WhatsApp auto-reply sent:",
    JSON.stringify({ chatId, inbound: message, reply, result }),
  );
};

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Store active chat sessions
const activeSessions = {};

// Predefined bot responses
const botResponses = {
  greeting: [
    "Hello! Welcome to Vibha Art. How can I help you today?",
    "Hi there! I'm Vibha's virtual assistant. What can I do for you?",
    "Welcome to Vibha Art! I'm here to assist you with any questions about our services."
  ],
  services: [
    "We offer a range of graphic design and printing services including:\n\n• Logo Design\n• Business Cards\n• Brochures & Booklets\n• Packaging Design\n• Brand Identity\n\nWould you like to know more about any specific service?"
  ],
  logo: [
    "Our logo design services include concept development, multiple revisions, and delivery in all necessary formats. We focus on creating unique, memorable logos that represent your brand identity. Would you like to see some examples of our work?"
  ],
  business_cards: [
    "We create professional business card designs with options for various printing finishes including matte, glossy, and specialty papers. Would you like to discuss your business card requirements?"
  ],
  brochures: [
    "Our brochure and booklet design services include layout design, content organization, and print preparation. We can create anything from simple tri-fold brochures to elaborate multi-page booklets. What kind of brochure are you looking for?"
  ],
  packaging: [
    "Our packaging design services help your products stand out on the shelf. We create designs for boxes, labels, bags, and other packaging materials. Would you like to discuss your packaging design needs?"
  ],
  contact: [
    "You can reach us at info@vibhaprints.com, call or WhatsApp us at +91 86249 48046, or visit https://www.vibhaprints.com/. Would you like us to contact you instead? I can take your details right now."
  ],
  pricing: [
    "Our pricing varies based on the specific requirements of your project. Here's a general range:\n\n• Logo Design: ₹5,000 - ₹15,000\n• Business Cards: ₹2,000 - ₹5,000\n• Brochures: ₹3,000 - ₹10,000\n\nWould you like to get a custom quote for your project?"
  ],
  turnaround: [
    "Our typical turnaround times are:\n\n• Logo Design: 3-5 business days\n• Business Cards: 2-3 business days\n• Brochures: 3-7 business days\n• Complex Projects: 1-2 weeks\n\nWould you like to discuss your specific timeline?"
  ],
  portfolio: [
    "You can view our portfolio on our website. We have dedicated galleries for logo design, business cards, brochures, and packaging design. Would you like me to direct you to a specific section?"
  ],
  process: [
    "Our design process typically includes:\n\n1. Initial consultation\n2. Research & concept development\n3. Design presentation\n4. Revisions based on feedback\n5. Final delivery\n\nWould you like more details about any of these steps?"
  ],
  default: [
    "Is baare mein main sure nahi hoon - aap seedha WhatsApp karein: +91 86249 48046, team turant help karegi."
  ]
};

// Keywords to match user queries
const keywords = {
  greeting: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'],
  services: ['service', 'offer', 'provide', 'design', 'print', 'what do you do'],
  logo: ['logo', 'brand mark', 'symbol', 'company logo', 'logo design'],
  business_cards: ['business card', 'visiting card', 'name card', 'contact card'],
  brochures: ['brochure', 'booklet', 'pamphlet', 'leaflet', 'catalog', 'flyer'],
  packaging: ['packaging', 'package', 'box', 'label', 'product packaging'],
  contact: ['contact', 'email', 'phone', 'call', 'reach', 'talk', 'connect'],
  pricing: ['price', 'cost', 'rate', 'fee', 'charge', 'quote', 'estimate', 'how much'],
  turnaround: ['time', 'long', 'fast', 'quick', 'turnaround', 'deadline', 'when', 'how soon'],
  portfolio: ['portfolio', 'examples', 'samples', 'work', 'previous', 'projects'],
  process: ['process', 'how does it work', 'steps', 'procedure', 'how do you', 'workflow']
};

// Function to get a random response from an array
const getRandomResponse = (responses) => {
  return responses[Math.floor(Math.random() * responses.length)];
};

// Function to determine the bot's response based on user input
const getBotResponse = (message) => {
  const lowerMessage = message.toLowerCase();

  // Check for keywords in the message
  for (const [category, categoryKeywords] of Object.entries(keywords)) {
    if (categoryKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return getRandomResponse(botResponses[category]);
    }
  }

  // If no keywords match, return a default response
  return getRandomResponse(botResponses.default);
};

// ─── Supabase Helper Functions ───────────────────────────────────────────────

const normalizeGroqMessages = (messages = []) => {
  if (!Array.isArray(messages)) return [];

  return messages
    .map((message) => {
      if (message?.role && message?.content) {
        return {
          role: message.role === "assistant" ? "assistant" : "user",
          content: String(message.content),
        };
      }

      if (message?.sender && message?.text) {
        return {
          role: message.sender === "bot" ? "assistant" : "user",
          content: String(message.text),
        };
      }

      return null;
    })
    .filter(Boolean)
    .slice(-12);
};

const buildGeminiContents = (historyMessages = [], currentInput = "") => {
  const contents = [];

  for (const msg of historyMessages) {
    const role = msg.role === "assistant" ? "model" : "user";
    if (contents.length > 0 && contents[contents.length - 1].role === role) {
      contents.pop();
    }
    contents.push({
      role,
      parts: [{ text: msg.content }],
    });
  }

  if (currentInput) {
    if (contents.length > 0 && contents[contents.length - 1].role === "user") {
      contents.pop();
    }
    contents.push({
      role: "user",
      parts: [{ text: currentInput }],
    });
  }

  return contents.slice(-24);
};

const callGeminiChat = async (input, requestedModel, conversationHistory = []) => {
  const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY || "";
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const configuredModels = (requestedModel ||
    process.env.GEMINI_MODEL ||
    "gemini-2.0-flash,gemini-2.0-flash-lite,gemini-1.5-flash")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);

  const models = [...new Set([...configuredModels, "gemini-2.0-flash-lite", "gemini-1.5-flash"])];

  const historyMessages = normalizeGroqMessages(conversationHistory);
  const contents = buildGeminiContents(historyMessages, input);

  let lastError = null;

  for (const model of models) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: buildSystemPrompt() }],
          },
          contents,
          generationConfig: {
            temperature: 0.45,
            maxOutputTokens: 350,
          },
        }),
      },
    );

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      lastError = new Error(data?.error?.message || `${model} generateContent failed`);
      console.warn(`Gemini model failed (${model}):`, lastError.message);
      continue;
    }

    const text = data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim();

    if (text) return { text };

    lastError = new Error(`${model} returned an empty response`);
  }

  throw lastError || new Error("Gemini generateContent failed");
};

const createChatSession = async (socketId) => {
  if (!supabase) return;

  try {
    const { error } = await supabase.from('chat_sessions').insert({
      socket_id: socketId,
      messages: [],
      last_activity: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    if (error) console.error('Supabase createChatSession error:', error.message);
  } catch (err) {
    console.error('createChatSession failed:', err.message);
  }
};

const updateChatMessages = async (socketId, messages) => {
  if (!supabase) return;

  try {
    const { error } = await supabase
      .from('chat_sessions')
      .update({
        messages: messages,
        last_activity: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('socket_id', socketId);
    if (error) console.error('Supabase updateChatMessages error:', error.message);
  } catch (err) {
    console.error('updateChatMessages failed:', err.message);
  }
};

const updateUserDetails = async (socketId, name, email, phone, messages) => {
  if (!supabase) return;

  try {
    const { error } = await supabase
      .from('chat_sessions')
      .update({
        user_name: name,
        user_email: email,
        user_phone: phone,
        messages: messages,
        last_activity: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('socket_id', socketId);
    if (error) console.error('Supabase updateUserDetails error:', error.message);
  } catch (err) {
    console.error('updateUserDetails failed:', err.message);
  }
};

// ─────────────────────────────────────────────────────────────────────────────

// Socket.io connection handler
io.on('connection', async (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Create a new session for this user
  activeSessions[socket.id] = {
    messages: [],
    lastActivity: Date.now()
  };

  await createChatSession(socket.id);

  // Handle request_greeting event
  socket.on('request_greeting', () => {
    console.log(`Greeting requested by ${socket.id}`);
    sendGreeting(socket);
  });

  // Send initial greeting
  function sendGreeting(socket) {
    console.log(`Sending greeting to ${socket.id}`);
    const greeting = getRandomResponse(botResponses.greeting);
    const botMessage = {
      id: activeSessions[socket.id].messages.length + 1,
      text: greeting,
      sender: 'bot',
      timestamp: new Date()
    };

    // Store message in session
    activeSessions[socket.id].messages.push(botMessage);
    activeSessions[socket.id].lastActivity = Date.now();

    // Send to client
    socket.emit('receive_message', botMessage);
  }

  // Send greeting after a short delay
  setTimeout(() => {
    sendGreeting(socket);
  }, 1000);

  // Handle incoming messages
  socket.on('send_message', (data) => {
    console.log(`Message from ${socket.id}: ${data.message}`);

    // Store user message
    const userMessage = {
      id: activeSessions[socket.id].messages.length + 1,
      text: data.message,
      sender: 'user',
      timestamp: new Date()
    };

    activeSessions[socket.id].messages.push(userMessage);
    activeSessions[socket.id].lastActivity = Date.now();

    // Log the current session state
    console.log(`Session ${socket.id} now has ${activeSessions[socket.id].messages.length} messages`);

    // Simulate typing
    console.log(`Sending typing indicator to ${socket.id}`);
    socket.emit('bot_typing', true);

    // Generate bot response with delay
    setTimeout(async () => {
      console.log(`Generating response for ${socket.id}`);
      let botResponse = "";
      try {
        const geminiReply = await callGeminiChat(
          data.message,
          undefined,
          activeSessions[socket.id].messages,
        );
        botResponse = geminiReply.text;
      } catch (error) {
        console.warn("Gemini socket reply unavailable, using local response:", error.message);
        botResponse = getBotResponse(data.message);
      }

      const botMessage = {
        id: activeSessions[socket.id].messages.length + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      // Store bot message
      activeSessions[socket.id].messages.push(botMessage);
      activeSessions[socket.id].lastActivity = Date.now();

      // Send to client
      console.log(`Sending response to ${socket.id}:`, botMessage);
      socket.emit('bot_typing', false);
      socket.emit('receive_message', botMessage);

      await updateChatMessages(socket.id, activeSessions[socket.id].messages);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  });

  // Handle contact form submissions
  socket.on('submit_contact_form', (formData) => {
    console.log(`Contact form from ${socket.id}:`, formData);

    // Simulate processing delay
    setTimeout(async () => {
      try {
        await sendContactAutomationEmails({
          name: formData.name,
          email: formData.email,
          mobile: formData.phone,
          message: formData.message || "Chat widget contact request",
          source: "chat-widget",
        });
      } catch (error) {
        console.error("Chat contact email automation failed:", error);
      }

      // Send success response
      socket.emit('form_submission_response', {
        success: true,
        message: "Form submitted successfully"
      });

      // Send confirmation message
      const botMessage = {
        id: activeSessions[socket.id].messages.length + 1,
        text: `Thank you, ${formData.name}! Your contact information has been submitted. Our team will get in touch with you soon at ${formData.email} or ${formData.phone}.`,
        sender: 'bot',
        timestamp: new Date()
      };

      // Store bot message
      activeSessions[socket.id].messages.push(botMessage);
      activeSessions[socket.id].lastActivity = Date.now();

      // Send to client
      socket.emit('receive_message', botMessage);

      await updateUserDetails(
        socket.id,
        formData.name,
        formData.email,
        formData.phone,
        activeSessions[socket.id].messages
      );
    }, 1500);
  });

  // Handle disconnection
  socket.on('disconnect', async () => {
    console.log(`User disconnected: ${socket.id}`);

    if (activeSessions[socket.id]) {
      await updateChatMessages(socket.id, activeSessions[socket.id].messages);
    }

    // Clean up session data
    delete activeSessions[socket.id];
  });
});

// Clean up inactive sessions periodically (every hour)
setInterval(() => {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;

  Object.keys(activeSessions).forEach(sessionId => {
    if (now - activeSessions[sessionId].lastActivity > oneHour) {
      console.log(`Cleaning up inactive session: ${sessionId}`);
      delete activeSessions[sessionId];
    }
  });
}, 60 * 60 * 1000);

// Basic route for health check
app.get('/', (req, res) => {
  res.send('Vibha Art Chat Server is running');
});

app.post("/api/groq/chat", async (req, res) => {
  try {
    const input = req.body?.input || req.body?.message || "";
    if (!input) {
      return res.json({
        success: false,
        reply: "Namaste! Aapko kis type ki help chahiye?",
      });
    }

    const result = await callGeminiChat(
      input,
      req.body?.model,
      req.body?.messages || req.body?.conversationHistory || [],
    );

    return res.json({
      success: true,
      reply: result.text,
      text: result.text,
    });
  } catch (error) {
    console.error("Gemini chat request failed:", error);
    return res.status(500).json({
      success: false,
      reply: "Is baare mein main sure nahi hoon - aap seedha WhatsApp karein: +91 86249 48046, team turant help karegi.",
      message: "Failed to call Gemini",
    });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body?.message || "";
    const messages = req.body?.messages || [];
    const sessionId = req.body?.session_id || "";

    if (!message && messages.length === 0) {
      return res.json({
        success: false,
        reply: "Namaste! Aapko printing, branding, website ya digital marketing me kis type ki help chahiye?",
      });
    }

    const lastUserMessage = message || (
      [...messages].reverse().find((m) => m.role === "user")?.content || ""
    );

    const result = await callGeminiChat(
      lastUserMessage,
      req.body?.model,
      messages,
    );

    return res.json({
      success: true,
      reply: result.text,
      session_id: sessionId,
    });
  } catch (error) {
    console.error("Chat API request failed:", error);
    return res.json({
      success: false,
      reply: "Is baare mein main sure nahi hoon - aap seedha WhatsApp karein: +91 86249 48046, team turant help karegi.",
    });
  }
});

app.post("/api/create-lead", async (req, res) => {
  try {
    const { name, email, phone, mobile, message, source } = req.body || {};
    const phoneNumber = phone || mobile || "";
    const leadMessage = message || "Chat widget contact request";

    if (!name || !email || !phoneNumber) {
      return res.json({ success: false, message: "Name, email, and phone are required" });
    }

    try {
      await sendContactAutomationEmails({
        name,
        email,
        mobile: phoneNumber,
        message: leadMessage,
        source: source || "vibha-prints-website",
      });
    } catch (emailError) {
      console.error("Lead email failed:", emailError.message);
    }

    return res.json({ success: true, ok: true, message: "Form submitted successfully" });
  } catch (error) {
    console.error("Create lead failed:", error);
    return res.json({ success: true, ok: true, message: "Form captured" });
  }
});

app.post("/api/leads/brochure-notify", async (req, res) => {
  try {
    const expectedApiKey = process.env.BROCHURE_NOTIFY_API_KEY || "";
    const requestApiKey = req.headers["x-api-key"];
    if (expectedApiKey && requestApiKey !== expectedApiKey) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { name, email, phone, company = "", brochure_name, source } = req.body || {};
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "name, email and phone are required",
      });
    }

    const result = await sendBrochureAutomationEmails({
      name,
      email,
      phone,
      company,
      brochure_name,
      source,
    });

    return res.json({ success: true, ...result });
  } catch (error) {
    console.error("Brochure mail notification failed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send brochure notification",
    });
  }
});

app.post("/api/leads/contact-notify", async (req, res) => {
  try {
    const expectedApiKey = process.env.CONTACT_NOTIFY_API_KEY || "";
    const requestApiKey = req.headers["x-api-key"];
    if (expectedApiKey && requestApiKey !== expectedApiKey) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { name, email, mobile, message = "", source } = req.body || {};
    if (!name || !email || !mobile) {
      return res.status(400).json({
        success: false,
        message: "name, email and mobile are required",
      });
    }

    const result = await sendContactAutomationEmails({
      name,
      email,
      mobile,
      message,
      source,
    });

    return res.json({ success: true, ...result });
  } catch (error) {
    console.error("Contact mail notification failed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send contact notification",
    });
  }
});

app.post("/api/whatsapp/send", async (req, res) => {
  try {
    const expectedApiKey = process.env.WHATSAPP_NOTIFY_API_KEY || "";
    const requestApiKey = req.headers["x-api-key"];
    if (expectedApiKey && requestApiKey !== expectedApiKey) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { chatId, phone, message } = req.body || {};
    const result = await sendGreenApiMessage({ chatId, phone, message });

    return res.json({
      success: true,
      chatId: normalizeIndianChatId(chatId || phone),
      result,
    });
  } catch (error) {
    console.error("WhatsApp send failed:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send WhatsApp message",
    });
  }
});

app.post(["/webhook", "/api/green-api/webhook"], async (req, res) => {
  const payload = req.body || {};
  console.log("GREEN-API webhook:", JSON.stringify(payload));

  res.json({
    success: true,
    received: true,
  });

  handleGreenApiAutoReply(payload).catch((error) => {
    console.error("WhatsApp auto-reply failed:", error);
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to check server status`);
  console.log(`WebSocket server is ready for connections`);
});
