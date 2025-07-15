import Phaser from 'phaser';
import { GameStateManager } from '../game/GameState';
import { MapRenderer } from './MapRenderer';
import { UnitRenderer } from './UnitRenderer';
import { Position, UnitType } from '../game/types';
import { UNIT_DATA } from '../data/unitData';

export class InputHandler {
  private scene: Phaser.Scene;
  private gameState: GameStateManager;
  private mapRenderer: MapRenderer;
  private unitRenderer: UnitRenderer;
  private selectedUnitId: string | null = null;
  private movementHighlights: Phaser.GameObjects.Graphics[] = [];

  constructor(scene: Phaser.Scene, gameState: GameStateManager, mapRenderer: MapRenderer, unitRenderer: UnitRenderer) {
    this.scene = scene;
    this.gameState = gameState;
    this.mapRenderer = mapRenderer;
    this.unitRenderer = unitRenderer;
    
    this.setupInputHandlers();
  }

  private setupInputHandlers(): void {
    // Handle mouse clicks
    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.handleClick(pointer.x, pointer.y);
    });

    // Handle keyboard input for ending turns
    this.scene.input.keyboard?.on('keydown-SPACE', () => {
      this.endTurn();
    });

    this.scene.input.keyboard?.on('keydown-ESC', () => {
      this.clearSelection();
    });
  }

  private handleClick(x: number, y: number): void {
    const gridPos = this.mapRenderer.getGridPosition(x, y);
    const state = this.gameState.getState();
    
    // Check if click is within board bounds
    if (gridPos.x < 0 || gridPos.x >= state.board.width || 
        gridPos.y < 0 || gridPos.y >= state.board.height) {
      return;
    }

    const clickedUnit = this.gameState.getUnitAt(gridPos);

    if (this.selectedUnitId) {
      // A unit is already selected
      if (clickedUnit && clickedUnit.id === this.selectedUnitId) {
        // Clicked on the same unit - deselect
        this.clearSelection();
      } else if (clickedUnit && clickedUnit.owner === state.currentPlayer) {
        // Clicked on another friendly unit - select it
        this.selectUnit(clickedUnit.id);
      } else {
        // Clicked on empty space or enemy unit - try to move
        this.attemptMove(gridPos);
      }
    } else {
      // No unit selected
      if (clickedUnit && clickedUnit.owner === state.currentPlayer) {
        // Clicked on friendly unit - select it
        this.selectUnit(clickedUnit.id);
      }
    }
  }

  private selectUnit(unitId: string): void {
    this.clearSelection();
    
    const unit = this.gameState.getState().board.units.get(unitId);
    if (!unit || unit.owner !== this.gameState.getState().currentPlayer) {
      return;
    }

    this.selectedUnitId = unitId;
    this.unitRenderer.highlightUnit(unitId, 0x00ff00); // Green highlight
    
    // Show possible moves if unit hasn't moved yet
    if (!unit.hasMoved) {
      this.showMovementRange(unit.position, this.getUnitMovementRange(unit.type));
    }

    console.log(`Selected unit: ${unit.type} at (${unit.position.x}, ${unit.position.y})`);
  }

  private clearSelection(): void {
    if (this.selectedUnitId) {
      this.unitRenderer.clearUnitHighlight(this.selectedUnitId);
      this.selectedUnitId = null;
    }
    this.clearMovementHighlights();
  }

  private attemptMove(targetPos: Position): void {
    if (!this.selectedUnitId) return;

    const unit = this.gameState.getState().board.units.get(this.selectedUnitId);
    if (!unit || unit.hasMoved) {
      console.log('Unit cannot move (already moved or not found)');
      return;
    }

    // Check if target position is within movement range
    const movementRange = this.getUnitMovementRange(unit.type);
    const distance = Math.abs(targetPos.x - unit.position.x) + Math.abs(targetPos.y - unit.position.y);
    
    if (distance > movementRange) {
      console.log(`Target too far (distance: ${distance}, range: ${movementRange})`);
      return;
    }

    // Attempt to move the unit
    const success = this.gameState.moveUnit(this.selectedUnitId, targetPos);
    if (success) {
      console.log(`Moved unit to (${targetPos.x}, ${targetPos.y})`);
      
      // Animate the movement
      this.unitRenderer.animateUnitMovement(this.selectedUnitId, targetPos.x, targetPos.y)
        .then(() => {
          this.unitRenderer.updateUnitPosition(this.selectedUnitId!);
          this.clearSelection();
        });
    } else {
      console.log('Move failed (invalid target or occupied)');
    }
  }

  private showMovementRange(position: Position, range: number): void {
    this.clearMovementHighlights();
    
    // Show all tiles within movement range
    for (let dx = -range; dx <= range; dx++) {
      for (let dy = -range; dy <= range; dy++) {
        const distance = Math.abs(dx) + Math.abs(dy);
        if (distance > 0 && distance <= range) {
          const targetX = position.x + dx;
          const targetY = position.y + dy;
          
          // Check if position is valid and not occupied
          const terrain = this.gameState.getTerrainAt({ x: targetX, y: targetY });
          const occupiedUnit = this.gameState.getUnitAt({ x: targetX, y: targetY });
          
          if (terrain && !occupiedUnit) {
            const highlight = this.mapRenderer.highlightTile(targetX, targetY, 0x0088ff, 0.3);
            if (highlight) {
              this.movementHighlights.push(highlight);
            }
          }
        }
      }
    }
  }

  private clearMovementHighlights(): void {
    for (const highlight of this.movementHighlights) {
      highlight.destroy();
    }
    this.movementHighlights = [];
  }

  private getUnitMovementRange(unitType: UnitType): number {
    return UNIT_DATA[unitType].movement;
  }

  private endTurn(): void {
    this.clearSelection();
    this.gameState.endTurn();
    
    const state = this.gameState.getState();
    console.log(`Turn ended. Now ${state.currentPlayer}'s turn (Turn ${state.turnNumber})`);
    
    // Update UI or trigger any turn change events here
    this.updateTurnDisplay();
  }

  private updateTurnDisplay(): void {
    // This would update the UI to show current player
    // For now, we'll just log it
    const state = this.gameState.getState();
    console.log(`Current Player: ${state.currentPlayer}, Turn: ${state.turnNumber}`);
  }

  getSelectedUnit(): string | null {
    return this.selectedUnitId;
  }
}