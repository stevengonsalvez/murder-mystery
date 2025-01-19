import React from 'react';
import { File, FileText, MapPin } from 'lucide-react';

interface Clue {
  id: string;
  type: 'physical' | 'testimonial' | 'circumstantial';
  description: string;
  location: string;
  discoveredAt: string;
}

interface EvidenceLogProps {
  clues: Clue[];
  onClueSelect?: (clue: Clue) => void;
}

export const EvidenceLog: React.FC<EvidenceLogProps> = ({ clues, onClueSelect }) => {
  const getClueIcon = (type: Clue['type']) => {
    switch (type) {
      case 'physical':
        return <File className="w-5 h-5" />;
      case 'testimonial':
        return <FileText className="w-5 h-5" />;
      case 'circumstantial':
        return <MapPin className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-xl font-semibold mb-4">Evidence Log</h2>
      
      {clues.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No evidence discovered yet. Keep investigating!
        </div>
      ) : (
        <div className="space-y-4">
          {clues.map((clue) => (
            <div
              key={clue.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => onClueSelect?.(clue)}
            >
              <div className="flex items-start gap-3">
                <div className="text-blue-600">
                  {getClueIcon(clue.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div className="font-medium">{clue.type.charAt(0).toUpperCase() + clue.type.slice(1)} Evidence</div>
                    <div className="text-sm text-gray-500">{formatDate(clue.discoveredAt)}</div>
                  </div>
                  <p className="text-gray-600 mt-1">{clue.description}</p>
                  <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>Found in {clue.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
