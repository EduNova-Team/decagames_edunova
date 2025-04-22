import Link from "next/link";
import Header from "@/components/Header";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center p-6 md:p-24">
        <div className="max-w-5xl w-full flex flex-col items-center text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-semibold mb-6">
              Welcome to <span className="text-[#3B82F6]">DECA</span>{" "}
              <span className="text-[#10B981]">Games</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 opacity-80">
              Transform your DECA practice tests into interactive learning games
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl animate-slide-up">
            <Link
              href="/upload"
              className="p-8 border border-[var(--card-border)] rounded-xl bg-[var(--card-bg)] shadow-md text-center card-hover"
            >
              <div className="mb-4 mx-auto bg-[var(--accent)] w-16 h-16 rounded-full flex items-center justify-center text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
              <h2 className="text-2xl font-semibold mb-3">Upload PDF</h2>
              <p className="opacity-70">
                Upload your DECA practice test and convert it to an interactive
                game
              </p>
            </Link>

            <Link
              href="/games"
              className="p-8 border border-[var(--card-border)] rounded-xl bg-[var(--card-bg)] shadow-md text-center card-hover"
            >
              <div className="mb-4 mx-auto bg-[var(--secondary)] w-16 h-16 rounded-full flex items-center justify-center text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-semibold mb-3">My Games</h2>
              <p className="opacity-70">
                Access your previously created practice games
              </p>
            </Link>
          </div>

          <Card animate className="mt-16 p-8 max-w-2xl w-full">
            <CardHeader className="text-center">
              <CardTitle className="text-[#3B82F6] inline-block text-2xl">
                How It Works
              </CardTitle>
            </CardHeader>

            <ol className="text-left space-y-5">
              <li className="flex items-start">
                <span className="mr-4 flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-bold">
                  1
                </span>
                <div>
                  <h3 className="font-medium mb-1">Upload your PDF</h3>
                  <p className="opacity-70">
                    Upload your DECA practice test PDF to our platform
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-4 flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-bold">
                  2
                </span>
                <div>
                  <h3 className="font-medium mb-1">AI Processing</h3>
                  <p className="opacity-70">
                    Our system processes the PDF, extracting questions and
                    answers
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-4 flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-bold">
                  3
                </span>
                <div>
                  <h3 className="font-medium mb-1">Play Games</h3>
                  <p className="opacity-70">
                    Play interactive games with the content in Kahoot/Quizlet
                    style
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-4 flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-bold">
                  4
                </span>
                <div>
                  <h3 className="font-medium mb-1">Review & Learn</h3>
                  <p className="opacity-70">
                    Review your answers with the original explanations
                  </p>
                </div>
              </li>
            </ol>
          </Card>
        </div>
      </main>
    </div>
  );
}
