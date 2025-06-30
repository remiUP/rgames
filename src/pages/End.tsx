const scores = [
  { nickname: "Alice", score: 7 },
  { nickname: "Bob", score: 5 },
  { nickname: "Charlie", score: 3 },
];

const End = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-yellow-200">
    <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
      <h2 className="text-3xl font-bold text-purple-700 mb-4">Game Over!</h2>
      <h3 className="text-xl font-semibold mb-6">Final Scores</h3>
      <ul className="mb-6">
        {scores.map((p, i) => (
          <li
            key={p.nickname}
            className={`flex justify-between items-center px-4 py-2 rounded ${
              i === 0
                ? "bg-yellow-200 font-bold text-yellow-800"
                : "bg-gray-100"
            }`}
          >
            <span>{p.nickname}</span>
            <span>{p.score} pts</span>
            {i === 0 && (
              <span className="ml-2 text-xs text-yellow-600">🏆 Winner!</span>
            )}
          </li>
        ))}
      </ul>
      <button className="bg-purple-600 text-white rounded py-2 px-6 font-semibold hover:bg-purple-700 transition">
        Play Again
      </button>
    </div>
    <footer className="mt-8 text-gray-400 text-sm">Thanks for playing!</footer>
  </div>
);
export default End;
