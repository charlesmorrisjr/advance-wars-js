import { TerrainType, UnitType } from '../game/types';

export interface TerrainStats {
  type: TerrainType;
  defenseStars: number;
  movementCost: Record<UnitType, number>;
  income: number;
  capturable: boolean;
  spriteKey: string;
}

export const TERRAIN_DATA: Record<TerrainType, TerrainStats> = {
  [TerrainType.Plain]: {
    type: TerrainType.Plain,
    defenseStars: 1,
    movementCost: {
      [UnitType.Infantry]: 1,
      [UnitType.Mech]: 1,
      [UnitType.Tank]: 1,
      [UnitType.Artillery]: 1
    },
    income: 0,
    capturable: false,
    spriteKey: 'terrain_plains'
  },
  
  [TerrainType.Road]: {
    type: TerrainType.Road,
    defenseStars: 0,
    movementCost: {
      [UnitType.Infantry]: 1,
      [UnitType.Mech]: 1,
      [UnitType.Tank]: 1,
      [UnitType.Artillery]: 1
    },
    income: 0,
    capturable: false,
    spriteKey: 'terrain_plains'
  },
  
  [TerrainType.River]: {
    type: TerrainType.River,
    defenseStars: 0,
    movementCost: {
      [UnitType.Infantry]: 2,
      [UnitType.Mech]: 2,
      [UnitType.Tank]: 999, // Can't cross
      [UnitType.Artillery]: 999
    },
    income: 0,
    capturable: false,
    spriteKey: 'terrain_plains'
  },
  
  [TerrainType.Forest]: {
    type: TerrainType.Forest,
    defenseStars: 2,
    movementCost: {
      [UnitType.Infantry]: 1,
      [UnitType.Mech]: 1,
      [UnitType.Tank]: 2,
      [UnitType.Artillery]: 2
    },
    income: 0,
    capturable: false,
    spriteKey: 'terrain_forest'
  },
  
  [TerrainType.Mountain]: {
    type: TerrainType.Mountain,
    defenseStars: 4,
    movementCost: {
      [UnitType.Infantry]: 2,
      [UnitType.Mech]: 2,
      [UnitType.Tank]: 999, // Can't cross
      [UnitType.Artillery]: 999
    },
    income: 0,
    capturable: false,
    spriteKey: 'terrain_mountain'
  },
  
  [TerrainType.City]: {
    type: TerrainType.City,
    defenseStars: 3,
    movementCost: {
      [UnitType.Infantry]: 1,
      [UnitType.Mech]: 1,
      [UnitType.Tank]: 1,
      [UnitType.Artillery]: 1
    },
    income: 1000,
    capturable: true,
    spriteKey: 'terrain_plains'
  },
  
  [TerrainType.Base]: {
    type: TerrainType.Base,
    defenseStars: 3,
    movementCost: {
      [UnitType.Infantry]: 1,
      [UnitType.Mech]: 1,
      [UnitType.Tank]: 1,
      [UnitType.Artillery]: 1
    },
    income: 1000,
    capturable: true,
    spriteKey: 'terrain_plains'
  },
  
  [TerrainType.HQ]: {
    type: TerrainType.HQ,
    defenseStars: 4,
    movementCost: {
      [UnitType.Infantry]: 1,
      [UnitType.Mech]: 1,
      [UnitType.Tank]: 1,
      [UnitType.Artillery]: 1
    },
    income: 1000,
    capturable: true,
    spriteKey: 'terrain_plains'
  }
};