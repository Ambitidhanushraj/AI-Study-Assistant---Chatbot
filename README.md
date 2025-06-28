# 🤖 AI Study Assistant - Personalized Education Chatbot

A comprehensive AI-powered study assistant that helps students learn more effectively by providing personalized answers based on their uploaded study materials using RAG (Retrieval-Augmented Generation) technology.

## 🎯 Project Overview

The AI Study Assistant is designed to revolutionize personalized education by allowing students to upload their notes, syllabi, or any study materials and then interact with an AI assistant that provides contextual, accurate answers based on that specific content.

## ✨ Key Features

### 📁 **File Upload & Processing**

- **PDF Support**: Upload and parse PDF documents
- **Text Input**: Direct text pasting for quick note addition
- **Drag & Drop**: Intuitive file upload interface
- **Multiple Files**: Support for multiple document uploads

### 🧠 **AI-Powered Chat Assistant**

- **Contextual Answers**: AI responds based on uploaded materials only
- **RAG Technology**: Retrieval-Augmented Generation for accurate responses
- **Smart Prompts**: Pre-built question templates for common study needs
- **Markdown Support**: Rich text formatting in responses

### 📝 **Quiz Generator**

- **Multiple Formats**: Multiple choice, true/false, short answer
- **Difficulty Levels**: Easy, medium, hard question generation
- **Customizable**: Choose number of questions (1-20)
- **Instant Feedback**: Immediate scoring and explanations

### 🎤 **Voice Input**

- **Speech-to-Text**: Ask questions using voice commands
- **Browser Native**: Uses Web Speech API
- **Real-time Feedback**: Visual indicators during recording

### 🔐 **Authentication System**

- **User Accounts**: Secure login/signup system
- **Session Management**: Persistent user sessions
- **Data Privacy**: User data isolation

### 📊 **Study Analytics**

- **Progress Tracking**: Monitor quiz performance
- **Answer History**: Review previous interactions
- **Performance Insights**: Detailed quiz results with explanations

## 🛠️ Tech Stack

### **Frontend**

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Lucide React**: Beautiful icons

### **Backend & AI**

- **OpenAI GPT-3.5-turbo**: Primary LLM for chat and quiz generation
- **PDF-parse**: PDF text extraction
- **Next.js API Routes**: Serverless backend functions

### **State Management**

- **Zustand**: Lightweight state management
- **React Hooks**: Custom hooks for authentication and data

### **UI/UX Libraries**

- **React Hot Toast**: Notification system
- **React Markdown**: Rich text rendering
- **React Dropzone**: File upload handling

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ai-study-assistant
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   GROQ_API_KEY=your_groq_api_key_here (optional)
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### 1. **Authentication**

- Sign up with any email/password (demo mode)
- Login to access your personalized dashboard

### 2. **Upload Study Materials**

- **PDF Files**: Drag and drop or click to upload PDF documents
- **Text Input**: Paste notes directly into the text area
- **Multiple Files**: Upload several documents for comprehensive coverage

### 3. **Chat with AI Assistant**

- Ask questions about your uploaded materials
- Use suggested prompts for common study needs:
  - "What are the key points in my notes?"
  - "Can you explain this topic in simple terms?"
  - "What are some practice questions for this material?"
  - "How can I remember this information better?"

### 4. **Generate Quizzes**

- Choose quiz type (multiple choice, true/false, short answer)
- Select difficulty level
- Set number of questions
- Take the quiz and review results with explanations

### 5. **Voice Input**

- Click the microphone button
- Speak your question clearly
- Review the transcribed text before sending

## 🔧 API Endpoints

### `/api/parse-pdf`

- **Method**: POST
- **Purpose**: Extract text from uploaded PDF files
- **Input**: FormData with PDF file
- **Output**: Extracted text content

### `/api/chat`

- **Method**: POST
- **Purpose**: Generate AI responses based on uploaded content
- **Input**: JSON with message and context
- **Output**: AI-generated response

### `/api/generate-quiz`

- **Method**: POST
- **Purpose**: Create quiz questions from study materials
- **Input**: JSON with content, type, difficulty, and question count
- **Output**: Array of quiz questions with answers

## 🎨 UI/UX Features

### **Modern Design**

- Clean, intuitive interface
- Responsive design for all devices
- Smooth animations and transitions
- Accessibility-friendly components

### **User Experience**

- Real-time feedback and notifications
- Loading states and progress indicators
- Error handling with helpful messages
- Keyboard shortcuts and navigation

### **Visual Elements**

- Custom color scheme with blue primary theme
- Consistent iconography using Lucide React
- Typography hierarchy for better readability
- Interactive hover and focus states

## 🔒 Security & Privacy

### **Data Protection**

- Client-side file processing (no server storage)
- Secure API key management
- No persistent storage of sensitive data
- HTTPS enforcement in production

### **User Privacy**

- Local storage for session management
- No tracking or analytics
- User data isolation
- Transparent data handling

## 🚀 Deployment

### **Vercel (Recommended)**

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### **Other Platforms**

- **Netlify**: Compatible with Next.js static export
- **Railway**: Full-stack deployment support
- **AWS Amplify**: Scalable cloud deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for providing the GPT API
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first approach
- All contributors and supporters

