import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { gameConfig } from '../engine/GameConfig';

const GameBoard: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (parentRef.current && !gameRef.current) {
      const config = {
        ...gameConfig,
        parent: parentRef.current,
      };
      
      gameRef.current = new Phaser.Game(config);
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={parentRef} 
      style={{ 
        width: '800px', 
        height: '600px', 
        margin: '0 auto',
        border: '2px solid #444',
        borderRadius: '8px'
      }} 
    />
  );
};

export default GameBoard;