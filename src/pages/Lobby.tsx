import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Player } from "../../DTO";
import { useSocket } from "../contexts/SocketContext";

const Lobby = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [lobbyCode, setLobbyCode] = useState("");
  const navigate = useNavigate();
  const { socket } = useSocket();

  const fetchPlayers = (code: string) => {
    socket?.emit("fetchPlayers", code, (players: Player[]) => {
      console.log("Fetched players:", players);
      setPlayers(players);
    });
  };

  const handleStartGame = () => {
    socket?.emit("startGame", lobbyCode, (response: { success: boolean }) => {
      if (response.success) {
        navigate(`/game/${lobbyCode}`);
      } else {
        console.error("Failed to start game");
      }
    });
  };

  useEffect(() => {
    if (!socket) return;
    const code = localStorage.getItem("lobbyCode") || "";
    const nick = localStorage.getItem("nickname") || "";
    setLobbyCode(code);
    if (!code || !nick) {
      navigate("/");
      return;
    }

    fetchPlayers(code);

    socket.on("playerJoined", (player: Player) => {
      setPlayers((prev) => [...prev, player]);
    });

    socket.on("playerLeft", (playerId: string) => {
      setPlayers((prev) => prev.filter((p) => p.id !== playerId));
    });

    socket.on("gameStarted", () => {
      const code = localStorage.getItem("lobbyCode");
      if (!code) {
        console.error("Lobby code not found in localStorage");
        return;
      }
      console.log("Game started, navigating to game page");
      console.log("Lobby code:", code);
      navigate(`/game/${code}`);
    });

    return () => {
      socket.off("playerJoined");
      socket.off("playerLeft");
      socket.off("gameStarted");
    };
  }, [socket, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-blue-200">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-2">
          Lobby
        </h2>
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="font-mono text-lg tracking-widest bg-blue-100 px-3 py-1 rounded">
            {lobbyCode}
          </span>
          <button
            className="text-xs text-blue-500 hover:underline"
            onClick={() => navigator.clipboard.writeText(lobbyCode)}
          >
            Copy
          </button>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Players:</h3>
          <ul className="space-y-1">
            {players.map((p) => (
              <li key={p.id} className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
                <span className="font-medium">{p.nickname}</span>
                {p?.isHost && (
                  <span className="ml-2 text-xs text-yellow-500">(Host)</span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="text-center mb-4 text-gray-500">
          Waiting for players to join...
        </div>
        {players.find(
          (p) =>
            p.isHost &&
            localStorage.getItem("nickname") === p.nickname &&
            players.length > 1
        ) && (
          <button
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            onClick={handleStartGame}
          >
            Start Game
          </button>
        )}
      </div>
      <footer className="mt-8 text-gray-400 text-sm">
        Share the code with friends to join!
      </footer>
    </div>
  );
};
export default Lobby;
