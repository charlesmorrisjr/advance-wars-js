import Phaser from 'phaser';

export class SpriteManager {
  private scene: Phaser.Scene;
  private readonly TILE_SIZE = 16;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  loadSpritesheets() {
    // Load individual terrain sprites
    this.scene.load.image('terrain_plains', '/plains.png');
    this.scene.load.image('terrain_forest', '/forest.png');
    this.scene.load.image('terrain_mountain', '/mountain_base.png');
    
    // Keep unit spritesheet
    this.scene.load.image('map_units', '/Map_units.webp');
  }

  createSpritesheets() {
    // Check that individual terrain sprites are loaded
    const terrainSpritesLoaded = this.scene.textures.exists('terrain_plains') &&
                                this.scene.textures.exists('terrain_forest') &&
                                this.scene.textures.exists('terrain_mountain');
    
    if (!terrainSpritesLoaded || !this.scene.textures.exists('map_units')) {
      console.error('Sprites not loaded properly');
      return;
    }

    // Only need to create unit spritesheet frames
    this.createMapUnitsSpritesheet();
    
    console.log('Individual terrain sprites loaded: plains, forest, mountain');
  }


  private createMapUnitsSpritesheet() {
    const texture = this.scene.textures.get('map_units');
    const width = texture.source[0].width;
    const height = texture.source[0].height;
    
    const columns = Math.floor(width / this.TILE_SIZE);
    const rows = Math.floor(height / this.TILE_SIZE);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const frameKey = `unit_${row}_${col}`;
        texture.add(frameKey, 0, col * this.TILE_SIZE, row * this.TILE_SIZE, this.TILE_SIZE, this.TILE_SIZE);
      }
    }

    console.log(`Created ${rows * columns} unit sprites (${columns}x${rows})`);
  }

  getTerrainSprite(spriteKey: string): string {
    return spriteKey;
  }

  getUnitSprite(row: number, col: number): string {
    return `unit_${row}_${col}`;
  }
}