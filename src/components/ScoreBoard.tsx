import React from 'react';
import { Trophy, Star, Search, MessageSquare, Target } from 'lucide-react';

interface PlayerScore {
  playerId: string;
  playerName: string;
  character: {
    name: string;
    occupation: string;
  };
  score: number;
  achievements: Achievement[];
  stats: {
    cluesFound: number;
    questionsAsked: number;
    correctDeductions: number;
    timeSpent: number;
  };
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  timestamp: Date;
}

interface ScoreBoardProps {
  players: PlayerScore[];
  currentPlayerId: string;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ players, currentPlayerId }) => {
  // Sort players by score in descending order
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  // Calculate player rank
  const getPlayerRank = (playerId: string): number => {
    return sortedPlayers.findIndex(p => p.playerId === playerId) + 1;
  };

  // Get rank suffix (1st, 2nd, 3rd, etc.)
  const getRankSuffix = (rank: number): string => {
    if (rank === 1) return 'st';
    if (rank === 2) return 'nd';
    if (rank === 3) return 'rd';
    return 'th';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Scoreboard
        </h2>
      </div>

      {/* Player Rankings */}
      <div className="divide-y">
        {sortedPlayers.map((player) => {
          const rank = getPlayerRank(player.playerId);
          const isCurrentPlayer = player.playerId === currentPlayerId;
          
          return (
            <div 
              key={player.playerId}
              className={`p-4 ${isCurrentPlayer ? 'bg-blue-50' : ''}`}
            >
              {/* Player Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-medium flex items-center gap-2">
                    <span className={`text-lg ${
                      rank === 1 ? 'text-yellow-500' :
                      rank === 2 ? 'text-gray-400' :
                      rank === 3 ? 'text-amber-600' :
                      'text-gray-600'
                    }`}>
                      {rank}{getRankSuffix(rank)}
                    </span>
                    <span>{player.playerName}</span>
                    {isCurrentPlayer && (
                      <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        You
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Playing as {player.character.name} ({player.character.occupation})
                  </div>
                </div>
                <div className="text-xl font-bold text-blue-600">
                  {player.score} pts
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Search className="w-4 h-4" />
                    <span className="text-sm">Clues Found</span>
                  </div>
                  <div className="text-lg font-medium">{player.stats.cluesFound}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">Questions</span>
                  </div>
                  <div className="text-lg font-medium">{player.stats.questionsAsked}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Target className="w-4 h-4" />
                    <span className="text-sm">Deductions</span>
                  </div>
                  <div className="text-lg font-medium">{player.stats.correctDeductions}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Time Spent</span>
                  </div>
                  <div className="text-lg font-medium">{formatTime(player.stats.timeSpent)}</div>
                </div>
              </div>

              {/* Achievements */}
              {player.achievements.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-2">
                    Recent Achievements
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {player.achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full flex items-center gap-1"
                      >
                        <Star className="w-4 h-4" />
                        <span>{achievement.name}</span>
                        <span className="text-yellow-600">+{achievement.points}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
