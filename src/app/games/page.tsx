"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Card, { CardContent } from "@/components/ui/Card";
import Icon, { IconBox } from "@/components/ui/Icon";

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
    <>
      <Header title="My Games" />

      <main className="flex-1 flex flex-col items-center p-6 md:p-24">
        <div className="max-w-4xl w-full">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-semibold md:hidden">
              <span className="text-[#3B82F6]">My Games</span>
            </h1>

            <div className="md:ml-auto">
              <Button href="/upload" variant="primary">
                <span className="flex items-center">
                  Create New Game{" "}
                  <Icon name="upload" size="sm" className="ml-2" />
                </span>
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 animate-pulse">
              <IconBox color="primary" size="md" className="mx-auto mb-4">
                <svg
                  className="animate-spin h-5 w-5"
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
              </IconBox>
              <p className="text-lg">Loading your games...</p>
            </div>
          ) : games.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <IconBox color="primary" size="lg" className="mx-auto mb-4">
                  <Icon name="play" size="md" />
                </IconBox>
                <p className="text-xl mb-4">
                  You don&apos;t have any games yet
                </p>
                <Button href="/upload" variant="primary">
                  Upload a practice test to get started
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4 animate-fade-in">
              {games.map((game) => (
                <Card
                  key={game.id}
                  className="p-5 hover:shadow-md transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                      <h2 className="text-xl font-semibold">{game.name}</h2>
                      <div className="text-sm opacity-70">
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
                                  ? "text-[var(--secondary)]"
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
                        <Button
                          onClick={() => handleReplay(game)}
                          variant="primary"
                        >
                          Replay
                        </Button>
                      ) : (
                        <Button href={`/play/${game.id}`} variant="primary">
                          Continue
                        </Button>
                      )}

                      <Button
                        onClick={() => deleteGame(game.id)}
                        variant="outline"
                        className="text-red-600 hover:border-red-200 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Question Count Modal */}
      <Modal
        isOpen={showQuestionModal && !!selectedGame}
        onClose={() => setShowQuestionModal(false)}
        title="Select Question Count"
      >
        <p className="mb-6 opacity-80">
          How many questions would you like to include?
        </p>

        <div className="mb-8">
          <div className="grid grid-cols-2 gap-3">
            {selectedGame &&
              getQuestionOptions(selectedGame.questionCount).map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  className={`py-3 px-4 border rounded-md transition-all ${
                    questionCount === count
                      ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                      : "hover:border-[var(--accent)] hover:border-opacity-50"
                  }`}
                >
                  {count} Questions
                </button>
              ))}

            {/* Show "All Questions" option if total questions doesn't match any preset */}
            {selectedGame &&
              !getQuestionOptions(selectedGame.questionCount).includes(
                selectedGame.questionCount
              ) && (
                <button
                  type="button"
                  onClick={() => setQuestionCount(selectedGame.questionCount)}
                  className={`py-3 px-4 border rounded-md transition-all ${
                    questionCount === selectedGame.questionCount
                      ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                      : "hover:border-[var(--accent)] hover:border-opacity-50"
                  }`}
                >
                  All ({selectedGame.questionCount})
                </button>
              )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button onClick={() => setShowQuestionModal(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={startGame} variant="primary">
            Start Game
          </Button>
        </div>
      </Modal>
    </>
  );
}
