import React from 'react';
import { Clock, MapPin, Users, AlertTriangle } from 'lucide-react';

interface StoryIntroductionProps {
  story: {
    setting: {
      location: string;
      timePeriod: string;
      description: string;
    };
    characters: Array<{
      name: string;
      occupation: string;
      isVictim?: boolean;
    }>;
    timeline: Array<{
      description: string;
      location: string;
      isPublicKnowledge: boolean;
    }>;
  };
  onStart: () => void;
  assignedCharacter: {
    name: string;
    occupation: string;
  } | null;
}

export const StoryIntroduction: React.FC<StoryIntroductionProps> = ({
  story,
  onStart,
  assignedCharacter
}) => {
  const victim = story.characters.find(char => char.isVictim);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h1 className="text-3xl font-bold mb-6">A Murder at {story.setting.location}</h1>
        
        {/* Setting */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-gray-600 mb-3">
            <Clock className="w-5 h-5" />
            <span>{story.setting.timePeriod}</span>
            <MapPin className="w-5 h-5 ml-4" />
            <span>{story.setting.location}</span>
          </div>
          <p className="text-gray-700">{story.setting.description}</p>
        </div>

        {/* The Murder */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            The Murder
          </h2>
          <p className="text-gray-700 mb-4">
            {victim?.name}, the {victim?.occupation}, has been found dead.
            The circumstances are suspicious, and foul play is suspected.
          </p>
        </div>

        {/* Key Events */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Known Events</h2>
          <div className="space-y-4">
            {story.timeline
              .filter(event => event.isPublicKnowledge)
              .map((event, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{event.description}</p>
                  <div className="text-sm text-gray-500 mt-2">
                    Location: {event.location}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Your Role */}
        {assignedCharacter && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Your Role</h2>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-700">
                You are <span className="font-semibold">{assignedCharacter.name}</span>,
                the {assignedCharacter.occupation}. You must investigate the murder
                by questioning other characters and searching for clues.
              </p>
            </div>
          </div>
        )}

        {/* Present Characters */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Present Characters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {story.characters
              .filter(char => !char.isVictim)
              .map((char, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <div className="font-medium">{char.name}</div>
                  <div className="text-gray-600 text-sm">{char.occupation}</div>
                </div>
              ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={onStart}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Begin Investigation
        </button>
      </div>
    </div>
  );
};
