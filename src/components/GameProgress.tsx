import React from 'react';
import { CheckCircle, Clock, File, MessageSquare } from 'lucide-react';

interface GameEvent {
  id: string;
  timestamp: string;
  description: string;
  location: string;
  isPublicKnowledge: boolean;
}

interface GameProgressProps {
  discoveredClueCount: number;
  totalClueCount: number;
  interactionCount: number;
  progress: number;
  publicEvents: GameEvent[];
}

export const GameProgress: React.FC<GameProgressProps> = ({
  discoveredClueCount,
  totalClueCount,
  interactionCount,
  progress,
  publicEvents
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-4">Investigation Progress</h2>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Case Progress</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Clues */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <File className="w-5 h-5 text-blue-600" />
            <span className="font-medium">Clues</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {discoveredClueCount}/{totalClueCount}
          </div>
          <div className="text-sm text-gray-600">pieces of evidence found</div>
        </div>

        {/* Interactions */}
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
            <span className="font-medium">Interactions</span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {interactionCount}
          </div>
          <div className="text-sm text-gray-600">character conversations</div>
        </div>

        {/* Time */}
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <span className="font-medium">Time Elapsed</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {/* You might want to calculate actual elapsed time */}
            30:00
          </div>
          <div className="text-sm text-gray-600">minutes remaining</div>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Known Events</h3>
        <div className="space-y-4">
          {publicEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
            >
              <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
              <div>
                <div className="text-sm text-gray-500">
                  {new Date(event.timestamp).toLocaleString()}
                </div>
                <div className="font-medium mt-1">{event.description}</div>
                <div className="text-sm text-gray-600 mt-1">
                  Location: {event.location}
                </div>
              </div>
            </div>
          ))}
          {publicEvents.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No events have been discovered yet. Keep investigating!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
