export type Lobby = {
  code: string;
  players: Array<{ id: string; nickname: string }>;
  state: unknown; // Game state, can be refined later
};
