"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import toast from "react-hot-toast";
import { useChatStore } from "@/store/chatStore";
import { useFileStore } from "@/store/fileStore";

export default function ChatInterface() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, addMessage, setIsLoading: setChatLoading } = useChatStore();
  const { getFileContent } = useFileStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);
    setChatLoading(true);

    console.log("Submitting chat message:", userMessage);

    // Add user message
    addMessage({
      content: userMessage,
      role: "user",
    });

    try {
      const fileContent = getFileContent();
      if (!fileContent) {
        console.log("No file content available");
        toast.error("Please upload some study materials first");
        return;
      }

      console.log("Sending chat request to API...");
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          context: fileContent,
        }),
      });

      console.log("Chat API response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Chat API error:", errorData);
        throw new Error(errorData.error || "Failed to get response");
      }

      const data = await response.json();
      console.log("Chat API response received:", data);

      // Check if this is a fallback response due to quota issues
      if (data.warning && data.warning.includes("quota exceeded")) {
        toast.error("OpenAI API quota exceeded - showing fallback response", {
          duration: 8000,
          style: {
            background: "#fbbf24",
            color: "#92400e",
          },
        });
      }

      // Add AI response
      addMessage({
        content: data.response,
        role: "assistant",
      });
    } catch (error) {
      console.error("Chat error:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Failed to get response";

      if (errorMessage.includes("OpenAI API key not configured")) {
        toast.error(
          "OpenAI API key not configured. Please add your API key to continue.",
          { duration: 6000 }
        );
      } else if (errorMessage.includes("Invalid OpenAI API key")) {
        toast.error(
          "Invalid OpenAI API key. Please check your configuration.",
          { duration: 6000 }
        );
      } else if (
        errorMessage.includes("quota") ||
        errorMessage.includes("rate limit")
      ) {
        toast.error(
          "OpenAI API quota exceeded. Please check your billing or try again later.",
          { duration: 8000 }
        );
      } else {
        toast.error("Failed to get response. Please try again.");
      }

      // Add error message
      addMessage({
        content:
          "Sorry, I encountered an error. Please check your API configuration and try again.",
        role: "assistant",
      });
    } finally {
      setIsLoading(false);
      setChatLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Start a conversation
            </h3>
            <p className="text-gray-600 mb-6">
              Ask questions about your study materials and get personalized
              answers
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <button
                onClick={() => setInput("What are the key points in my notes?")}
                className="p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="font-medium text-gray-900">Key Points</div>
                <div className="text-sm text-gray-600">
                  Summarize main concepts
                </div>
              </button>
              <button
                onClick={() =>
                  setInput("Can you explain this topic in simple terms?")
                }
                className="p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="font-medium text-gray-900">
                  Simple Explanation
                </div>
                <div className="text-sm text-gray-600">
                  Break down complex topics
                </div>
              </button>
              <button
                onClick={() =>
                  setInput(
                    "What are some practice questions for this material?"
                  )
                }
                className="p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="font-medium text-gray-900">
                  Practice Questions
                </div>
                <div className="text-sm text-gray-600">
                  Test your understanding
                </div>
              </button>
              <button
                onClick={() =>
                  setInput("How can I remember this information better?")
                }
                className="p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="font-medium text-gray-900">Study Tips</div>
                <div className="text-sm text-gray-600">Memory techniques</div>
              </button>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.role === "assistant" && (
                      <Bot className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      {message.role === "assistant" ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                          className="prose prose-sm max-w-none"
                          components={{
                            code: ({
                              node,
                              className,
                              children,
                              ...props
                            }: any) => {
                              const match = /language-(\w+)/.exec(
                                className || ""
                              );
                              const isInline = !match;
                              return !isInline ? (
                                <pre className="bg-gray-800 text-white p-3 rounded-md overflow-x-auto">
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                </pre>
                              ) : (
                                <code
                                  className="bg-gray-200 px-1 py-0.5 rounded text-sm"
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}
                    </div>
                    {message.role === "user" && (
                      <User className="h-5 w-5 text-blue-200 mt-1 flex-shrink-0" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                <span className="text-gray-600">AI is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <div className="flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question about your study materials..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={1}
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
