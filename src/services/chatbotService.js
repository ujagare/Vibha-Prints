/**
 * Chatbot Service
 *
 * This service handles the backend functionality for the chatbot,
 * including message processing, form submissions, analytics, and WhatsApp integration.
 */

// Function to submit contact form data to backend
export const submitContactForm = async (formData) => {
  try {
    // In a production environment, this would be an actual API call
    // For now, we'll simulate a successful submission

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate successful response
    return {
      success: true,
      message: "Form submitted successfully"
    };

    // Example of actual API call:
    /*
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
    */
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return {
      success: false,
      message: "Failed to submit form. Please try again later."
    };
  }
};

// Function to log chat interactions for analytics
export const logChatInteraction = async (interaction) => {
  try {
    // In a production environment, this would log to an analytics service
    console.log('Chat interaction:', interaction);

    // Example of actual analytics logging:
    /*
    await fetch('/api/analytics/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        ...interaction
      }),
    });
    */

    return true;
  } catch (error) {
    console.error('Error logging chat interaction:', error);
    return false;
  }
};

// Function to get chat history for a user (if authentication is implemented)
export const getChatHistory = async (userId) => {
  try {
    // In a production environment, this would fetch chat history from a database
    // For now, we'll return an empty array

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simulate empty history
    return [];

    // Example of actual API call:
    /*
    const response = await fetch(`/api/chat/history/${userId}`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
    */
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }
};

// Function to save chat transcript
export const saveChatTranscript = async (messages, userEmail) => {
  try {
    // In a production environment, this would save the transcript to a database
    // and potentially email it to the user

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate successful response
    return {
      success: true,
      message: "Chat transcript saved successfully"
    };

    // Example of actual API call:
    /*
    const response = await fetch('/api/chat/transcript', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        userEmail,
        timestamp: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
    */
  } catch (error) {
    console.error('Error saving chat transcript:', error);
    return {
      success: false,
      message: "Failed to save chat transcript. Please try again later."
    };
  }
};

/**
 * Generate a WhatsApp chat link with pre-filled message
 * @param {string} phoneNumber - WhatsApp phone number (with country code, no spaces or special chars)
 * @param {string} message - Pre-filled message
 * @returns {string} - WhatsApp chat link
 */
export const generateWhatsAppLink = (phoneNumber, message = '') => {
  // Remove any non-numeric characters from the phone number
  const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');

  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message);

  // Generate the WhatsApp link
  return `https://wa.me/${cleanPhoneNumber}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
};

/**
 * Forward chat conversation to WhatsApp
 * @param {Array} messages - Array of chat messages
 * @param {string} phoneNumber - WhatsApp phone number to forward to
 * @returns {string} - WhatsApp link with conversation
 */
export const forwardToWhatsApp = (messages, phoneNumber = '918625948046') => {
  // Format the conversation for WhatsApp
  let formattedConversation = "Chat Conversation from Website:\n\n";

  messages.forEach(msg => {
    const time = new Date(msg.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    formattedConversation += `[${time}] ${msg.sender === 'user' ? 'Visitor' : 'Bot'}: ${msg.text}\n`;
  });

  // Add a footer
  formattedConversation += "\n\nSent from Vibha Art Website Chat";

  // Generate and return the WhatsApp link
  return generateWhatsAppLink(phoneNumber, formattedConversation);
};

/**
 * Create a direct WhatsApp chat link
 * @param {Object} userInfo - User information (name, email, etc.)
 * @param {string} query - User's initial query or message
 * @returns {string} - WhatsApp chat link
 */
export const createDirectWhatsAppChat = (userInfo = {}, query = '') => {
  const { name, email, phone } = userInfo;

  // Create a formatted message
  let message = "Hello! I'm contacting you from your website.";

  // Add user info if available
  if (name) message += `\nName: ${name}`;
  if (email) message += `\nEmail: ${email}`;
  if (phone) message += `\nPhone: ${phone}`;

  // Add the query if provided
  if (query) message += `\n\nMy query: ${query}`;

  // Generate and return the WhatsApp link
  return generateWhatsAppLink('918625948046', message);
};
