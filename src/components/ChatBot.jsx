import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComments, FaTimes, FaPaperPlane, FaSpinner } from 'react-icons/fa';

// Predefined responses for the chatbot
const botResponses = {
  greeting: [
    "Hello! Welcome to Vibha Art. How can I help you today?",
    "Hi there! I'm Vibha's virtual assistant. What can I do for you?",
    "Welcome to Vibha Art! I'm here to assist you with any questions about our services."
  ],
  services: [
    "We offer a range of graphic design and printing services including logo design, business cards, brochures, and more. Would you like to know more about any specific service?"
  ],
  contact: [
    "You can reach us at vibhart07@gmail.com or call us at +91 86259 48046. Would you like us to contact you?"
  ],
  pricing: [
    "Our pricing varies based on the specific requirements of your project. Would you like to get a custom quote for your project?"
  ],
  turnaround: [
    "Our typical turnaround time depends on the complexity of the project. Simple designs may take 2-3 days, while more complex projects might take 1-2 weeks. Would you like to discuss your specific timeline?"
  ],
  default: [
    "I'm not sure I understand. Could you please rephrase your question or select from one of these common topics: services, pricing, contact information, or turnaround time?",
    "I didn't quite catch that. Can you try asking in a different way or let me know if you need information about our services, pricing, or how to contact us?",
    "I'm still learning! Could you please clarify what you're looking for? You can ask about our design services, printing options, or how to get in touch with our team."
  ]
};

// Keywords to match user queries
const keywords = {
  greeting: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'],
  services: ['service', 'offer', 'provide', 'design', 'print', 'logo', 'brochure', 'business card', 'what do you do'],
  contact: ['contact', 'email', 'phone', 'call', 'reach', 'talk', 'connect'],
  pricing: ['price', 'cost', 'rate', 'fee', 'charge', 'quote', 'estimate', 'how much'],
  turnaround: ['time', 'long', 'fast', 'quick', 'turnaround', 'deadline', 'when', 'how soon']
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

// Quick reply options
const quickReplies = [
  { id: 1, text: "What services do you offer?" },
  { id: 2, text: "How can I contact you?" },
  { id: 3, text: "What are your prices?" },
  { id: 4, text: "How long does it take?" }
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      
      // Add initial greeting if there are no messages
      if (messages.length === 0) {
        setIsTyping(true);
        setTimeout(() => {
          setMessages([
            { 
              id: 1, 
              text: getRandomResponse(botResponses.greeting), 
              sender: 'bot',
              timestamp: new Date()
            }
          ]);
          setIsTyping(false);
        }, 1000);
      }
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate bot typing and response
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleQuickReply = (text) => {
    // Add user message from quick reply
    const userMessage = {
      id: messages.length + 1,
      text: text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Simulate bot typing and response
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: getBotResponse(text),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Format timestamp
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-[#E65056] text-white shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
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
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Chat Header */}
            <div className="bg-[#E65056] text-white p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <FaComments size={20} />
                </div>
                <div>
                  <h3 className="font-bold">Vibha Art Assistant</h3>
                  <p className="text-xs opacity-80">Online | Typically replies instantly</p>
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
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.sender === 'user'
                          ? 'bg-[#E65056] text-white rounded-tr-none'
                          : 'bg-white text-gray-800 rounded-tl-none shadow-md'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
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
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Quick Replies */}
            {messages.length > 0 && messages.length < 3 && (
              <div className="p-3 bg-white border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
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
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent outline-none text-gray-800 text-sm"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button
                  className={`ml-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    inputValue.trim() ? 'bg-[#E65056] text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                >
                  <FaPaperPlane size={14} />
                </button>
              </div>
              <div className="text-center mt-2">
                <p className="text-xs text-gray-500">Powered by Vibha Art</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
