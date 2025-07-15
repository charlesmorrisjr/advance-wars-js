import Phaser from 'phaser';
import { SpriteManager } from './SpriteManager';
import { GameStateManager } from '../game/GameState';
import { MapRenderer } from './MapRenderer';
import { UnitRenderer } from './UnitRenderer';
import { InputHandler } from './InputHandler';

export default class GameScene extends Phaser.Scene {
  private spriteManager!: SpriteManager;
  public gameState!: GameStateManager;
  private mapRenderer!: MapRenderer;
  private unitRenderer!: UnitRenderer;
  public inputHandler!: InputHandler;
  private turnDisplayText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.spriteManager = new SpriteManager(this);
    this.spriteManager.loadSpritesheets();
  }

  create() {
    this.spriteManager.createSpritesheets();
    this.gameState = new GameStateManager();
    this.mapRenderer = new MapRenderer(this, this.gameState, this.spriteManager);
    this.unitRenderer = new UnitRenderer(this, this.gameState, this.spriteManager, this.mapRenderer);

    this.add.text(400, 20, 'Advance Wars JS - Phase 1', {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.turnDisplayText = this.add.text(400, 50, this.getTurnDisplayString(), {
      fontSize: '14px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Initialize input handling
    this.inputHandler = new InputHandler(this, this.gameState, this.mapRenderer, this.unitRenderer);

    // Render the game map and units
    this.mapRenderer.renderMap();
    this.unitRenderer.renderUnits();

    // Add game instructions
    this.add.text(50, 500, 'Controls:\n- Click units to select\n- Click empty tile to move\n- SPACE: End turn\n- ESC: Deselect', {
      fontSize: '12px',
      color: '#ffffff'
    });

    console.log('GameScene created successfully');
    console.log('Map parts texture loaded:', this.textures.exists('map_parts'));
    console.log('Map units texture loaded:', this.textures.exists('map_units'));
    console.log('Game state initialized:', this.gameState.getState());
    console.log('Units on board:', Array.from(this.gameState.getState().board.units.values()));
  }

  private getTurnDisplayString(): string {
    const state = this.gameState.getState();
    return `Current Player: ${state.currentPlayer} | Turn: ${state.turnNumber}`;
  }

  public updateTurnDisplay(): void {
    this.turnDisplayText.setText(this.getTurnDisplayString());
  }

  update() {
    
  }
}