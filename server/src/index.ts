import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Lobby, Player } from "../../DTO";

const app = express();
const server = createServer();
const lobbies: Record<string, Lobby> = {};

const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this to your frontend URL in production
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
    // Clean up lobbies if necessary
    for (const code in lobbies) {
      const lobby = lobbies[code];
      lobby.players = lobby.players.filter((p) => p.id !== socket.id);
      if (lobby.players.length === 0) {
        delete lobbies[code]; // Remove empty lobbies
      } else {
        io.to(code).emit("playerLeft", socket.id);
      }
    }
  });

  socket.on("createLobby", (nickname: string, callback) => {
    console.log(
      `Client ${socket.id} creating lobby with nickname: ${nickname}`
    );
    const code = generateLobbyCode();
    const lobby: Lobby = {
      code,
      players: [{ id: socket.id, nickname, isHost: true }],
      state: {},
    };
    lobbies[code] = lobby;
    socket.join(code);
    callback({ code });
    console.log(lobbies);
    io.to(code).emit("playerJoined", { code, players: lobby.players });
  });

  socket.on("joinLobby", (code: string, nickname: string, callback) => {
    console.log(`Client ${socket.id} joining lobby: ${code}`);
    console.log(lobbies);
    const lobby = lobbies[code];
    if (lobby) {
      const player: Player = { id: socket.id, nickname, isHost: false };
      lobby.players.push(player);
      callback({ success: true, error: null });
      socket.join(code);
      io.to(code).emit("playerJoined", player);
    } else {
      callback({ success: false, error: "Lobby not found" });
      console.log(`Lobby ${code} not found for client ${socket.id}`);
    }
  });

  socket.on("fetchPlayers", (code: string, callback) => {
    console.log(`Client ${socket.id} fetching players for lobby: ${code}`);
    const lobby = lobbies[code];
    if (lobby) {
      callback(lobby.players);
      console.log(`Players fetched for lobby ${code}:`, lobby.players);
    } else {
      callback([]);
      console.log(`Lobby ${code} not found for client ${socket.id}`);
    }
  });

  socket.on("leaveLobby", (code: string) => {
    console.log(`Client ${socket.id} leaving lobby: ${code}`);
    const lobby = lobbies[code];
    if (lobby) {
      lobby.players = lobby.players.filter((p) => p.id !== socket.id);
      socket.leave(code);
      io.to(code).emit("playerLeft", socket.id);
    }
  });

  socket.on("startGame", (code: string, callback) => {
    console.log(`Client ${socket.id} starting game in lobby: ${code}`);
    const lobby = lobbies[code];
    if (lobby && lobby.players.length > 1) {
      // Game can start only if there are at least 2 players
      io.to(code).emit("gameStarted");
      callback({ success: true });
    } else {
      callback({
        success: false,
        error: "Not enough players to start the game",
      });
    }
  });

  socket.on("game-message", (code: string, message: unknown) => {
    console.log(`Client ${socket.id} sending message to lobby: ${code}`);
    const lobby = lobbies[code];
    if (lobby) {
      io.to(code).emit("game-message", message);
    }
  });
});

function generateLobbyCode(length = 4) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  if (lobbies[code]) {
    return generateLobbyCode();
  }
  return code;
}

app.post("/create-lobby", (req, res) => {
  const code = generateLobbyCode();
  const lobby: Lobby = {
    code,
    players: [],
    state: {},
  };
  lobbies[code] = lobby;
  res.json({ code });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
