"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

interface Game {
  id: string;
  name: string;
  lastPlayed: string;
  questionCount: number;
  status: "started" | "completed";
  score?: number;
}

export default function MyGames() {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [showQuestionModal, setShowQuestionModal] = useState(false);

  useEffect(() => {
    // Load games from localStorage
    if (typeof window !== "undefined") {
      try {
        const gamesHistoryJson = localStorage.getItem("deca_games_history");

        if (gamesHistoryJson) {
          const gameHistory = JSON.parse(gamesHistoryJson);
          // Sort games by lastPlayed date (most recent first)
          const sortedGames = gameHistory.sort(
            (a: Game, b: Game) =>
              new Date(b.lastPlayed).getTime() -
              new Date(a.lastPlayed).getTime()
          );
          setGames(sortedGames);
        }
      } catch (error) {
        console.error("Error loading game history:", error);
      }

      setLoading(false);
    }
  }, []);

  const deleteGame = (id: string) => {
    // Remove the game from the state
    setGames(games.filter((game) => game.id !== id));

    // Also remove it from localStorage
    if (typeof window !== "undefined") {
      try {
        const gamesHistoryJson = localStorage.getItem("deca_games_history");
        if (gamesHistoryJson) {
          const gameHistory = JSON.parse(gamesHistoryJson);
          const updatedHistory = gameHistory.filter(
            (game: Game) => game.id !== id
          );
          localStorage.setItem(
            "deca_games_history",
            JSON.stringify(updatedHistory)
          );
        }
      } catch (error) {
        console.error("Error deleting game from history:", error);
      }
    }
  };

  // Open the question count modal
  const handleReplay = (game: Game) => {
    setSelectedGame(game);
    setQuestionCount(10); // Default to 10
    setShowQuestionModal(true);
  };

  // Start the game with selected question count
  const startGame = () => {
    if (selectedGame) {
      router.push(`/play/${selectedGame.id}?count=${questionCount}`);
    }
    setShowQuestionModal(false);
  };

  // Get available question count options based on total questions
  const getQuestionOptions = (totalQuestions: number) => {
    // Always show these options
    const defaultOptions = [10, 25, 50, 100];

    // Make sure we have at least a couple of options
    if (totalQuestions < 25) {
      // For games with fewer questions, show 5, 10, and all
      return [
        Math.min(5, totalQuestions),
        Math.min(10, totalQuestions),
        ...(totalQuestions > 10 ? [totalQuestions] : []),
      ].filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
    }

    // For larger games, filter standard options
    return defaultOptions.filter((count) => count <= totalQuestions);
  };

  // Format date to more readable format
  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="My Games" />

      <main className="flex-1 flex flex-col items-center p-6 md:p-24">
        <div className="max-w-4xl w-full">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold md:hidden">
              My Games
            </h1>

            <div className="md:ml-auto">
              <Link
                href="/upload"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create New Game
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-pulse">Loading your games...</div>
            </div>
          ) : games.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-xl mb-4">You don&apos;t have any games yet</p>
              <Link href="/upload" className="text-blue-600 hover:underline">
                Upload a practice test to get started
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="border rounded-lg p-5 flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div className="mb-4 md:mb-0">
                    <h2 className="text-xl font-semibold">{game.name}</h2>
                    <div className="text-sm text-gray-500">
                      Played: {formatDate(game.lastPlayed)} •{" "}
                      {game.questionCount} questions
                    </div>
                    {game.status === "completed" &&
                      game.score !== undefined && (
                        <div className="mt-1 text-sm">
                          <span className="font-medium">Score: </span>
                          <span
                            className={
                              game.score / game.questionCount >= 0.7
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {game.score} / {game.questionCount} (
                            {Math.round(
                              (game.score / game.questionCount) * 100
                            )}
                            %)
                          </span>
                        </div>
                      )}
                    {game.status === "started" && (
                      <div className="mt-1 text-sm text-amber-600">
                        In progress
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    {game.status === "completed" ? (
                      <button
                        onClick={() => handleReplay(game)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Replay
                      </button>
                    ) : (
                      <Link
                        href={`/play/${game.id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center"
                      >
                        Continue
                      </Link>
                    )}

                    <button
                      onClick={() => deleteGame(game.id)}
                      className="px-4 py-2 border text-red-600 border-red-200 rounded-md hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Question Count Modal */}
      {showQuestionModal && selectedGame && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            {/* X button to close modal */}
            <button
              onClick={() => setShowQuestionModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-xl font-bold mb-4">Select Question Count</h2>
            <p className="mb-4">
              How many questions would you like to include?
            </p>

            <div className="mb-6">
              <div className="grid grid-cols-2 gap-3">
                {getQuestionOptions(selectedGame.questionCount).map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setQuestionCount(count)}
                    className={`py-3 px-4 border rounded-md ${
                      questionCount === count
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    {count} Questions
                  </button>
                ))}

                {/* Show "All Questions" option if total questions doesn't match any preset */}
                {!getQuestionOptions(selectedGame.questionCount).includes(
                  selectedGame.questionCount
                ) && (
                  <button
                    type="button"
                    onClick={() => setQuestionCount(selectedGame.questionCount)}
                    className={`py-3 px-4 border rounded-md ${
                      questionCount === selectedGame.questionCount
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    All ({selectedGame.questionCount})
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowQuestionModal(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={startGame}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Start Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
