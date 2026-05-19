import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";

const BROCHURE_NOTIFY_API_URL =
  import.meta.env.VITE_BROCHURE_NOTIFY_API_URL || "";
const BROCHURE_NOTIFY_API_KEY =
  import.meta.env.VITE_BROCHURE_NOTIFY_API_KEY || "";
const CONTACT_NOTIFY_API_URL =
  import.meta.env.VITE_CONTACT_NOTIFY_API_URL || "";
const CONTACT_NOTIFY_API_KEY =
  import.meta.env.VITE_CONTACT_NOTIFY_API_KEY || "";

const assertSupabase = () => {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured.");
  }
};

const postLeadNotification = async (url, payload, apiKey = "") => {
  const headers = { "Content-Type": "application/json" };
  const shouldSendApiKey = apiKey && !url.includes("/api/create-lead");
  if (shouldSendApiKey) {
    headers["x-api-key"] = apiKey;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Notification API failed with status ${response.status}`);
  }
};

export const submitContactLead = async ({
  name,
  email,
  mobile,
  message,
  source = "website-contact-form",
}) => {
  const leadPayload = {
    name,
    email,
    mobile,
    message,
    source,
  };
  const notifyPayload = {
    ...leadPayload,
    phone: mobile || "",
    lead_type: "contact",
  };

  let supabaseSaved = false;
  let supabaseError = null;

  try {
    assertSupabase();
    const { error } = await supabase.from("contact_leads").insert(leadPayload);
    if (error) throw error;
    supabaseSaved = true;
  } catch (error) {
    supabaseError = error;
    console.error("Contact lead save failed:", error);
  }

  if (CONTACT_NOTIFY_API_URL) {
    try {
      await postLeadNotification(
        CONTACT_NOTIFY_API_URL,
        notifyPayload,
        CONTACT_NOTIFY_API_KEY,
      );
      return true;
    } catch (notifyError) {
      console.error("Contact lead notification failed:", notifyError);
    }
  }

  if (supabaseSaved) return true;
  if (supabaseError) throw supabaseError;
  throw new Error("Contact submit is not configured.");
};

export const submitBrochureLead = async ({
  name,
  email,
  phone,
  company = "",
  brochure_name = "Vibha_Printing Media",
  source = "hero-brochure-modal",
}) => {
  assertSupabase();

  const leadPayload = {
    name,
    email,
    phone,
    company,
    brochure_name,
    source,
  };
  const notifyPayload = {
    ...leadPayload,
    lead_type: "brochure",
  };

  const { error } = await supabase.from("brochure_download_leads").insert(
    leadPayload,
  );

  if (error) throw error;

  if (BROCHURE_NOTIFY_API_URL) {
    try {
      await postLeadNotification(
        BROCHURE_NOTIFY_API_URL,
        notifyPayload,
        BROCHURE_NOTIFY_API_KEY,
      );
    } catch (notifyError) {
      console.error("Brochure lead notification failed:", notifyError);
    }
  }

  return true;
};
