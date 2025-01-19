import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Users, Plus, LogIn } from 'lucide-react';

interface LobbyProps {
  onCreateGame: (playerName: string) => void;
  onJoinGame: (gameId: string, playerName: string) => void;
}

export const Lobby: React.FC<LobbyProps> = ({ onCreateGame, onJoinGame }) => {
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [view, setView] = useState<'join' | 'create'>('join');

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Murder Mystery</h1>
          <p className="mt-2 text-gray-600">Join an existing game or create a new one</p>
        </div>

        {/* Player Name Input */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Name
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
          />
        </div>

        {/* Toggle Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setView('join')}
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2
              ${view === 'join' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300'}`}
          >
            <LogIn className="w-5 h-5" />
            Join Game
          </button>
          <button
            onClick={() => setView('create')}
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2
              ${view === 'create' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300'}`}
          >
            <Plus className="w-5 h-5" />
            Create Game
          </button>
        </div>

        {/* Join Game Form */}
        {view === 'join' && (
          <div className="bg-white shadow-sm rounded-lg p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Game Code
            </label>
            <input
              type="text"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter game code"
            />
            <button
              onClick={() => onJoinGame(gameId, playerName)}
              disabled={!gameId || !playerName}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300"
            >
              Join Game
            </button>
          </div>
        )}

        {/* Create Game Form */}
        {view === 'create' && (
          <div className="bg-white shadow-sm rounded-lg p-6">
            <button
              onClick={() => onCreateGame(playerName)}
              disabled={!playerName}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300"
            >
              Create New Game
            </button>
            <p className="text-sm text-gray-500 text-center mt-4">
              A unique game code will be generated for others to join
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
