import { UnitType } from '../game/types';

export interface UnitStats {
  type: UnitType;
  cost: number;
  maxHp: number;
  movement: number;
  attackRange: [number, number]; // [min, max]
  vision: number;
  attackPower: Record<UnitType, number>;
  defensePower: Record<UnitType, number>;
  spriteRow: number;
  spriteCol: number;
}

export const UNIT_DATA: Record<UnitType, UnitStats> = {
  [UnitType.Infantry]: {
    type: UnitType.Infantry,
    cost: 1000,
    maxHp: 10,
    movement: 3,
    attackRange: [1, 1],
    vision: 2,
    attackPower: {
      [UnitType.Infantry]: 55,
      [UnitType.Mech]: 45,
      [UnitType.Tank]: 5,
      [UnitType.Artillery]: 15
    },
    defensePower: {
      [UnitType.Infantry]: 55,
      [UnitType.Mech]: 45,
      [UnitType.Tank]: 1,
      [UnitType.Artillery]: 10
    },
    spriteRow: 0,
    spriteCol: 0
  },
  
  [UnitType.Mech]: {
    type: UnitType.Mech,
    cost: 3000,
    maxHp: 10,
    movement: 2,
    attackRange: [1, 1],
    vision: 2,
    attackPower: {
      [UnitType.Infantry]: 65,
      [UnitType.Mech]: 55,
      [UnitType.Tank]: 15,
      [UnitType.Artillery]: 25
    },
    defensePower: {
      [UnitType.Infantry]: 55,
      [UnitType.Mech]: 55,
      [UnitType.Tank]: 5,
      [UnitType.Artillery]: 10
    },
    spriteRow: 0,
    spriteCol: 1
  },
  
  [UnitType.Tank]: {
    type: UnitType.Tank,
    cost: 7000,
    maxHp: 10,
    movement: 6,
    attackRange: [1, 1],
    vision: 3,
    attackPower: {
      [UnitType.Infantry]: 75,
      [UnitType.Mech]: 70,
      [UnitType.Tank]: 55,
      [UnitType.Artillery]: 70
    },
    defensePower: {
      [UnitType.Infantry]: 70,
      [UnitType.Mech]: 65,
      [UnitType.Tank]: 55,
      [UnitType.Artillery]: 50
    },
    spriteRow: 0,
    spriteCol: 2
  },
  
  [UnitType.Artillery]: {
    type: UnitType.Artillery,
    cost: 6000,
    maxHp: 10,
    movement: 5,
    attackRange: [2, 3],
    vision: 1,
    attackPower: {
      [UnitType.Infantry]: 90,
      [UnitType.Mech]: 85,
      [UnitType.Tank]: 70,
      [UnitType.Artillery]: 75
    },
    defensePower: {
      [UnitType.Infantry]: 50,
      [UnitType.Mech]: 45,
      [UnitType.Tank]: 45,
      [UnitType.Artillery]: 55
    },
    spriteRow: 0,
    spriteCol: 3
  }
};