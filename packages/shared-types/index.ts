export type GamePhase = 'LOGIN' | 'WAITING' | 'VOTING_TEAM' | 'VOTING_DIGIMER' | 'TRIVIA' | 'TRANSITION' | 'WATERING' | 'FINAL';

export interface SessionState {
  phase: GamePhase;
  currentQuestion: number;
  timer: number;
  treeStage: number;
  totalWater: number;
}

export interface UserState {
  id: string;
  name: string;
  division: string;
  collectedWater: number;
  contributedWater: number;
  votes: {
    team: string | null;
    digimer: string | null;
  };
}

export interface SocketEvents {
  // Client -> Server
  JOIN: 'join';
  VOTE: 'vote';
  ANSWER: 'answer';
  WATER_TAP: 'water_tap';
  
  // Server -> Client
  SESSION_STATE: 'session_state';
  USER_STATE: 'user_state';
  REJECT_JOIN: 'reject_join';
}
