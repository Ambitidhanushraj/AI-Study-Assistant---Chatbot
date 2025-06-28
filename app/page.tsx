"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Upload,
  MessageCircle,
  BookOpen,
  Mic,
  Download,
  FileText,
  User,
  Settings,
} from "lucide-react";
import toast from "react-hot-toast";
import AuthComponent from "@/components/AuthComponent";
import FileUpload from "@/components/FileUpload";
import ChatInterface from "@/components/ChatInterface";
import QuizGenerator from "@/components/QuizGenerator";
import VoiceInput from "@/components/VoiceInput";
import { useAuth } from "@/hooks/useAuth";
import { useFileStore } from "@/store/fileStore";
import { useChatStore } from "@/store/chatStore";
import SimpleAuthComponent from "@/components/SimpleAuthComponent";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface File {
  id: string;
  name: string;
  type: string;
  size: number;
}

interface Message {
  id: number;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<
    "upload" | "chat" | "quiz" | "voice"
  >("upload");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { user, loading } = useAuth();
  const { uploadedFiles } = useFileStore();

  const isAuthenticated = !!user;

  const tabs = [
    { id: "upload", label: "Upload Files", icon: Upload },
    { id: "chat", label: "AI Chat", icon: MessageCircle },
    { id: "quiz", label: "Quiz Generator", icon: BookOpen },
    { id: "voice", label: "Voice Input", icon: Mic },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🤖</div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  AI Study Assistant
                </h1>
                <p className="text-sm text-gray-600">
                  Personalized Education Chatbot
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {uploadedFiles.length > 0 && (
                <div className="text-sm text-gray-600">
                  {uploadedFiles.length} file
                  {uploadedFiles.length !== 1 ? "s" : ""} uploaded
                </div>
              )}
              <button
                onClick={() => setShowAuth(!showAuth)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <User className="h-5 w-5" />
                <span>
                  {isAuthenticated ? user?.email || "User" : "Sign In"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="flex space-x-1 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-lg border">
          {activeTab === "upload" && (
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Upload Study Materials
                </h2>
                <p className="text-gray-600">
                  Upload PDF files or paste text content to get started with
                  AI-powered learning
                </p>
              </div>
              <FileUpload onProcessing={setIsProcessing} />
            </div>
          )}

          {activeTab === "chat" && (
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  AI Chat Assistant
                </h2>
                <p className="text-gray-600">
                  Ask questions about your study materials and get personalized
                  answers
                </p>
              </div>
              <ChatInterface />
            </div>
          )}

          {activeTab === "quiz" && (
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Quiz Generator
                </h2>
                <p className="text-gray-600">
                  Generate personalized quizzes based on your study materials
                </p>
              </div>
              <QuizGenerator />
            </div>
          )}

          {activeTab === "voice" && (
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Voice Input
                </h2>
                <p className="text-gray-600">
                  Use voice commands to interact with the AI assistant
                </p>
              </div>
              <VoiceInput />
            </div>
          )}
        </div>

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg font-medium text-gray-900">
                Processing files...
              </p>
              <p className="text-gray-600">
                Please wait while we analyze your content
              </p>
            </div>
          </div>
        )}

        {/* Auth Modal */}
        {showAuth && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Authentication
                </h2>
                <button
                  onClick={() => setShowAuth(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <SimpleAuthComponent />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
