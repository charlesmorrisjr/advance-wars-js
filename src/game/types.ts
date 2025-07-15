export interface Position {
  x: number;
  y: number;
}

export enum UnitType {
  Infantry = 'infantry',
  Mech = 'mech',
  Tank = 'tank',
  Artillery = 'artillery'
}

export enum TerrainType {
  Plain = 'plain',
  Road = 'road',
  River = 'river',
  Mountain = 'mountain',
  Forest = 'forest',
  City = 'city',
  Base = 'base',
  HQ = 'hq'
}

export enum Player {
  Player1 = 'player1',
  Player2 = 'player2'
}

export interface Unit {
  id: string;
  type: UnitType;
  owner: Player;
  position: Position;
  hp: number;
  maxHp: number;
  hasMoved: boolean;
  hasAttacked: boolean;
}

export interface Terrain {
  type: TerrainType;
  defenseStars: number;
  movementCost: number;
  owner?: Player;
}

export interface GameBoard {
  width: number;
  height: number;
  terrain: Terrain[][];
  units: Map<string, Unit>;
}

export interface GameState {
  board: GameBoard;
  currentPlayer: Player;
  turnNumber: number;
  phase: 'move' | 'attack' | 'end';
  selectedUnit?: string;
  gameStatus: 'playing' | 'player1_wins' | 'player2_wins';
  funds: Record<Player, number>;
}