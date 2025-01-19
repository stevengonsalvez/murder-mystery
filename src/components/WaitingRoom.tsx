import React from 'react';
import { Clock, Users, Copy, Share2 } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  ready: boolean;
}

interface WaitingRoomProps {
  gameId: string;
  players: Player[];
  minPlayers: number;
  maxPlayers: number;
  onStart: () => void;
  isHost: boolean;
}

export const WaitingRoom: React.FC<WaitingRoomProps> = ({
  gameId,
  players,
  minPlayers,
  maxPlayers,
  onStart,
  isHost
}) => {
  const copyGameCode = () => {
    navigator.clipboard.writeText(gameId);
  };

  const shareGame = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join Murder Mystery Game',
        text: `Join my murder mystery game with code: ${gameId}`,
        url: window.location.href
      });
    } else {
      copyGameCode();
    }
  };

  const canStart = players.length >= minPlayers && players.every(p => p.ready);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Game Lobby</h1>
            <p className="mt-2 text-gray-600">Waiting for players to join...</p>
          </div>

          {/* Game Code */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium text-gray-500">Game Code</h2>
                <p className="text-2xl font-bold font-mono">{gameId}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyGameCode}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Copy game code"
                >
                  <Copy className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={shareGame}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Share game"
                >
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Player List */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Players ({players.length}/{maxPlayers})
            </h2>
            <div className="space-y-2">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                >
                  <span className="font-medium">{player.name}</span>
                  <span
                    className={`px-2 py-1 text-sm rounded-full ${
                      player.ready
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {player.ready ? 'Ready' : 'Not Ready'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Start Game Button */}
          {isHost && (
            <div>
              <button
                onClick={onStart}
                disabled={!canStart}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300"
              >
                {!canStart 
                  ? `Waiting for ${minPlayers - players.length} more players...`
                  : 'Start Game'}
              </button>
              <p className="text-sm text-gray-500 text-center mt-2">
                {minPlayers} players minimum required to start
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
