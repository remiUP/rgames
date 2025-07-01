export type Player = {
  id: string;
  nickname: string;
  isHost: boolean;
};

export type Lobby = {
  code: string;
  players: Array<Player>;
  state: unknown; // Game state, can be refined later
};
