import Phaser from 'phaser';
import { GameStateManager } from '../game/GameState';
import { SpriteManager } from './SpriteManager';
import { TERRAIN_DATA } from '../data/terrainData';
import { TerrainType } from '../game/types';

export class MapRenderer {
  private scene: Phaser.Scene;
  private gameState: GameStateManager;
  private spriteManager: SpriteManager;
  private readonly TILE_SIZE = 16;
  private readonly SCALE = 2; // Scale up for better visibility
  private readonly CANVAS_WIDTH = 800;
  private readonly CANVAS_HEIGHT = 600;
  private terrainSprites: Phaser.GameObjects.Image[][] = [];

  constructor(scene: Phaser.Scene, gameState: GameStateManager, spriteManager: SpriteManager) {
    this.scene = scene;
    this.gameState = gameState;
    this.spriteManager = spriteManager;
  }

  private calculateMapOffset(): { x: number, y: number } {
    const state = this.gameState.getState();
    const mapPixelWidth = state.board.width * this.TILE_SIZE * this.SCALE;
    const mapPixelHeight = state.board.height * this.TILE_SIZE * this.SCALE;
    
    return {
      x: Math.max(0, (this.CANVAS_WIDTH - mapPixelWidth) / 2),
      y: Math.max(0, (this.CANVAS_HEIGHT - mapPixelHeight) / 2)
    };
  }

  renderMap(): void {
    const state = this.gameState.getState();
    const board = state.board;

    // Clear existing terrain sprites
    this.clearMap();

    // Create new terrain sprites array
    this.terrainSprites = [];
    
    for (let y = 0; y < board.height; y++) {
      this.terrainSprites[y] = [];
      for (let x = 0; x < board.width; x++) {
        const terrain = board.terrain[y][x];
        const sprite = this.createTerrainSprite(x, y, terrain.type);
        this.terrainSprites[y][x] = sprite;
      }
    }
  }

  private createTerrainSprite(x: number, y: number, terrainType: TerrainType): Phaser.GameObjects.Image {
    const terrainData = TERRAIN_DATA[terrainType];
    const spriteKey = this.spriteManager.getTerrainSprite(terrainData.spriteKey);
    const offset = this.calculateMapOffset();
    
    const worldX = x * this.TILE_SIZE * this.SCALE + offset.x;
    const worldY = y * this.TILE_SIZE * this.SCALE + offset.y;
    
    const sprite = this.scene.add.image(worldX, worldY, spriteKey);
    sprite.setDisplaySize(this.TILE_SIZE * this.SCALE, this.TILE_SIZE * this.SCALE);
    sprite.setOrigin(0, 0);
    
    return sprite;
  }

  private clearMap(): void {
    for (let y = 0; y < this.terrainSprites.length; y++) {
      for (let x = 0; x < this.terrainSprites[y].length; x++) {
        if (this.terrainSprites[y][x]) {
          this.terrainSprites[y][x].destroy();
        }
      }
    }
    this.terrainSprites = [];
  }

  getWorldPosition(gridX: number, gridY: number): { x: number; y: number } {
    const offset = this.calculateMapOffset();
    return {
      x: gridX * this.TILE_SIZE * this.SCALE + offset.x,
      y: gridY * this.TILE_SIZE * this.SCALE + offset.y
    };
  }

  getGridPosition(worldX: number, worldY: number): { x: number; y: number } {
    const offset = this.calculateMapOffset();
    return {
      x: Math.floor((worldX - offset.x) / (this.TILE_SIZE * this.SCALE)),
      y: Math.floor((worldY - offset.y) / (this.TILE_SIZE * this.SCALE))
    };
  }

  highlightTile(gridX: number, gridY: number, color: number = 0xffff00, alpha: number = 0.3): Phaser.GameObjects.Graphics | null {
    const state = this.gameState.getState();
    if (gridX < 0 || gridX >= state.board.width || gridY < 0 || gridY >= state.board.height) {
      return null;
    }

    const worldPos = this.getWorldPosition(gridX, gridY);
    const highlight = this.scene.add.graphics();
    highlight.fillStyle(color, alpha);
    highlight.fillRect(worldPos.x, worldPos.y, this.TILE_SIZE * this.SCALE, this.TILE_SIZE * this.SCALE);
    
    return highlight;
  }

  getTileSize(): number {
    return this.TILE_SIZE * this.SCALE;
  }
}