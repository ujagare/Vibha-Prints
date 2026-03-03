/**
 * Fallback Chat Service
 * 
 * This service provides a fallback implementation for the chatbot
 * when Socket.io connection fails.
 */

// Predefined responses for the chatbot
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
    "You can reach us at vibhart07@gmail.com or call us at +91 86259 48046. Would you like us to contact you instead? I can take your details right now."
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
    "I'm not sure I understand. Could you please rephrase your question or select from one of these common topics: services, pricing, contact information, or turnaround time?",
    "I didn't quite catch that. Can you try asking in a different way or let me know if you need information about our design services, pricing, or how to contact us?",
    "I'm still learning! Could you please clarify what you're looking for? You can ask about our design services, printing options, or how to get in touch with our team."
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
export const getBotResponse = (message) => {
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

// Function to simulate a bot response with a delay
export const getDelayedBotResponse = (message) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const response = getBotResponse(message);
      resolve(response);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  });
};

// Function to simulate form submission
export const submitContactForm = async (formData) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate successful response
  return {
    success: true,
    message: "Form submitted successfully"
  };
};

// Function to log chat interactions (dummy implementation)
export const logChatInteraction = (data) => {
  console.log("Chat interaction logged:", data);
  return true;
};
