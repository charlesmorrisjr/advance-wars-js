import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { gameConfig } from '../engine/GameConfig';

const GameBoard: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const [currentPlayer, setCurrentPlayer] = useState('Red');
  const [turnNumber, setTurnNumber] = useState(1);

  useEffect(() => {
    if (parentRef.current && !gameRef.current) {
      const config = {
        ...gameConfig,
        parent: parentRef.current,
      };
      
      gameRef.current = new Phaser.Game(config);
      
      // Wait for the game to fully load, then initialize UI state
      gameRef.current.events.once('ready', () => {
        setTimeout(() => {
          const scene = gameRef.current?.scene.getScene('GameScene');
          if (scene && scene.scene.isActive()) {
            const gameState = (scene as any).gameState;
            if (gameState) {
              const state = gameState.getState();
              setCurrentPlayer(state.currentPlayer);
              setTurnNumber(state.turnNumber);
            }
          }
        }, 100);
      });
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  const handleEndTurn = () => {
    if (gameRef.current) {
      const scene = gameRef.current.scene.getScene('GameScene');
      if (scene && scene.scene.isActive()) {
        // Access the input handler through the scene's data
        const inputHandler = (scene as any).inputHandler;
        if (inputHandler && typeof inputHandler.endTurn === 'function') {
          inputHandler.endTurn();
          
          // Update local state for UI display
          const gameState = (scene as any).gameState;
          if (gameState) {
            const state = gameState.getState();
            setCurrentPlayer(state.currentPlayer);
            setTurnNumber(state.turnNumber);
          }
        }
      }
    }
  };


  return (
    <div className="game-container">
      <div className="mobile-ui-panel">
        <div className="game-info">
          <span className="current-player">Player: {currentPlayer}</span>
          <span className="turn-number">Turn: {turnNumber}</span>
        </div>
        <div className="mobile-controls">
          <button 
            className="mobile-button end-turn-button"
            onClick={handleEndTurn}
            type="button"
          >
            End Turn
          </button>
        </div>
      </div>
      
      <div 
        ref={parentRef} 
        className="game-canvas"
      />
      
      <div className="mobile-instructions">
        <p>Tap units to select • Tap tiles to move • Tap empty areas to deselect</p>
      </div>
    </div>
  );
};

export default GameBoard;