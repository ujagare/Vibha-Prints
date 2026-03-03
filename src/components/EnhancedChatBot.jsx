import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import io from "socket.io-client";
import {
  FaComments,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
  FaArrowRight,
  FaCheck,
  FaSync,
} from "react-icons/fa";
import {
  logChatInteraction,
  forwardToWhatsApp,
  createDirectWhatsAppChat,
} from "../services/chatbotService";
import {
  getDelayedBotResponse,
  submitContactForm as fallbackSubmitForm,
} from "../services/fallbackChatService";
import WhatsAppModal from "./WhatsAppModal";

// Socket.io connection will be created inside the component
// This allows us to better manage the socket lifecycle and handle errors

// Create a dummy socket object that will be replaced with a real one if connection succeeds
let dummySocket = {
  on: () => {},
  off: () => {},
  once: () => {},
  emit: () => {},
  connected: false,
};

// We'll use this as a fallback when socket connection fails
const createSocket = () => {
  try {
    const newSocket = io.connect("http://localhost:3001", {
      reconnection: false, // Disable reconnection to avoid repeated errors
      reconnectionAttempts: 1,
      reconnectionDelay: 1000,
      timeout: 2000, // Reduced timeout
      transports: ["websocket", "polling"],
      autoConnect: false, // Don't auto connect
    });

    return newSocket;
  } catch (error) {
    console.warn("Socket server not available, using fallback mode");
    return dummySocket;
  }
};

// Bot responses are now handled by the fallback service

// Keywords are now handled by the fallback service

// Random responses are now handled by the fallback service

// We're now using the fallback service for bot responses

// Quick reply options
const quickReplies = [
  { id: 1, text: "What services do you offer?" },
  { id: 2, text: "How can I contact you?" },
  { id: 3, text: "What are your prices?" },
  { id: 4, text: "How long does it take?" },
  { id: 5, text: "Can I see your portfolio?" },
  { id: 6, text: "Connect me on WhatsApp" },
];

const EnhancedChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  // WhatsApp options are now handled directly
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [whatsAppMessage, setWhatsAppMessage] = useState("");
  // Socket connection state
  const [socketConnected, setSocketConnected] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [isInFallbackMode, setIsInFallbackMode] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Initialize socket connection
  useEffect(() => {
    // Only initialize socket when chat is opened
    if (!isOpen) return;

    // Start in fallback mode immediately to avoid connection errors
    console.log("Starting chatbot in fallback mode");
    setIsInFallbackMode(true);
    setSocketConnected(false);

    // Add initial greeting in fallback mode
    if (messages.length === 0) {
      setTimeout(() => {
        const greeting = {
          id: Date.now(),
          text: "Hello! Welcome to Vibha Art. How can I assist you today?",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages([greeting]);
      }, 1000);
    }

    // Optional: Try to connect to socket server in background (without showing errors)
    try {
      socketRef.current = createSocket();

      // Try to connect silently
      socketRef.current.connect();

      // Set up connection event handlers (but don't rely on them)
      socketRef.current.on("connect", () => {
        console.log("Socket connected successfully");
        setSocketConnected(true);
        setIsInFallbackMode(false);
      });

      socketRef.current.on("connect_error", () => {
        // Silently handle connection errors
        setSocketConnected(false);
        setIsInFallbackMode(true);
      });

      socketRef.current.on("disconnect", () => {
        setSocketConnected(false);
        setIsInFallbackMode(true);
      });

      // Clean up on unmount
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    } catch (error) {
      // Silently handle initialization errors
      setIsInFallbackMode(true);
    }
  }, [isOpen, messages.length]);

  // Socket.io event handlers (only if socket is connected)
  useEffect(() => {
    if (!socketRef.current || !isOpen || !socketConnected) return;

    console.log("Setting up socket event listeners");

    // Handle bot typing indicator
    const handleBotTyping = (isTyping) => {
      setIsTyping(isTyping);
    };

    // Handle incoming messages from server
    const handleReceiveMessage = (message) => {
      setMessages((prev) => [
        ...prev,
        {
          ...message,
          timestamp: new Date(message.timestamp || Date.now()),
        },
      ]);
      setIsTyping(false);
    };

    // Handle form submission response
    const handleFormSubmissionResponse = (response) => {
      if (!response.success) {
        const botMessage = {
          id: messages.length + 1,
          text: "I'm sorry, there was an error submitting your information. Please try again or contact us directly at vibhart07@gmail.com.",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      }
      setIsTyping(false);
    };

    // Register event listeners
    socketRef.current.on("bot_typing", handleBotTyping);
    socketRef.current.on("receive_message", handleReceiveMessage);
    socketRef.current.on(
      "form_submission_response",
      handleFormSubmissionResponse
    );

    // Send initial greeting request if socket is connected
    if (messages.length === 0 && socketConnected) {
      socketRef.current.emit("request_greeting");
    }

    // Clean up event listeners on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.off("bot_typing", handleBotTyping);
        socketRef.current.off("receive_message", handleReceiveMessage);
        socketRef.current.off(
          "form_submission_response",
          handleFormSubmissionResponse
        );
      }
    };
  }, [messages.length, isOpen, socketConnected]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Log user message
    logChatInteraction({
      type: "user_message",
      message: inputValue,
    });

    setInputValue("");
    setIsTyping(true);

    // Check for WhatsApp trigger
    if (
      inputValue.toLowerCase().includes("whatsapp") ||
      inputValue.toLowerCase().includes("whats app") ||
      inputValue.toLowerCase().includes("what's app") ||
      inputValue.toLowerCase().includes("connect on whatsapp")
    ) {
      // Add user message about WhatsApp
      handleWhatsAppConnect();
      return;
    }

    // Check for contact form trigger
    if (
      inputValue.toLowerCase().includes("contact") ||
      inputValue.toLowerCase().includes("talk to someone") ||
      inputValue.toLowerCase().includes("speak to someone") ||
      inputValue.toLowerCase().includes("get in touch")
    ) {
      setTimeout(() => {
        const botMessage = {
          id: messages.length + 2,
          text: "I'd be happy to connect you with our team. Would you like to fill out a quick contact form?",
          sender: "bot",
          timestamp: new Date(),
          options: [
            { id: "yes-form", text: "Yes, fill out form" },
            { id: "no-form", text: "No, just information" },
          ],
        };

        setMessages((prev) => [...prev, botMessage]);

        // Log bot response with options
        logChatInteraction({
          type: "bot_message",
          message: botMessage.text,
          hasOptions: true,
          userQuery: inputValue,
        });

        setIsTyping(false);
      }, 1000);

      return;
    }

    // If in fallback mode or socket not connected, use fallback immediately
    if (isInFallbackMode || !socketRef.current || !socketConnected) {
      handleFallbackResponse(inputValue);
      return;
    }

    try {
      // Try to send message to socket.io server
      socketRef.current.emit("send_message", { message: inputValue });

      // If no response after 3 seconds, use fallback
      const fallbackTimer = setTimeout(() => {
        console.log("No response from server, using fallback response system");
        handleFallbackResponse(inputValue);
      }, 3000);

      // Clear fallback timer if we get a response from the server
      socketRef.current.once("receive_message", () => {
        clearTimeout(fallbackTimer);
      });
    } catch (error) {
      console.error("Error sending message:", error);
      // Use fallback immediately if there's an error
      handleFallbackResponse(inputValue);
    }
  };

  // Helper function for fallback responses
  const handleFallbackResponse = async (userInput) => {
    try {
      // Get response from fallback service
      const responseText = await getDelayedBotResponse(userInput);

      const botMessage = {
        id: messages.length + 2,
        text: responseText,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);

      // Log bot response
      logChatInteraction({
        type: "bot_message",
        message: responseText,
        userQuery: userInput,
        isFallback: true,
      });
    } catch (fallbackError) {
      console.error("Fallback response error:", fallbackError);

      // Even the fallback failed, show a generic message
      const botMessage = {
        id: messages.length + 2,
        text: "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment or contact us directly at vibhart07@gmail.com.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }
  };

  const handleQuickReply = async (text) => {
    // Check if this is the WhatsApp quick reply
    if (text === "Connect me on WhatsApp") {
      // Add user message
      const userMessage = {
        id: messages.length + 1,
        text: text,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);

      // Log user quick reply
      logChatInteraction({
        type: "user_quick_reply",
        message: text,
        isWhatsAppRequest: true,
      });

      // Call the WhatsApp connect handler
      handleWhatsAppConnect();

      return;
    }

    // Handle regular quick replies
    const userMessage = {
      id: messages.length + 1,
      text: text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Log user quick reply
    logChatInteraction({
      type: "user_quick_reply",
      message: text,
    });

    setIsTyping(true);

    // Always use fallback for quick replies since socket may not be available
    try {
      // Get response from fallback service
      const responseText = await getDelayedBotResponse(text);

      const botMessage = {
        id: messages.length + 2,
        text: responseText,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);

      // Log bot response
      logChatInteraction({
        type: "bot_message",
        message: responseText,
        userQuery: text,
        isFallback: true,
        isQuickReplyResponse: true,
      });
    } catch (error) {
      console.error("Error with fallback response:", error);

      // Show generic error message
      const botMessage = {
        id: messages.length + 2,
        text: "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }
  };

  const handleOptionSelect = (optionId) => {
    if (optionId === "yes-form") {
      setShowContactForm(true);

      // Add user message
      const userMessage = {
        id: messages.length + 1,
        text: "Yes, I'd like to fill out the contact form",
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);

      // Log user option selection
      logChatInteraction({
        type: "user_option_select",
        option: "yes-form",
        message: userMessage.text,
      });

      // Add bot response
      setTimeout(() => {
        const botMessage = {
          id: messages.length + 2,
          text: "Great! Please fill out the form below and our team will get back to you as soon as possible.",
          sender: "bot",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMessage]);

        // Log bot response to option selection
        logChatInteraction({
          type: "bot_message",
          message: botMessage.text,
          responseToOption: "yes-form",
          showingForm: true,
        });
      }, 500);
    } else if (optionId === "no-form") {
      // Add user message
      const userMessage = {
        id: messages.length + 1,
        text: "No, just the contact information please",
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);

      // Log user option selection
      logChatInteraction({
        type: "user_option_select",
        option: "no-form",
        message: userMessage.text,
      });

      setIsTyping(true);

      // Add bot response
      setTimeout(() => {
        const botMessage = {
          id: messages.length + 2,
          text: "No problem! You can reach our team at vibhart07@gmail.com or call us at +91 86259 48046. Our office hours are Monday to Saturday, 10:00 AM to 6:00 PM IST.",
          sender: "bot",
          timestamp: new Date(),
          contactInfo: true,
        };

        setMessages((prev) => [...prev, botMessage]);

        // Log bot response to option selection
        logChatInteraction({
          type: "bot_message",
          message: botMessage.text,
          responseToOption: "no-form",
          providedContactInfo: true,
        });

        setIsTyping(false);
      }, 1000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleContactFormChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!contactForm.name.trim()) {
      errors.name = "Name is required";
    }

    if (!contactForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!contactForm.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(contactForm.phone.replace(/\D/g, ""))) {
      errors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!contactForm.message.trim()) {
      errors.message = "Message is required";
    }

    return errors;
  };

  const handleContactFormSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Show typing indicator
    setIsTyping(true);

    try {
      // Try to submit form data to socket.io server
      socket.emit("submit_contact_form", contactForm);

      // If no response after 3 seconds, use fallback
      const fallbackTimer = setTimeout(async () => {
        console.log("Using fallback form submission");

        try {
          // Submit form using fallback service
          const response = await fallbackSubmitForm(contactForm);

          if (response.success) {
            // Set form as submitted and hide it
            setFormSubmitted(true);
            setShowContactForm(false);

            // Add bot response
            const botMessage = {
              id: messages.length + 1,
              text: `Thank you, ${contactForm.name}! Your contact information has been submitted. Our team will get in touch with you soon at ${contactForm.email} or ${contactForm.phone}.`,
              sender: "bot",
              timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botMessage]);
            setIsTyping(false);
          } else {
            throw new Error("Form submission failed");
          }
        } catch (fallbackError) {
          console.error("Fallback form submission error:", fallbackError);

          // Show error message
          const botMessage = {
            id: messages.length + 1,
            text: "I'm sorry, there was an error submitting your information. Please try again or contact us directly at vibhart07@gmail.com.",
            sender: "bot",
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, botMessage]);
          setIsTyping(false);
        }

        // Reset form
        setContactForm({
          name: "",
          email: "",
          phone: "",
          message: "",
        });

        // Log the interaction
        logChatInteraction({
          type: "form_submission",
          userDetails: {
            name: contactForm.name,
            email: contactForm.email,
            phone: contactForm.phone,
          },
          isFallback: true,
        });
      }, 3000);

      // Clear fallback timer if we get a response from the server
      socket.once("form_submission_response", (response) => {
        clearTimeout(fallbackTimer);

        if (response.success) {
          // Set form as submitted and hide it
          setFormSubmitted(true);
          setShowContactForm(false);

          // Reset form
          setContactForm({
            name: "",
            email: "",
            phone: "",
            message: "",
          });

          // Log the interaction
          logChatInteraction({
            type: "form_submission",
            userDetails: {
              name: contactForm.name,
              email: contactForm.email,
              phone: contactForm.phone,
            },
          });
        }
      });
    } catch (error) {
      console.error("Error submitting form:", error);

      // Show error message
      const botMessage = {
        id: messages.length + 1,
        text: "I'm sorry, there was an error submitting your information. Please try again or contact us directly at vibhart07@gmail.com.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);

      // Reset form
      setContactForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    }
  };

  // Format timestamp
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Handle WhatsApp connection
  const handleWhatsAppConnect = () => {
    // Add bot message about WhatsApp options
    const botMessage = {
      id: messages.length + 1,
      text: "You can connect with us on WhatsApp in the following ways:",
      sender: "bot",
      timestamp: new Date(),
      whatsAppOptions: true,
    };

    setMessages((prev) => [...prev, botMessage]);

    // Log the interaction
    logChatInteraction({
      type: "whatsapp_connect_request",
      timestamp: new Date().toISOString(),
    });
  };

  // Handle direct WhatsApp chat
  const handleDirectWhatsApp = () => {
    // Create a direct WhatsApp chat message
    const message = "Hello! I'm contacting you from your website.";
    setWhatsAppMessage(message);

    // Open WhatsApp modal
    setIsWhatsAppModalOpen(true);

    // Log the interaction
    logChatInteraction({
      type: "direct_whatsapp_chat",
      timestamp: new Date().toISOString(),
    });
  };

  // Handle forwarding chat to WhatsApp
  const handleForwardToWhatsApp = () => {
    // Only forward if there are messages
    if (messages.length === 0) return;

    // Format the conversation for WhatsApp
    let formattedConversation = "Chat Conversation from Website:\n\n";

    messages.forEach((msg) => {
      const time = new Date(msg.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      formattedConversation += `[${time}] ${msg.sender === "user" ? "Visitor" : "Bot"}: ${msg.text}\n`;
    });

    // Add a footer
    formattedConversation += "\n\nSent from Vibha Art Website Chat";

    // Set the WhatsApp message
    setWhatsAppMessage(formattedConversation);

    // Open WhatsApp modal
    setIsWhatsAppModalOpen(true);

    // Log the interaction
    logChatInteraction({
      type: "forward_to_whatsapp",
      messageCount: messages.length,
      timestamp: new Date().toISOString(),
    });
  };

  // Close WhatsApp modal
  const handleCloseWhatsAppModal = () => {
    setIsWhatsAppModalOpen(false);
  };

  return (
    <>
      {/* WhatsApp Modal */}
      <WhatsAppModal
        isOpen={isWhatsAppModalOpen}
        onClose={handleCloseWhatsAppModal}
        phoneNumber="918625948046"
        message={whatsAppMessage}
      />

      {/* Chat Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-[#E65056] text-white shadow-lg flex items-center justify-center"
        whileHover={{
          scale: 1.1,
          boxShadow: "0 10px 25px -5px rgba(230, 80, 86, 0.4)",
        }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes size={24} /> : <FaComments size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Chat Header */}
            <div className="bg-[#E65056] text-white p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <FaComments size={20} />
                </div>
                <div>
                  <h3 className="font-bold">Vibha Art Assistant</h3>
                  <p className="text-xs opacity-80">
                    Online | Typically replies instantly
                  </p>
                </div>
              </div>
              <button
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.sender === "user"
                          ? "bg-[#E65056] text-white rounded-tr-none"
                          : "bg-white text-gray-800 rounded-tl-none shadow-md"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">
                        {message.text}
                      </p>

                      {/* Contact info buttons */}
                      {message.contactInfo && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <a
                            href="mailto:vibhart07@gmail.com"
                            className="inline-flex items-center text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded-full transition-colors"
                          >
                            <FaEnvelope className="mr-1" size={10} /> Email Us
                          </a>
                          <a
                            href="tel:+918625948046"
                            className="inline-flex items-center text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded-full transition-colors"
                          >
                            <FaPhone className="mr-1" size={10} /> Call Us
                          </a>
                          <a
                            href="https://wa.me/918625948046"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded-full transition-colors"
                          >
                            <FaWhatsapp className="mr-1" size={10} /> WhatsApp
                          </a>
                        </div>
                      )}

                      {/* WhatsApp options */}
                      {message.whatsAppOptions && (
                        <div className="mt-3 flex flex-col gap-2">
                          <button
                            onClick={handleDirectWhatsApp}
                            className="inline-flex items-center text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-colors w-full"
                          >
                            <FaWhatsapp className="mr-2" size={14} /> Start New
                            WhatsApp Chat
                          </button>
                          <button
                            onClick={handleForwardToWhatsApp}
                            className="inline-flex items-center text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-colors w-full"
                          >
                            <FaWhatsapp className="mr-2" size={14} /> Forward
                            This Conversation to WhatsApp
                          </button>
                        </div>
                      )}

                      {/* Option buttons */}
                      {message.options && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.options.map((option) => (
                            <button
                              key={option.id}
                              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-full transition-colors"
                              onClick={() => handleOptionSelect(option.id)}
                            >
                              {option.text}
                            </button>
                          ))}
                        </div>
                      )}

                      <p
                        className={`text-xs mt-1 ${message.sender === "user" ? "text-white/70" : "text-gray-500"}`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Bot typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-800 rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%] shadow-md">
                      <div className="flex space-x-2">
                        <div
                          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Contact Form */}
            {showContactForm ? (
              <div className="p-4 bg-white border-t border-gray-200 overflow-y-auto max-h-[300px]">
                <form onSubmit={handleContactFormSubmit}>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="text-gray-400 text-sm" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={contactForm.name}
                          onChange={handleContactFormChange}
                          className={`w-full pl-10 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E65056]/20 ${
                            formErrors.name
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Your name"
                        />
                      </div>
                      {formErrors.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEnvelope className="text-gray-400 text-sm" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={contactForm.email}
                          onChange={handleContactFormChange}
                          className={`w-full pl-10 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E65056]/20 ${
                            formErrors.email
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Your email"
                        />
                      </div>
                      {formErrors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Phone
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaPhone className="text-gray-400 text-sm" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={contactForm.phone}
                          onChange={handleContactFormChange}
                          className={`w-full pl-10 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E65056]/20 ${
                            formErrors.phone
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Your phone number"
                        />
                      </div>
                      {formErrors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={contactForm.message}
                        onChange={handleContactFormChange}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E65056]/20 ${
                          formErrors.message
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="How can we help you?"
                        rows="3"
                      ></textarea>
                      {formErrors.message && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.message}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <button
                        type="button"
                        className="text-sm text-gray-500 hover:text-gray-700"
                        onClick={() => setShowContactForm(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-[#E65056] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#E65056]/90 transition-colors flex items-center"
                      >
                        Submit <FaArrowRight className="ml-2" size={12} />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <>
                {/* Quick Replies */}
                {messages.length > 0 && messages.length < 3 && (
                  <div className="p-3 bg-white border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">
                      Suggested questions:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {quickReplies.map((reply) => (
                        <button
                          key={reply.id}
                          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-full transition-colors"
                          onClick={() => handleQuickReply(reply.text)}
                        >
                          {reply.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chat Input */}
                <div className="p-3 bg-white border-t border-gray-200">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center bg-gray-100 rounded-full px-4 py-3 border border-gray-200 shadow-sm">
                      <input
                        ref={inputRef}
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 bg-transparent outline-none text-gray-800 text-sm"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                      <button
                        className="ml-2 px-4 h-10 rounded-full flex items-center justify-center transition-colors bg-[#E65056] text-white hover:bg-[#E65056]/90 shadow-md"
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim()}
                        aria-label="Send message"
                      >
                        <span className="text-white font-bold text-sm">
                          Send
                        </span>
                      </button>
                    </div>
                    <button
                      onClick={handleWhatsAppConnect}
                      className="flex items-center justify-center py-2.5 px-4 bg-green-500 hover:bg-green-600 text-white text-sm rounded-full transition-colors shadow-md font-medium"
                    >
                      <FaWhatsapp className="mr-2" size={16} /> Connect on
                      WhatsApp
                    </button>
                  </div>
                  <div className="text-center mt-2">
                    <p className="text-xs text-gray-500">
                      Powered by Vibha Art
                    </p>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Submission Success Toast */}
      <AnimatePresence>
        {formSubmitted && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            onAnimationComplete={() => {
              setTimeout(() => setFormSubmitted(false), 5000);
            }}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <FaCheck className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  Form submitted successfully!
                </p>
                <p className="text-xs mt-1">We'll get back to you soon.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EnhancedChatBot;
