import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  console.log("Chat API request received");

  try {
    // Check if OpenAI API key is configured
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === "your_openai_api_key_here") {
      console.log("OpenAI API key not configured");
      return NextResponse.json(
        {
          error: "OpenAI API key not configured",
          details: "Please add your OpenAI API key to the .env.local file",
          suggestion:
            "Get your API key from https://platform.openai.com/api-keys",
        },
        { status: 401 }
      );
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const { message, context } = await request.json();
    console.log(
      `Processing chat request. Message length: ${message?.length}, Context length: ${context?.length}`
    );

    if (!message || !context) {
      console.log("Missing message or context");
      return NextResponse.json(
        { error: "Message and context are required" },
        { status: 400 }
      );
    }

    // Create a system prompt that instructs the AI to answer based on the provided context
    const systemPrompt = `You are an AI study assistant. Your role is to help students understand their study materials by answering questions based on the content they've uploaded.

IMPORTANT: Only answer questions based on the information provided in the context. If the answer is not in the context, say "I don't have enough information to answer that question based on the provided materials."

Context from uploaded materials:
${context}

Guidelines:
- Provide clear, concise answers
- Use examples when helpful
- Break down complex concepts
- Be encouraging and supportive
- If asked for explanations, provide step-by-step reasoning
- If asked for summaries, highlight key points
- If asked for study tips, provide practical advice

Student's question: ${message}`;

    console.log("Sending request to OpenAI...");
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const response =
      completion.choices[0]?.message?.content ||
      "Sorry, I could not generate a response.";

    console.log("OpenAI response received successfully");
    return NextResponse.json({
      response,
      usage: completion.usage,
    });
  } catch (error: any) {
    console.error("Chat API error:", error);

    // Handle specific error types
    if (
      error?.status === 429 ||
      error?.code === "insufficient_quota" ||
      error?.error?.type === "insufficient_quota"
    ) {
      console.log("Rate limit or quota exceeded - providing fallback response");

      // Try to get the message from the request for the fallback response
      let userMessage = "your question";
      try {
        const body = await request.json();
        userMessage = body.message || "your question";
      } catch (e) {
        // If we can't parse the request, use default message
      }

      // Provide a helpful fallback response
      const fallbackResponse = `I'm currently experiencing high demand and can't process your request right now. Here are some alternatives:

1. **Try again in a few minutes** - The service may be available again shortly
2. **Check your OpenAI account** - You may need to add billing information or upgrade your plan
3. **Use the study features** - You can still:
   - Upload and organize your study materials
   - Use the "Paste Text" feature to add content manually
   - Generate quizzes from your materials
   - Review your uploaded content

For immediate help, try visiting: https://platform.openai.com/account/billing

Your question was: "${userMessage}"
I'll be happy to help once the service is available again!`;

      return NextResponse.json({
        response: fallbackResponse,
        warning: "OpenAI API quota exceeded - showing fallback response",
        suggestion: "Check your OpenAI billing or try again later",
      });
    }

    // Handle other specific errors
    let errorMessage = "Failed to process chat request";
    let details = error instanceof Error ? error.message : "Unknown error";

    if (details.includes("invalid_api_key")) {
      errorMessage = "Invalid OpenAI API key";
      details = "Please check your API key in the .env.local file";
    } else if (details.includes("rate_limit")) {
      errorMessage = "Rate limit exceeded";
      details = "Please wait a moment and try again";
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: details,
        suggestion: "Check your OpenAI API key and try again",
      },
      { status: 500 }
    );
  }
}
