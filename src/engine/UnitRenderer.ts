import Phaser from 'phaser';
import { GameStateManager } from '../game/GameState';
import { SpriteManager } from './SpriteManager';
import { MapRenderer } from './MapRenderer';
import { UNIT_DATA } from '../data/unitData';
import { Unit, Player } from '../game/types';

export class UnitRenderer {
  private scene: Phaser.Scene;
  private gameState: GameStateManager;
  private spriteManager: SpriteManager;
  private mapRenderer: MapRenderer;
  private unitSprites: Map<string, Phaser.GameObjects.Container> = new Map();
  private readonly SCALE = 2;

  constructor(scene: Phaser.Scene, gameState: GameStateManager, spriteManager: SpriteManager, mapRenderer: MapRenderer) {
    this.scene = scene;
    this.gameState = gameState;
    this.spriteManager = spriteManager;
    this.mapRenderer = mapRenderer;
  }

  renderUnits(): void {
    // Clear existing unit sprites
    this.clearUnits();

    const state = this.gameState.getState();
    
    // Render all units
    for (const unit of state.board.units.values()) {
      this.createUnitSprite(unit);
    }
  }

  private createUnitSprite(unit: Unit): void {
    const unitData = UNIT_DATA[unit.type];
    const worldPos = this.mapRenderer.getWorldPosition(unit.position.x, unit.position.y);
    
    // Create container for unit (allows for future additions like health bars, animations)
    const container = this.scene.add.container(worldPos.x, worldPos.y);
    
    // Calculate sprite position based on player (different colors/teams)
    const spriteRow = unitData.spriteRow + (unit.owner === Player.Player2 ? 1 : 0);
    const spriteKey = this.spriteManager.getUnitSprite(spriteRow, unitData.spriteCol);
    
    // Create the unit sprite
    const unitSprite = this.scene.add.image(0, 0, 'map_units', spriteKey);
    unitSprite.setDisplaySize(16 * this.SCALE, 16 * this.SCALE);
    unitSprite.setOrigin(0, 0);
    
    // Add HP indicator (if unit is damaged)
    if (unit.hp < unit.maxHp) {
      const hpText = this.scene.add.text(2, -8, unit.hp.toString(), {
        fontSize: '10px',
        color: '#ff0000',
        backgroundColor: '#ffffff',
        padding: { x: 2, y: 1 }
      });
      hpText.setOrigin(0, 0);
      container.add(hpText);
    }
    
    // Add moved/attacked indicators
    if (unit.hasMoved || unit.hasAttacked) {
      unitSprite.setTint(0x888888); // Gray out used units
    }
    
    container.add(unitSprite);
    this.unitSprites.set(unit.id, container);
  }

  private clearUnits(): void {
    for (const container of this.unitSprites.values()) {
      container.destroy();
    }
    this.unitSprites.clear();
  }

  updateUnitPosition(unitId: string): void {
    const unit = this.gameState.getState().board.units.get(unitId);
    const container = this.unitSprites.get(unitId);
    
    if (unit && container) {
      const worldPos = this.mapRenderer.getWorldPosition(unit.position.x, unit.position.y);
      container.setPosition(worldPos.x, worldPos.y);
    }
  }

  highlightUnit(unitId: string, color: number = 0x00ff00): void {
    const container = this.unitSprites.get(unitId);
    if (container) {
      const unitSprite = container.getAt(container.length - 1) as Phaser.GameObjects.Image;
      if (unitSprite) {
        unitSprite.setTint(color);
      }
    }
  }

  clearUnitHighlight(unitId: string): void {
    const container = this.unitSprites.get(unitId);
    const unit = this.gameState.getState().board.units.get(unitId);
    
    if (container && unit) {
      const unitSprite = container.getAt(container.length - 1) as Phaser.GameObjects.Image;
      if (unitSprite) {
        // Reset tint based on unit status
        if (unit.hasMoved || unit.hasAttacked) {
          unitSprite.setTint(0x888888);
        } else {
          unitSprite.clearTint();
        }
      }
    }
  }

  getUnitAt(worldX: number, worldY: number): string | null {
    const gridPos = this.mapRenderer.getGridPosition(worldX, worldY);
    const unit = this.gameState.getUnitAt(gridPos);
    return unit ? unit.id : null;
  }

  animateUnitMovement(unitId: string, targetX: number, targetY: number, duration: number = 300): Promise<void> {
    const container = this.unitSprites.get(unitId);
    if (!container) {
      return Promise.resolve();
    }

    const worldPos = this.mapRenderer.getWorldPosition(targetX, targetY);
    
    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: container,
        x: worldPos.x,
        y: worldPos.y,
        duration: duration,
        ease: 'Power2',
        onComplete: () => resolve()
      });
    });
  }
}