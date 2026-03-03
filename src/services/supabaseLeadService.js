import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";

const assertSupabase = () => {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured.");
  }
};

export const submitContactLead = async ({
  name,
  email,
  mobile,
  message,
  source = "website-contact-form",
}) => {
  assertSupabase();

  const { error } = await supabase.from("contact_leads").insert({
    name,
    email,
    mobile,
    message,
    source,
  });

  if (error) throw error;
  return true;
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

  const { error } = await supabase.from("brochure_download_leads").insert({
    name,
    email,
    phone,
    company,
    brochure_name,
    source,
  });

  if (error) throw error;
  return true;
};

