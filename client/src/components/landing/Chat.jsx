import React, { useState, useEffect } from "react";
import { FiMessageCircle } from "react-icons/fi";

const Chat = () => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const headingText = "Connect & Achieve Together";
  const staticMessages = [
    { user: "Emma", message: "Daily workout session starts in 10 minutes! 💪" },
    { user: "Jake", message: "Just finished my morning run - feeling great!" },
    { user: "You", message: "Completed today's coding challenge 🎉" },
    { user: "Emma", message: "Amazing! Let's keep this momentum going" },
    { user: "Lisa", message: "Anyone up for a virtual study session later? 📚" }
  ];

  // Typing effect for heading
  useEffect(() => {
    if (currentIndex < headingText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(headingText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 70);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, headingText]);

  useEffect(() => {
    if (messageIndex < staticMessages.length) {
      setIsTyping(true);
      
      const timer = setTimeout(() => {
        setMessages((prev) => [...prev, staticMessages[messageIndex]]);
        setMessageIndex((prev) => prev + 1);
        setIsTyping(false);
      }, 1100);

      return () => clearTimeout(timer);
    }
  }, [messageIndex]);

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Chat Demo */}
          <div className="lg:order-1 order-2">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md mx-auto lg:mx-0">
              {/* Chat Header */}
              <div className="bg-blue-600 px-6 py-4 flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-white text-sm font-medium">
                  FocusFlow Chat • Focus Tribe

                </div>
              </div>

              {/* Messages Area */}
              <div className="p-6">
                <div className="h-80 bg-gray-50 rounded-xl p-4 overflow-y-auto space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.user === "You" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-3 rounded-2xl ${
                          msg.user === "You"
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-gray-200 shadow-sm"
                        }`}
                      >
                        {msg.user !== "You" && (
                          <div className="text-xs font-medium text-blue-500 mb-1">
                            {msg.user}
                          </div>
                        )}
                        <div className="text-sm">{msg.message}</div>
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          </div>
                          <span className="text-xs text-gray-500 ml-2">
                            {messageIndex < staticMessages.length
                              ? staticMessages[messageIndex].user
                              : "Someone"}{" "}
                            is typing...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Input Area */}
                <div className="mt-4 flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <FiMessageCircle className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Share your progress..."
                    className="flex-1 bg-transparent text-gray-700 placeholder-gray-400 outline-none"
                    disabled
                  />
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-all">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Text and Features*/}
          <div className="lg:order-2 order-1 text-left">
            <h2 className="text-4xl lg:text-5xl font-bold text-blue-600 mb-6 leading-tight">
              {displayedText}
              <span className="animate-pulse text-blue-600">|</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Stay motivated and accountable with instant messaging, progress sharing,
              and real-time support from your goal-focused community.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Chat;
