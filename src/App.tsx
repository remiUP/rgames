import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { SocketProvider } from "./contexts/SocketContext";
import End from "./pages/End";
import Game from "./pages/Game";
import Home from "./pages/Home";
import Lobby from "./pages/Lobby";

function App() {
  return (
    <SocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lobby/:code" element={<Lobby />} />
          <Route path="/game/:code" element={<Game />} />
          <Route path="/end/:code" element={<End />} />
        </Routes>
      </Router>
    </SocketProvider>
  );
}

export default App;
