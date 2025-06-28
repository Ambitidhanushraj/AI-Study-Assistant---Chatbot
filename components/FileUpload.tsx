"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useFileStore } from "@/store/fileStore";

interface FileUploadProps {
  onProcessing: (processing: boolean) => void;
}

export default function FileUpload({ onProcessing }: FileUploadProps) {
  const [textInput, setTextInput] = useState("");
  const [isTextMode, setIsTextMode] = useState(false);
  const { addFile } = useFileStore();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      console.log(`Files dropped: ${acceptedFiles.length} files`);
      onProcessing(true);

      try {
        for (const file of acceptedFiles) {
          console.log(`Processing file: ${file.name}`);
          if (file.type === "application/pdf") {
            await processPDFFile(file);
          } else if (file.type === "text/plain") {
            await processTextFile(file);
          } else {
            console.log(`Unsupported file type: ${file.type}`);
            toast.error(`${file.name} is not a supported file type`);
          }
        }
      } catch (error) {
        console.error("File processing error:", error);
        toast.error("Error processing files");
      } finally {
        onProcessing(false);
      }
    },
    [onProcessing]
  );

  const processPDFFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to parse PDF");
      }

      const { content, note } = await response.json();

      // Check if this is a placeholder response (no text extraction)
      if (note && note.includes("Text extraction not available")) {
        toast.success(`${file.name} uploaded successfully!`, {
          duration: 4000,
        });
        toast(
          `${file.name} uploaded! Use the 'Paste Text' option to add content from your PDF`,
          {
            duration: 6000,
            icon: "📝",
          }
        );

        // Add the placeholder content to the store
        addFile({
          id: Date.now().toString(),
          name: file.name,
          content,
          type: "pdf",
          uploadedAt: new Date(),
        });
      } else {
        // Normal PDF with extracted text
        addFile({
          id: Date.now().toString(),
          name: file.name,
          content,
          type: "pdf",
          uploadedAt: new Date(),
        });
        toast.success(`${file.name} uploaded successfully`);
      }
    } catch (error) {
      console.error("PDF processing error:", error);

      // Provide helpful error message
      const errorMessage =
        error instanceof Error ? error.message : "Failed to process PDF";

      if (
        errorMessage.includes("PDF format not supported") ||
        errorMessage.includes("empty or unreadable")
      ) {
        toast.error(
          `${file.name} cannot be processed. Try a different PDF or use the text input option.`,
          { duration: 5000 }
        );
      } else {
        toast.error(`Failed to process ${file.name}: ${errorMessage}`);
      }

      throw error;
    }
  };

  const processTextFile = async (file: File) => {
    try {
      const content = await file.text();

      addFile({
        id: Date.now().toString(),
        name: file.name,
        content,
        type: "text",
        uploadedAt: new Date(),
      });

      toast.success(`${file.name} uploaded successfully`);
    } catch (error) {
      toast.error(`Failed to process ${file.name}`);
      throw error;
    }
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) {
      toast.error("Please enter some text");
      return;
    }

    addFile({
      id: Date.now().toString(),
      name: "Pasted Text",
      content: textInput,
      type: "text",
      uploadedAt: new Date(),
    });

    setTextInput("");
    setIsTextMode(false);
    toast.success("Text added successfully");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
    },
    multiple: true,
  });

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      {!isTextMode && (
        <div
          {...getRootProps()}
          className={`file-upload-area rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragActive ? "dragover" : ""
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {isDragActive ? "Drop files here" : "Upload PDF or Text Files"}
          </h3>
          <p className="text-gray-600 mb-4">
            Drag and drop your study materials here, or click to browse
          </p>
          <p className="text-sm text-gray-500">Supports PDF and TXT files</p>
        </div>
      )}

      {/* Text Input Area */}
      {isTextMode && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Paste Your Notes
            </h3>
            <button
              onClick={() => setIsTextMode(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Paste your study notes, syllabus, or any text content here..."
            className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex space-x-3">
            <button
              onClick={handleTextSubmit}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Text
            </button>
            <button
              onClick={() => setIsTextMode(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Toggle Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => setIsTextMode(false)}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md border transition-colors ${
            !isTextMode
              ? "bg-blue-50 border-blue-200 text-blue-700"
              : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Upload className="h-4 w-4" />
          <span>Upload Files</span>
        </button>
        <button
          onClick={() => setIsTextMode(true)}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md border transition-colors ${
            isTextMode
              ? "bg-blue-50 border-blue-200 text-blue-700"
              : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Paste Text</span>
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Upload PDF files or paste text content</li>
          <li>• The AI will analyze your study materials</li>
          <li>• Ask questions and get personalized answers</li>
          <li>• Generate quizzes based on your content</li>
        </ul>
      </div>
    </div>
  );
}
