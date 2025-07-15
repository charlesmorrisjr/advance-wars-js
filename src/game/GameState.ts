import { GameState, GameBoard, Unit, Position, Player, UnitType, TerrainType, Terrain } from './types';
import { TERRAIN_DATA } from '../data/terrainData';
import { UNIT_DATA } from '../data/unitData';

export class GameStateManager {
  private state: GameState;

  constructor() {
    this.state = this.initializeGame();
  }

  private initializeGame(): GameState {
    const board = this.createBoard(10, 10);
    return {
      board,
      currentPlayer: Player.Player1,
      turnNumber: 1,
      phase: 'move',
      gameStatus: 'playing',
      funds: {
        [Player.Player1]: 10000,
        [Player.Player2]: 10000
      }
    };
  }

  private createBoard(width: number, height: number): GameBoard {
    const terrain: Terrain[][] = [];
    
    for (let y = 0; y < height; y++) {
      terrain[y] = [];
      for (let x = 0; x < width; x++) {
        let terrainType = TerrainType.Plain;
        
        if (y === 0 && x === 0) terrainType = TerrainType.HQ;
        else if (y === height - 1 && x === width - 1) terrainType = TerrainType.HQ;
        else if ((x + y) % 5 === 0) terrainType = TerrainType.City;
        else if ((x + y) % 3 === 0) terrainType = TerrainType.Forest;
        else if (y === Math.floor(height / 2)) terrainType = TerrainType.Road;
        
        terrain[y][x] = {
          type: terrainType,
          defenseStars: TERRAIN_DATA[terrainType].defenseStars,
          movementCost: TERRAIN_DATA[terrainType].movementCost[UnitType.Infantry],
          owner: terrainType === TerrainType.HQ ? 
            (y === 0 ? Player.Player1 : Player.Player2) : undefined
        };
      }
    }

    const units = new Map<string, Unit>();
    
    this.addUnit(units, 'p1_infantry_1', UnitType.Infantry, Player.Player1, { x: 1, y: 0 });
    this.addUnit(units, 'p1_tank_1', UnitType.Tank, Player.Player1, { x: 2, y: 0 });
    
    this.addUnit(units, 'p2_infantry_1', UnitType.Infantry, Player.Player2, { x: width - 2, y: height - 1 });
    this.addUnit(units, 'p2_tank_1', UnitType.Tank, Player.Player2, { x: width - 3, y: height - 1 });

    return {
      width,
      height,
      terrain,
      units
    };
  }

  private addUnit(units: Map<string, Unit>, id: string, type: UnitType, owner: Player, position: Position) {
    const unitStats = UNIT_DATA[type];
    units.set(id, {
      id,
      type,
      owner,
      position,
      hp: unitStats.maxHp,
      maxHp: unitStats.maxHp,
      hasMoved: false,
      hasAttacked: false
    });
  }


  getState(): GameState {
    return this.state;
  }

  getUnitAt(position: Position): Unit | undefined {
    for (const unit of this.state.board.units.values()) {
      if (unit.position.x === position.x && unit.position.y === position.y) {
        return unit;
      }
    }
    return undefined;
  }

  getTerrainAt(position: Position): Terrain | undefined {
    if (position.x < 0 || position.x >= this.state.board.width ||
        position.y < 0 || position.y >= this.state.board.height) {
      return undefined;
    }
    return this.state.board.terrain[position.y][position.x];
  }

  selectUnit(unitId: string): boolean {
    const unit = this.state.board.units.get(unitId);
    if (!unit || unit.owner !== this.state.currentPlayer) {
      return false;
    }
    
    this.state.selectedUnit = unitId;
    return true;
  }

  moveUnit(unitId: string, newPosition: Position): boolean {
    const unit = this.state.board.units.get(unitId);
    if (!unit || unit.owner !== this.state.currentPlayer || unit.hasMoved) {
      return false;
    }

    if (this.getUnitAt(newPosition)) {
      return false;
    }

    const terrain = this.getTerrainAt(newPosition);
    if (!terrain) {
      return false;
    }

    unit.position = newPosition;
    unit.hasMoved = true;
    
    return true;
  }

  endTurn(): void {
    this.resetUnitsForTurn();
    this.state.currentPlayer = this.state.currentPlayer === Player.Player1 ? Player.Player2 : Player.Player1;
    this.state.turnNumber++;
    this.state.selectedUnit = undefined;
    this.state.phase = 'move';
  }

  private resetUnitsForTurn(): void {
    for (const unit of this.state.board.units.values()) {
      if (unit.owner === this.state.currentPlayer) {
        unit.hasMoved = false;
        unit.hasAttacked = false;
      }
    }
  }
}