import React from 'react';
import { MessageSquare, Clock } from 'lucide-react';

interface Interaction {
  timestamp: string;
  fromCharacterId: string;
  toCharacterId: string;
  question: string;
  answer: string;
  fromCharacter: {
    name: string;
    occupation: string;
  };
  toCharacter: {
    name: string;
    occupation: string;
  };
}

interface InteractionHistoryProps {
  interactions: Interaction[];
}

export const InteractionHistory: React.FC<InteractionHistoryProps> = ({
  interactions
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-blue-600" />
        Interaction History
      </h2>
      
      {interactions.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No interactions recorded yet. Start questioning the characters!
        </div>
      ) : (
        <div className="space-y-6">
          {interactions.map((interaction, index) => (
            <div key={index} className="border-l-2 border-blue-200 pl-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Clock className="w-4 h-4" />
                {formatDate(interaction.timestamp)}
              </div>
              
              {/* Question */}
              <div className="mb-4">
                <div className="font-medium text-blue-600">
                  {interaction.fromCharacter.name} asked:
                </div>
                <div className="bg-blue-50 p-3 rounded-lg mt-1">
                  {interaction.question}
                </div>
              </div>
              
              {/* Answer */}
              <div>
                <div className="font-medium text-gray-600">
                  {interaction.toCharacter.name} responded:
                </div>
                <div className="bg-gray-50 p-3 rounded-lg mt-1">
                  {interaction.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};