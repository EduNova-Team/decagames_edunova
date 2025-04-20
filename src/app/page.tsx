import Link from "next/link";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center p-6 md:p-24">
        <div className="max-w-5xl w-full flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to <span className="text-blue-600">DECA Games</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Transform your DECA practice tests into interactive learning games
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            <Link
              href="/upload"
              className="p-6 border rounded-lg shadow-md text-center hover:shadow-lg transition-all hover:border-blue-500"
            >
              <h2 className="text-2xl font-semibold mb-3">Upload PDF &rarr;</h2>
              <p>
                Upload your DECA practice test and convert it to an interactive
                game
              </p>
            </Link>

            <Link
              href="/games"
              className="p-6 border rounded-lg shadow-md text-center hover:shadow-lg transition-all hover:border-blue-500"
            >
              <h2 className="text-2xl font-semibold mb-3">My Games &rarr;</h2>
              <p>Access your previously created practice games</p>
            </Link>
          </div>

          <div className="mt-12 p-6 border rounded-lg shadow-md max-w-2xl w-full">
            <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
            <ol className="text-left space-y-3">
              <li className="flex items-start">
                <span className="mr-2 font-bold">1.</span> Upload your DECA
                practice test PDF
              </li>
              <li className="flex items-start">
                <span className="mr-2 font-bold">2.</span> Our system processes
                the PDF, extracting questions and answers
              </li>
              <li className="flex items-start">
                <span className="mr-2 font-bold">3.</span> Play interactive
                games with the content in Kahoot/Quizlet style
              </li>
              <li className="flex items-start">
                <span className="mr-2 font-bold">4.</span> Review your answers
                with the original explanations
              </li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}
