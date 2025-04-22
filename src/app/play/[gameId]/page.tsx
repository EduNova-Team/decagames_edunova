"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Button from "@/components/ui/Button";
import Card, {
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";

// Data types for the game
interface Option {
  id: string;
  label: string;
  text: string;
}

interface Question {
  id: string;
  questionNumber: number;
  text: string;
  options: Option[];
  correctAnswer: string;
  explanation: string;
}

interface GameData {
  id: string;
  name: string;
  questions: Question[];
}

// Game states
type GameState =
  | "loading"
  | "ready"
  | "playing"
  | "results"
  | "review"
  | "error";

// Save game data to session storage for persistence between refreshes
function saveGame(gameId: string, data: GameData): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(`game_${gameId}`, JSON.stringify(data));
  }
}

// Load game data from session storage
function loadGame(gameId: string): GameData | null {
  if (typeof window !== "undefined") {
    const data = sessionStorage.getItem(`game_${gameId}`);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error("Error parsing stored game data:", e);
      }
    }
  }
  return null;
}

// Save game to local storage for game history
function saveGameToHistory(
  gameData: GameData,
  status: "started" | "completed",
  score?: number
): void {
  if (typeof window !== "undefined") {
    // Define the game history item type
    interface GameHistoryItem {
      id: string;
      name: string;
      questionCount: number;
      status: "started" | "completed";
      lastPlayed: string;
      score?: number;
    }

    // Get existing games from localStorage
    const gamesHistoryJson = localStorage.getItem("deca_games_history");
    const gamesHistory: GameHistoryItem[] = gamesHistoryJson
      ? JSON.parse(gamesHistoryJson)
      : [];

    // Check if this game is already in history
    const existingGameIndex = gamesHistory.findIndex(
      (g: GameHistoryItem) => g.id === gameData.id
    );

    const gameInfo: GameHistoryItem = {
      id: gameData.id,
      name: gameData.name,
      questionCount: gameData.questions.length,
      status: status,
      lastPlayed: new Date().toISOString(),
      score: score,
    };

    // Update or add the game
    if (existingGameIndex >= 0) {
      gamesHistory[existingGameIndex] = {
        ...gamesHistory[existingGameIndex],
        ...gameInfo,
      };
    } else {
      gamesHistory.push(gameInfo);
    }

    // Save back to localStorage
    localStorage.setItem("deca_games_history", JSON.stringify(gamesHistory));
  }
}

