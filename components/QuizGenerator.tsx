"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Play, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";
import { useFileStore } from "@/store/fileStore";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  createdAt: Date;
}

export default function QuizGenerator() {
  const [quizType, setQuizType] = useState<
    "multiple-choice" | "true-false" | "short-answer"
  >("multiple-choice");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );
  const [numQuestions, setNumQuestions] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const { getFileContent } = useFileStore();

  const generateQuiz = async () => {
    const fileContent = getFileContent();
    if (!fileContent) {
      toast.error("Please upload some study materials first");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: fileContent,
          type: quizType,
          difficulty,
          numQuestions,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate quiz");
      }

      const data = await response.json();

      const quiz: Quiz = {
        id: Date.now().toString(),
        title: `${
          quizType.charAt(0).toUpperCase() + quizType.slice(1)
        } Quiz - ${difficulty} level`,
        questions: data.questions,
        createdAt: new Date(),
      };

      setCurrentQuiz(quiz);
      setCurrentQuestionIndex(0);
      setUserAnswers(new Array(data.questions.length).fill(-1));
      setShowResults(false);
      setScore(0);

      toast.success("Quiz generated successfully!");
    } catch (error) {
      console.error("Quiz generation error:", error);
      toast.error("Failed to generate quiz. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (currentQuiz && !showResults) {
      const newAnswers = [...userAnswers];
      newAnswers[currentQuestionIndex] = answerIndex;
      setUserAnswers(newAnswers);
    }
  };

  const nextQuestion = () => {
    if (
      currentQuiz &&
      currentQuestionIndex < currentQuiz.questions.length - 1
    ) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const finishQuiz = () => {
    if (!currentQuiz) return;

    let correctAnswers = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === currentQuiz.questions[index].correctAnswer) {
        correctAnswers++;
      }
    });

    setScore(correctAnswers);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setCurrentQuiz(null);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowResults(false);
    setScore(0);
  };

  const currentQuestion = currentQuiz?.questions[currentQuestionIndex];

  return (
    <div className="space-y-6">
      {!currentQuiz ? (
        <div>
          {/* Quiz Configuration */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quiz Configuration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quiz Type
                </label>
                <select
                  value={quizType}
                  onChange={(e) => setQuizType(e.target.value as any)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="true-false">True/False</option>
                  <option value="short-answer">Short Answer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Questions
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={generateQuiz}
                  disabled={isGenerating}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating Quiz...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Generate Quiz
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">
              How Quiz Generation Works:
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• AI analyzes your uploaded study materials</li>
              <li>• Generates questions based on key concepts</li>
              <li>• Provides explanations for correct answers</li>
              <li>• Tracks your performance and progress</li>
            </ul>
          </div>
        </div>
      ) : (
        <div>
          {/* Quiz Header */}
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentQuiz.title}
                </h3>
                <p className="text-sm text-gray-600">
                  Question {currentQuestionIndex + 1} of{" "}
                  {currentQuiz.questions.length}
                </p>
              </div>
              <button
                onClick={resetQuiz}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                <span>New Quiz</span>
              </button>
            </div>
          </div>

          {/* Quiz Content */}
          {!showResults ? (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              {currentQuestion && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      {currentQuestion.question}
                    </h4>

                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(index)}
                          className={`w-full p-4 text-left rounded-lg border transition-colors ${
                            userAnswers[currentQuestionIndex] === index
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                userAnswers[currentQuestionIndex] === index
                                  ? "border-blue-500 bg-blue-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {userAnswers[currentQuestionIndex] === index && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                            <span>{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between pt-4 border-t">
                    <button
                      onClick={previousQuestion}
                      disabled={currentQuestionIndex === 0}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>

                    {currentQuestionIndex ===
                    currentQuiz.questions.length - 1 ? (
                      <button
                        onClick={finishQuiz}
                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Finish Quiz
                      </button>
                    ) : (
                      <button
                        onClick={nextQuestion}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Results */
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Quiz Results
                </h3>
                <p className="text-lg text-gray-600">
                  You scored {score} out of {currentQuiz.questions.length} (
                  {Math.round((score / currentQuiz.questions.length) * 100)}%)
                </p>
              </div>

              <div className="space-y-4">
                {currentQuiz.questions.map((question, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start space-x-2 mb-3">
                      {userAnswers[index] === question.correctAnswer ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mt-1" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-2">
                          {index + 1}. {question.question}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          Your answer: {question.options[userAnswers[index]]}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          Correct answer:{" "}
                          {question.options[question.correctAnswer]}
                        </p>
                        <p className="text-sm text-blue-600">
                          <strong>Explanation:</strong> {question.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={resetQuiz}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Take Another Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
