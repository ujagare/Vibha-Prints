const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(cors());
const server = http.createServer(app);

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

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Create a new session for this user
  activeSessions[socket.id] = {
    messages: [],
    lastActivity: Date.now()
  };

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
    setTimeout(() => {
      console.log(`Generating response for ${socket.id}`);
      const botResponse = getBotResponse(data.message);

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
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  });

  // Handle contact form submissions
  socket.on('submit_contact_form', (formData) => {
    console.log(`Contact form from ${socket.id}:`, formData);

    // In a real implementation, you would save this to a database
    // and potentially send an email notification

    // Simulate processing delay
    setTimeout(() => {
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
    }, 1500);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);

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

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to check server status`);
  console.log(`WebSocket server is ready for connections`);
});
