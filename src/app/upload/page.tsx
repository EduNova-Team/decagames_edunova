"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import Header from "@/components/Header";

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
        <div className="w-full mb-6">
          <h3 className="text-lg font-medium mb-2">Processing PDF...</h3>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${processingProgress}%` }}
            ></div>
          </div>
          <div className="mt-2 text-sm text-gray-600 flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600"
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
          <p className="mt-1 text-xs text-gray-500">
            This might take a few moments depending on the size of the PDF
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Upload Practice Test" />

      <main className="flex-1 flex flex-col items-center p-6 md:p-24">
        <div className="max-w-3xl w-full flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 md:hidden">
            Upload Practice Test
          </h1>

          <div className="w-full mb-8">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400"
              } ${
                processingStatus === "processing"
                  ? "opacity-50 pointer-events-none"
                  : ""
              }`}
            >
              <input {...getInputProps()} />
              {file ? (
                <div>
                  <p className="text-lg font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="mt-2 text-sm text-red-600 hover:underline"
                    disabled={processingStatus === "processing"}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-lg">
                    Drag & drop your DECA practice test PDF here
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    or click to select a file
                  </p>
                </div>
              )}
            </div>

            {error && <div className="mt-3 text-red-600 text-sm">{error}</div>}
          </div>

          {renderProcessingStatus()}

          <div className="w-full mb-6">
            <h2 className="text-lg font-medium mb-3">Number of Questions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {questionCountOptions.map((count) => (
                <button
                  key={count}
                  onClick={() => setQuestionCount(count)}
                  disabled={processingStatus === "processing"}
                  className={`py-2 px-4 border rounded-md transition-all ${
                    questionCount === count
                      ? "bg-blue-600 text-white border-blue-600"
                      : "hover:border-blue-300"
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
          </div>

          <div className="w-full mb-6">
            <h2 className="text-lg font-medium mb-3">Game Options</h2>
            <div className="flex items-center border rounded-md p-4 hover:border-blue-300 transition-all">
              <input
                type="checkbox"
                id="timerToggle"
                checked={timerEnabled}
                onChange={(e) => setTimerEnabled(e.target.checked)}
                disabled={processingStatus === "processing"}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="timerToggle" className="ml-2 text-sm font-medium">
                Enable timer (1 minute per question total)
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <Link
              href="/"
              className={`px-6 py-2 border rounded-md hover:bg-gray-50 ${
                processingStatus === "processing"
                  ? "opacity-50 pointer-events-none"
                  : ""
              }`}
            >
              Cancel
            </Link>

            <button
              onClick={handleUpload}
              disabled={!file || processingStatus === "processing"}
              className={`px-6 py-2 rounded-md flex items-center ${
                !file || processingStatus === "processing"
                  ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {processingStatus === "processing" ? (
                <>Processing...</>
              ) : (
                <>Create Game</>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
