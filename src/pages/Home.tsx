import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";

const Home = () => {
  const [nickname, setNickname] = useState("");
  const [lobbyCode, setLobbyCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { socket, isConnected } = useSocket();
  // Placeholder handlers
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    console.log("Creating lobby with nickname:", nickname);
    if (socket == null || !isConnected) {
      setError("Socket connection is not established. Please try again later.");
      return;
    }
    console.log(socket);
    socket.emit("createLobby", nickname, (response: { code: string }) => {
      console.log("Lobby created:", response);
      if (response.code) {
        localStorage.setItem("lobbyCode", response.code);
        localStorage.setItem("nickname", nickname);
        navigate(`/lobby/${response.code}`);
      } else {
        setError("Failed to create lobby. Please try again.");
      }
    });
  };
  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    console.log(
      "Joining lobby with code:",
      lobbyCode,
      "and nickname:",
      nickname
    );
    if (socket == null || !isConnected) {
      setError("Socket connection is not established. Please try again later.");
      return;
    }
    socket.emit(
      "joinLobby",
      lobbyCode,
      nickname,
      (response: { success: boolean; error?: string }) => {
        console.log("Join response:", response);
        if (response.success) {
          localStorage.setItem("lobbyCode", lobbyCode);
          localStorage.setItem("nickname", nickname);
          navigate(`/lobby/${lobbyCode}`);
        } else {
          setError(
            response.error ||
              "Failed to join lobby. Please check the code and try again."
          );
        }
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-purple-700">
          Guess Who's Clueless?
        </h1>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        <form onSubmit={handleCreate} className="flex flex-col gap-4 mb-4">
          <input
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            type="text"
            placeholder="Enter your nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={16}
            required
          />
          <button
            type="submit"
            className="bg-purple-600 text-white rounded py-2 font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!nickname}
          >
            Create Lobby
          </button>
        </form>
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300" />
          <span className="mx-2 text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-300" />
        </div>
        <form onSubmit={handleJoin} className="flex flex-col gap-4">
          <input
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            placeholder="Enter lobby code"
            value={lobbyCode}
            onChange={(e) => setLobbyCode(e.target.value.toUpperCase())}
            maxLength={8}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!nickname || !lobbyCode}
          >
            Join Lobby
          </button>
        </form>
      </div>
      <footer className="mt-8 text-gray-400 text-sm">
        Play with friends on Discord. No account needed!
      </footer>
    </div>
  );
};
export default Home;
