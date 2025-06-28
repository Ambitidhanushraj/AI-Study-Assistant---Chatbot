import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { content, type, difficulty, numQuestions } = await request.json();

    if (!content || !type || !difficulty || !numQuestions) {
      return NextResponse.json(
        {
          error:
            "Content, type, difficulty, and number of questions are required",
        },
        { status: 400 }
      );
    }

    let prompt = `Generate ${numQuestions} ${difficulty} level ${type} questions based on the following study material. 

Study Material:
${content}

Requirements:
- Questions should be based on key concepts from the material
- Provide 4 multiple choice options for each question
- Include a brief explanation for the correct answer
- Make questions appropriate for ${difficulty} difficulty level
- Focus on important concepts and details

Format the response as a JSON array with the following structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Brief explanation of why this is correct"
  }
]

Generate exactly ${numQuestions} questions:`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert educator who creates high-quality quiz questions. Always respond with valid JSON format.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || "[]";

    // Parse the JSON response
    let questions;
    try {
      questions = JSON.parse(response);
    } catch (parseError) {
      console.error("Failed to parse quiz response:", parseError);
      return NextResponse.json(
        { error: "Failed to generate quiz questions" },
        { status: 500 }
      );
    }

    // Validate the questions structure
    if (!Array.isArray(questions)) {
      return NextResponse.json(
        { error: "Invalid quiz format generated" },
        { status: 500 }
      );
    }

    // Add IDs to questions
    const questionsWithIds = questions.map((q, index) => ({
      id: `q${index + 1}`,
      ...q,
    }));

    return NextResponse.json({
      questions: questionsWithIds,
      usage: completion.usage,
    });
  } catch (error) {
    console.error("Quiz generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz" },
      { status: 500 }
    );
  }
}
