import "./globals.css";

export const metadata = {
  title: "AI Study Assistant - Personalized Education Chatbot",
  description:
    "Upload your notes and chat with an AI assistant that answers questions based on your content using RAG technology.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          {children}
        </div>
      </body>
    </html>
  );
}
