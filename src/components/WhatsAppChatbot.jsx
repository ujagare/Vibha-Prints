import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, MessageCircle } from "lucide-react";

const WhatsAppChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! 👋 Welcome to Vibha Prints. How can we help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Get phone number from localStorage or use default
      const phoneNumber = localStorage.getItem("userPhone") || "9876543210";

      // Call WhatsApp chatbot API
      const response = await fetch("http://localhost:8000/api/whatsapp/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phoneNumber,
          message: inputValue,
          name: localStorage.getItem("userName") || "Customer",
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add bot response
        const botMessage = {
          id: messages.length + 2,
          text: data.response,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMessage = {
          id: messages.length + 2,
          text: "Sorry, I couldn't process that. Please try again or contact us directly.",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        id: messages.length + 2,
        text: "Connection error. Please try again or call/WhatsApp us at +91 86249 48046. Website: https://www.vibhaprints.com/",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-40 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-green-500 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Vibha Prints Support</h3>
                <p className="text-xs text-green-100">AI-powered assistant</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-green-600 p-1 rounded"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.sender === "user"
                        ? "bg-green-500 text-white rounded-br-none"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === "user"
                          ? "text-green-100"
                          : "text-gray-500"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-lg rounded-bl-none">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSendMessage}
              className="border-t border-gray-200 p-4 bg-white flex gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 disabled:opacity-50 transition"
              >
                <Send size={20} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WhatsAppChatbot;
