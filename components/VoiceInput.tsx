"use client";

import { useState, useEffect } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface VoiceInputProps {
  onTranscript?: (transcript: string) => void;
}

export default function VoiceInput({ onTranscript }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      setIsSupported(true);
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onstart = () => {
        setIsListening(true);
        toast.success("Listening... Speak now!");
      };

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (onTranscript) {
          onTranscript(transcript);
        }
        setIsListening(false);
        toast.success("Voice input received!");
      };

      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        toast.error("Voice input failed. Please try again.");
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    } else {
      setIsSupported(false);
    }
  }, [onTranscript]);

  const toggleListening = () => {
    if (!isSupported) {
      toast.error("Speech recognition is not supported in your browser");
      return;
    }

    if (isListening) {
      recognition?.stop();
    } else {
      recognition?.start();
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <button
      onClick={toggleListening}
      disabled={!isSupported}
      className={`voice-button p-3 rounded-full transition-all duration-200 ${
        isListening
          ? "bg-red-500 text-white recording"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
      title={isListening ? "Stop listening" : "Start voice input"}
    >
      {isListening ? (
        <MicOff className="h-5 w-5" />
      ) : (
        <Mic className="h-5 w-5" />
      )}
    </button>
  );
}
