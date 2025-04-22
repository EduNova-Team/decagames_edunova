"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import Header from "@/components/Header";
import Button from "@/components/ui/Button";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Icon, { IconBox } from "@/components/ui/Icon";

// PDF processing statuses
type ProcessingStatus = "idle" | "processing" | "success" | "error";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [processingStatus, setProcessingStatus] =
    useState<ProcessingStatus>("idle");
  const [processingProgress, setProcessingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [timerEnabled, setTimerEnabled] = useState<boolean>(false);
  const router = useRouter();

  const onDrop = (acceptedFiles: File[]) => {
    setError(null);
    const uploadedFile = acceptedFiles[0];

    if (uploadedFile && uploadedFile.type !== "application/pdf") {
      setError("Only PDF files are supported");
      return;
    }

    setFile(uploadedFile);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  const handleUpload = useCallback(async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setProcessingStatus("processing");
    setProcessingProgress(0);
    setError(null);

    // Start progress animation
    const progressInterval = setInterval(() => {
      setProcessingProgress((prev) => {
        const newProgress = prev + 2;
        if (newProgress >= 90) {
          return 90; // Hold at 90% until we get actual response
        }
        return newProgress;
      });
    }, 100);

    try {
      const formData = new FormData();
      formData.append("pdf", file);
      formData.append("questionCount", questionCount.toString());
      formData.append("timerEnabled", timerEnabled.toString());

      // Send the PDF to our API for processing
      const response = await fetch("/api/process-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process PDF");
      }

      // Get the gameId from the response
      const data = await response.json();

      clearInterval(progressInterval);
      setProcessingProgress(100);
      setProcessingStatus("success");

      // Redirect to the game page after a short delay
      setTimeout(() => {
        router.push(
          `/play/${data.gameId}?count=${questionCount}&timer=${
            timerEnabled ? "true" : "false"
          }`
        );
      }, 500);
    } catch (error) {
      clearInterval(progressInterval);
      setError(
        error instanceof Error ? error.message : "Failed to process the PDF"
      );
      setProcessingStatus("error");
    }
  }, [file, router, questionCount, timerEnabled]);

  const questionCountOptions = [10, 25, 50, 100];

  const renderProcessingStatus = () => {
    if (processingStatus === "processing") {
      return (
        <div className="w-full mb-6 animate-fade-in">
          <h3 className="text-lg font-medium mb-2">Processing PDF...</h3>
          <div className="w-full bg-[var(--card-border)] rounded-full h-2.5">
            <div
              className="bg-[var(--accent)] h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${processingProgress}%` }}
            ></div>
          </div>
          <div className="mt-3 text-sm opacity-80 flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-[var(--accent)]"
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
            Extracting questions, answers and explanations
          </div>
          <p className="mt-1 text-xs opacity-60">
            This might take a few moments depending on the size of the PDF
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <Header title="Upload Practice Test" />

      <main className="flex-1 flex flex-col items-center p-6 md:p-24">
        <div className="max-w-3xl w-full flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-semibold mb-8 md:hidden">
            <span className="text-[#3B82F6]">Upload Practice Test</span>
          </h1>

          <Card className="w-full mb-8 p-0 overflow-hidden">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                isDragActive
                  ? "border-[var(--accent)] bg-[var(--accent)] bg-opacity-5"
                  : "border-[var(--card-border)] hover:border-[var(--accent)] hover:border-opacity-50"
              } ${
                processingStatus === "processing"
                  ? "opacity-50 pointer-events-none"
                  : ""
              }`}
            >
              <input {...getInputProps()} />
              {file ? (
                <div className="animate-fade-in">
                  <IconBox color="primary" size="md" className="mx-auto mb-3">
                    <Icon name="upload" size="md" />
                  </IconBox>
                  <p className="text-lg font-medium">{file.name}</p>
                  <p className="text-sm opacity-70 mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="mt-3 text-sm text-red-600 hover:underline inline-flex items-center"
                    disabled={processingStatus === "processing"}
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
                      className="mr-1"
                    >
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    Remove
                  </button>
                </div>
              ) : (
                <div className="py-6">
                  <div className="relative mx-auto mb-4 w-24 h-24">
                    <div className="bg-[var(--accent)] rounded-full w-full h-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                    </div>
                  </div>
                  <p className="text-xl font-medium mb-2">
                    Drag & drop your DECA practice test PDF here
                  </p>
                  <p className="opacity-70 mt-1">or click to select a file</p>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-3 text-red-600 text-sm p-3 bg-red-50 rounded-lg flex items-center">
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
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {error}
              </div>
            )}
          </Card>

          {renderProcessingStatus()}

          <Card animate={processingStatus === "idle"} className="w-full mb-6">
            <CardHeader>
              <CardTitle>Number of Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {questionCountOptions.map((count) => (
                  <button
                    key={count}
                    onClick={() => setQuestionCount(count)}
                    disabled={processingStatus === "processing"}
                    className={`py-3 px-4 border rounded-md transition-all ${
                      questionCount === count
                        ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                        : "hover:border-[var(--accent)] hover:border-opacity-50"
                    } ${
                      processingStatus === "processing"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {count} Questions
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card animate className="w-full mb-8">
            <CardHeader>
              <CardTitle>Game Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center border rounded-md p-4 hover:border-[var(--accent)] hover:border-opacity-50 transition-all">
                <input
                  type="checkbox"
                  id="timerToggle"
                  checked={timerEnabled}
                  onChange={(e) => setTimerEnabled(e.target.checked)}
                  disabled={processingStatus === "processing"}
                  className="w-5 h-5 text-[var(--accent)] rounded focus:ring-[var(--accent)]"
                />
                <label htmlFor="timerToggle" className="ml-3 font-medium">
                  Enable timer (1 minute per question total)
                </label>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              href="/"
              variant="outline"
              disabled={processingStatus === "processing"}
            >
              Cancel
            </Button>

            <Button
              onClick={handleUpload}
              disabled={!file || processingStatus === "processing"}
              variant={
                !file || processingStatus === "processing"
                  ? "outline"
                  : "primary"
              }
            >
              {processingStatus === "processing" ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
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
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  Create Game{" "}
                  <Icon name="arrowRight" size="sm" className="ml-2" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