export default function GamePlay() {
  const params = useParams();
  const gameId = params.gameId as string;
  const [requestedCount, setRequestedCount] = useState<number | null>(null);

  const [gameState, setGameState] = useState<GameState>("loading");
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(
    new Set()
  );
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60); // 1 minute per question in seconds
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true when component mounts and parse query params
  useEffect(() => {
    setIsClient(true);

    // Parse query parameters to get requested question count and timer setting
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const countParam = urlParams.get("count");
      if (countParam) {
        const count = parseInt(countParam, 10);
        setRequestedCount(isNaN(count) ? null : count);
      }

      const timerParam = urlParams.get("timer");
      setTimerEnabled(timerParam === "true");
    }
  }, []);

  // Load game data from API or session storage
  useEffect(() => {
    // Only load data on the client
    if (!isClient) return;

    async function fetchGameData() {
      try {
        // First try to load from session storage (for persistence between refreshes)
        const storedGame = loadGame(gameId);

        if (storedGame) {
          console.log("Loaded game from session storage", gameId);

          // If we have a requested count, limit the questions
          if (
            requestedCount &&
            requestedCount > 0 &&
            requestedCount < storedGame.questions.length
          ) {
            // Create a shallow copy with limited questions
            const limitedGame = {
              ...storedGame,
              questions: [...storedGame.questions].slice(0, requestedCount),
            };
            setGameData(limitedGame);
          } else {
            setGameData(storedGame);
          }

          setGameState("ready");
          return;
        }

        // If not in session storage, fetch from API
        console.log("Fetching game from API", gameId);
        // Include count parameter if specified
        const queryParam = requestedCount
          ? `&questionCount=${requestedCount}`
          : "";
        const response = await fetch(
          `/api/process-pdf?gameId=${gameId}${queryParam}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to load game data");
        }

        const data = await response.json();
        console.log("Game loaded successfully", data.name);

        // Save to session storage for persistence
        saveGame(gameId, data);

        setGameData(data);
        setGameState("ready");
      } catch (error) {
        console.error("Error loading game:", error);
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load game"
        );
        setGameState("error");
      }
    }

    fetchGameData();
  }, [gameId, isClient, requestedCount]);

  // Handle flagging a question
  const toggleFlagQuestion = (questionId: string) => {
    setFlaggedQuestions((prev) => {
      const newFlagged = new Set(prev);
      if (newFlagged.has(questionId)) {
        newFlagged.delete(questionId);
      } else {
        newFlagged.add(questionId);
      }
      return newFlagged;
    });
  };

  // Handle navigating to a specific question
  const navigateToQuestion = (index: number) => {
    if (index >= 0 && index < (gameData?.questions.length || 0)) {
      setCurrentQuestionIndex(index);
    }
  };

  // Start game function - reset flagged questions too
  const startGame = () => {
    setGameState("playing");
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setFlaggedQuestions(new Set());

    // Set total time for the entire game - 1 minute per question
    if (timerEnabled && gameData) {
      setTimeRemaining(gameData.questions.length * 60); // Total seconds for all questions
    }

    // Save to game history that we've started this game
    if (gameData) {
      saveGameToHistory(gameData, "started");
    }
  };

  // Handle selecting an answer
  const selectAnswer = (questionId: string, answerLabel: string) => {
    const newSelectedAnswers = {
      ...selectedAnswers,
      [questionId]: answerLabel,
    };

    setSelectedAnswers(newSelectedAnswers);

    // Don't automatically move to next question now that we have navigation
    // User can use the navigation controls to move between questions
  };

  // Calculate score
  const calculateScore = () => {
    if (!gameData) return 0;

    let score = 0;
    gameData.questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        score++;
      }
    });

    // Save the completed game to history with score
    if (gameState === "results" && gameData) {
      saveGameToHistory(gameData, "completed", score);
    }

    return score;
  };

  // Timer effect for countdown
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    // Only run timer if game is in playing state and timer is enabled
    if (gameState === "playing" && timerEnabled) {
      // Set up interval to countdown
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          // If time is up, end the game
          if (prevTime <= 1) {
            setGameState("results");
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    // Clean up interval on component unmount or state change
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameState, timerEnabled]);

  // Remove the timer reset effect since we want one continuous timer
  // Format the time remaining into minutes:seconds
  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const renderContent = () => {
    if (gameState === "loading") {
      return (
        <div className="flex min-h-full flex-col items-center justify-center p-6">
          <div className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <div className="text-xl">Loading game...</div>
          </div>
        </div>
      );
    }

    if (gameState === "error") {
      return (
        <div className="flex min-h-full flex-col items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <div className="text-red-600 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-3">Failed to Load Game</h2>
            <p className="mb-6">{errorMessage}</p>
            <Link
              href="/"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Home
            </Link>
          </div>
        </div>
      );
    }

    if (gameState === "ready" && gameData) {
      // Check if game data has the expected structure
      if (
        !gameData.questions ||
        !Array.isArray(gameData.questions) ||
        gameData.questions.length === 0
      ) {
        return (
          <div className="flex min-h-full flex-col items-center justify-center p-6">
            <div className="max-w-md w-full text-center">
              <div className="text-yellow-600 text-5xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold mb-3">Game Data Issue</h2>
              <p className="mb-6">
                The game data appears to be invalid or empty. Please try
                uploading your PDF again.
              </p>
              <Link
                href="/upload"
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Upload PDF
              </Link>
            </div>
          </div>
        );
      }

      return (
        <div className="flex min-h-full flex-col items-center p-6 md:p-24">
          <div className="max-w-3xl w-full flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {gameData.name}
            </h1>
            <p className="text-xl mb-8">Ready to test your DECA knowledge?</p>

            <div className="mb-8">
              <p className="text-lg mb-2">
                This game contains {gameData.questions.length} questions
              </p>
              {timerEnabled ? (
                <p>
                  You&apos;ll have {gameData.questions.length}{" "}
                  {gameData.questions.length === 1 ? "minute" : "minutes"} to
                  complete all questions. Good luck!
                </p>
              ) : (
                <p>Take your time to answer each question correctly.</p>
              )}
            </div>

            <button
              onClick={startGame}
              className="px-8 py-3 bg-blue-600 text-white rounded-md text-lg hover:bg-blue-700 transition-colors"
            >
              Start Game
            </button>
          </div>
        </div>
      );
    }

    if (gameState === "playing" && gameData) {
      const currentQuestion = gameData.questions[currentQuestionIndex];

      if (!currentQuestion) {
        return (
          <div className="flex min-h-full flex-col items-center justify-center p-6">
            <div className="text-xl text-red-600">
              Question data not available. Please try again.
            </div>
            <button
              onClick={() => setGameState("ready")}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md"
            >
              Go Back
            </button>
          </div>
        );
      }

      const isFlagged = flaggedQuestions.has(currentQuestion.id);

      return (
        <div className="flex min-h-full flex-col items-center p-4 sm:p-6 md:p-24">
          <div className="max-w-3xl w-full">
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm sm:text-lg font-medium">
                Question {currentQuestionIndex + 1} of{" "}
                {gameData.questions.length}
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => toggleFlagQuestion(currentQuestion.id)}
                  className={`p-1.5 sm:p-2 rounded-full transition-colors ${
                    isFlagged
                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  title={
                    isFlagged ? "Unflag this question" : "Flag this question"
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={isFlagged ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                    <line x1="4" y1="22" x2="4" y2="15"></line>
                  </svg>
                </button>
                {timerEnabled && (
                  <div
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
                      timeRemaining <= 10
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {formatTimeRemaining()}
                  </div>
                )}
              </div>
            </div>

            {/* Combined Minimalistic Progress and Navigation */}
            <div className="mb-6 sm:mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-xs sm:text-sm font-medium">
                  Question {currentQuestionIndex + 1} of{" "}
                  {gameData.questions.length}
                </span>
                <span className="text-xs sm:text-sm text-[var(--foreground)] opacity-70">
                  {Object.keys(selectedAnswers).length} answered
                </span>
              </div>

              <div className="flex w-full gap-0.5 sm:gap-1">
                {gameData.questions.map((question, index) => {
                  const isAnswered = !!selectedAnswers[question.id];
                  const isCurrent = index === currentQuestionIndex;
                  const isQuestionFlagged = flaggedQuestions.has(question.id);

                  let buttonClass =
                    "h-1.5 sm:h-2 transition-all rounded-sm flex-1 ";

                  if (isCurrent && isQuestionFlagged) {
                    buttonClass += "bg-yellow-500";
                  } else if (isCurrent) {
                    buttonClass += "bg-blue-600";
                  } else if (isQuestionFlagged) {
                    buttonClass += "bg-yellow-400";
                  } else if (isAnswered) {
                    buttonClass += "bg-green-500";
                  } else {
                    buttonClass += "bg-gray-300";
                  }

                  return (
                    <button
                      key={question.id}
                      onClick={() => navigateToQuestion(index)}
                      className={buttonClass}
                      aria-label={`Go to question ${index + 1}`}
                    />
                  );
                })}
              </div>
            </div>

            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl md:text-2xl font-medium mb-4 sm:mb-6">
                {currentQuestion.text}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {currentQuestion.options.map((option) => {
                  const isSelected =
                    selectedAnswers[currentQuestion.id] === option.label;

                  return (
                    <button
                      key={option.id}
                      onClick={() =>
                        selectAnswer(currentQuestion.id, option.label)
                      }
                      className={`p-3 sm:p-4 border rounded-lg text-left transition-colors ${
                        isSelected
                          ? "border-blue-500 bg-blue-600 text-white"
                          : "bg-gray-50 hover:border-blue-300 text-gray-800 hover:bg-gray-100 active:bg-blue-50 active:border-blue-200"
                      }`}
                    >
                      <span className="font-bold mr-2">{option.label}.</span>
                      {option.text}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Simplified Navigation Buttons */}
            <div className="flex justify-between mt-6 sm:mt-8">
              <Button
                onClick={() => navigateToQuestion(currentQuestionIndex - 1)}
                disabled={currentQuestionIndex === 0}
                variant="outline"
                className="px-2 sm:px-4 text-sm sm:text-base"
              >
                ← Previous
              </Button>

              {Object.keys(selectedAnswers).length ===
                gameData.questions.length && (
                <Button
                  onClick={() => setGameState("results")}
                  variant="primary"
                  className="px-3 sm:px-5 text-sm sm:text-base"
                >
                  Finish Quiz
                </Button>
              )}

              <Button
                onClick={() => navigateToQuestion(currentQuestionIndex + 1)}
                disabled={
                  currentQuestionIndex === gameData.questions.length - 1
                }
                variant="outline"
                className="px-2 sm:px-4 text-sm sm:text-base"
              >
                Next →
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (gameState === "results") {
      const score = calculateScore();
      const totalQuestions = gameData?.questions.length || 0;
      const percentage = Math.round((score / totalQuestions) * 100);

      return (
        <div className="flex min-h-full flex-col items-center p-4 sm:p-6 md:p-24">
          <div className="max-w-3xl w-full flex flex-col items-center text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Game Results
            </h1>

            <div className="text-4xl sm:text-5xl font-bold mb-3 sm:mb-4 text-blue-600">
              {score} / {totalQuestions}
            </div>

            <div className="text-xl sm:text-2xl mb-6 sm:mb-8">
              You scored {percentage}%
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 w-full sm:w-auto justify-center">
              <Button
                onClick={() => setGameState("review")}
                variant="primary"
                className="px-5 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base w-full sm:w-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                </svg>
                Review Answers
              </Button>

              <Button
                href="/"
                variant="outline"
                className="px-5 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base w-full sm:w-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (gameState === "review" && gameData) {
      const score = calculateScore();
      const totalQuestions = gameData.questions.length;
      const percentage = Math.round((score / totalQuestions) * 100);

      return (
        <div className="flex min-h-full flex-col items-center p-4 sm:p-6 md:p-24">
          <div className="max-w-4xl w-full">
            <div className="mb-6 sm:mb-8 text-center">
              <h1 className="text-2xl sm:text-3xl font-semibold">
                Review <span className="text-[var(--accent)]">Answers</span>
              </h1>
              <p className="mt-2 text-[var(--foreground)] opacity-70 text-sm sm:text-base">
                You scored {score} out of {totalQuestions} ({percentage}%)
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
              {gameData.questions.map((question, index) => {
                const selectedAnswer = selectedAnswers[question.id];
                const isCorrect = selectedAnswer === question.correctAnswer;
                const isFlagged = flaggedQuestions.has(question.id);

                return (
                  <Card
                    key={question.id}
                    className={`overflow-hidden animate-fade-in ${
                      isFlagged ? "border-yellow-400 border-2" : ""
                    }`}
                  >
                    <CardHeader className="p-3 sm:p-4">
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <CardTitle className="flex items-center text-base sm:text-lg">
                          <span className="mr-2 text-[var(--accent)]">
                            {index + 1}.
                          </span>
                          {question.text}
                          {isFlagged && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="ml-2 text-yellow-500"
                            >
                              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                              <line x1="4" y1="22" x2="4" y2="15"></line>
                            </svg>
                          )}
                        </CardTitle>
                        {isCorrect ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 whitespace-nowrap">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-1"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            Correct
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 whitespace-nowrap">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-1"
                            >
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                            Incorrect
                          </span>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="p-3 sm:p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-5">
                        {question.options.map((option) => {
                          const isSelected = selectedAnswer === option.label;
                          const isCorrectOption =
                            option.label === question.correctAnswer;

                          let optionClass =
                            "border-[var(--card-border)] bg-[var(--card-bg)]";
                          let iconElement = null;

                          if (isSelected && isCorrect) {
                            optionClass =
                              "bg-green-100 border-green-500 text-green-800 dark:bg-green-900 dark:text-green-200 dark:border-green-600";
                            iconElement = (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="ml-auto"
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            );
                          } else if (isSelected && !isCorrect) {
                            optionClass =
                              "bg-red-100 border-red-500 text-red-800 dark:bg-red-900 dark:text-red-200 dark:border-red-600";
                            iconElement = (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="ml-auto"
                              >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            );
                          } else if (isCorrectOption) {
                            optionClass =
                              "bg-green-50 border-green-300 text-green-800 dark:bg-green-900/30 dark:text-green-200 dark:border-green-800";
                            iconElement = (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="ml-auto opacity-70"
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            );
                          }

                          return (
                            <div
                              key={option.id}
                              className={`p-2.5 sm:p-4 border rounded-lg transition-all flex items-center text-sm sm:text-base ${optionClass}`}
                            >
                              <div className="mr-2 flex-1">
                                <span className="font-bold mr-2 text-[var(--accent)]">
                                  {option.label}.
                                </span>
                                {option.text}
                              </div>
                              {iconElement}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>

                    <CardFooter className="bg-[var(--card-bg)] border-t border-[var(--card-border)] p-3 sm:p-4">
                      <div>
                        <h4 className="text-[var(--accent)] font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                          Explanation:
                        </h4>
                        <p className="text-[var(--foreground)] opacity-90 text-sm sm:text-base">
                          {question.explanation}
                        </p>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            <div className="flex justify-center mt-8 sm:mt-12">
              <Button
                href="/"
                variant="primary"
                className="px-5 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header title={gameData?.name || "DECA Game"} />
      <div className="flex-1">{renderContent()}</div>
    </div>
  );
}
