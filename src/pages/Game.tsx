import React, { useState } from "react";

const prompt = {
  category: "Animal",
  prompt:
    "What animal would you pick to be on your side in case of a zombie apocalypse?",
};

const Game = () => {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-pink-200">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold text-center text-pink-700 mb-2">
          Category: {prompt.category}
        </h2>
        <p className="text-center text-lg mb-6">{prompt.prompt}</p>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              type="text"
              placeholder="Your answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              maxLength={40}
              required
            />
            <button
              type="submit"
              className="bg-pink-600 text-white rounded py-2 font-semibold hover:bg-pink-700 transition"
              disabled={!answer}
            >
              Submit
            </button>
          </form>
        ) : (
          <div className="text-center text-gray-500">
            Waiting for other players to submit...
          </div>
        )}
      </div>
      <footer className="mt-8 text-gray-400 text-sm">
        Think carefully before you answer!
      </footer>
    </div>
  );
};
export default Game;
