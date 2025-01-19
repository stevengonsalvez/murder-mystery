import React, { useState } from 'react';
import { GameInterface } from './components/GameInterface';
import { GameCoordinator } from './services/gameCoordinator';

// Initialize game coordinator with API key from environment
const coordinator = new GameCoordinator(import.meta.env.VITE_ANTHROPIC_API_KEY);

function App() {
  // In a real app, this would come from authentication
  const [playerId] = useState('player1');

  return (
    <div className="min-h-screen bg-gray-100">
      <GameInterface
        gameCoordinator={coordinator}
        playerId={playerId}
      />
    </div>
  );
}

export default App;