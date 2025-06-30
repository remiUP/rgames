import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";

const Lobby = () => {
  const [players, setPlayers] = useState<{ id: string; nickname: string }[]>(
    []
  );
  const [lobbyCode, setLobbyCode] = useState("");
  const navigate = useNavigate();
  const { socket } = useSocket();

  useEffect(() => {
    const code = localStorage.getItem("lobbyCode") || "";
    const nick = localStorage.getItem("nickname") || "";
    setLobbyCode(code);
    if (!code || !nick) {
      navigate("/");
      return;
    }
    socket?.on("playerJoined", (player: { id: string; nickname: string }) => {
      console.log("Player joined:", player);
      if (players.some((p) => p.id === player.id)) {
        return;
      }
      setPlayers((prev) => [...prev, player]);
    });

    return () => {
      socket?.off("playerJoined");
    };
  }, [socket, navigate]);

  useEffect(() => {
    const code = localStorage.getItem("lobbyCode") || "";
    if (code) {
      socket?.emit(
        "fetchPlayers",
        code,
        (players: { id: string; nickname: string }[]) => {
          console.log("Fetched players:", players);
          setPlayers(players);
        }
      );
    } else {
      navigate("/");
    }
  }, [socket, navigate]);

  console.log("Lobby players:", players);
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
                {p.id === players[0]?.id && (
                  <span className="ml-2 text-xs text-yellow-500">(Host)</span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="text-center mb-4 text-gray-500">
          Waiting for players to join...
        </div>
        {/* Host-only Start Game button will go here */}
      </div>
      <footer className="mt-8 text-gray-400 text-sm">
        Share the code with friends to join!
      </footer>
    </div>
  );
};
export default Lobby;
