import React from 'react';
import { User, Briefcase, Clock, BookOpen, Users } from 'lucide-react';

interface Relationship {
  characterId: string;
  type: 'friend' | 'enemy' | 'family' | 'colleague' | 'lover' | 'acquaintance' | 'rival';
  details: string;
  isPublicKnowledge: boolean;
}

interface Character {
  id: string;
  name: string;
  occupation: string;
  age: number;
  background: string;
  personality: string[];
  relationships: Relationship[];
  alibi: string;
  knownInformation: string[];
}

interface CharacterProfileProps {
  character: Character;
  knownCharacters: { id: string; name: string }[];
}

export const CharacterProfile: React.FC<CharacterProfileProps> = ({
  character,
  knownCharacters
}) => {
  const getRelationshipColor = (type: Relationship['type']) => {
    switch (type) {
      case 'friend':
        return 'text-green-600';
      case 'enemy':
        return 'text-red-600';
      case 'family':
        return 'text-blue-600';
      case 'lover':
        return 'text-pink-600';
      case 'rival':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="text-center mb-6">
        <div className="inline-block p-4 rounded-full bg-blue-100 mb-4">
          <User className="w-12 h-12 text-blue-600" />
        </div>
        <h2 className="text-2xl font-semibold">{character.name}</h2>
        <div className="flex items-center justify-center gap-2 text-gray-600 mt-2">
          <Briefcase className="w-4 h-4" />
          <span>{character.occupation}</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Age</div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{character.age} years</span>
              </div>
            </div>
          </div>
        </div>

        {/* Background */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Background</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <BookOpen className="w-5 h-5 text-gray-400 mb-2" />
            <p className="text-gray-700">{character.background}</p>
          </div>
        </div>

        {/* Personality Traits */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Personality Traits</h3>
          <div className="flex flex-wrap gap-2">
            {character.personality.map((trait, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        {/* Known Relationships */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Known Relationships</h3>
          <div className="space-y-3">
            {character.relationships
              .filter(rel => rel.isPublicKnowledge)
              .map((relationship, index) => {
                const relatedCharacter = knownCharacters.find(c => c.id === relationship.characterId);
                if (!relatedCharacter) return null;

                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <Users className={`w-5 h-5 ${getRelationshipColor(relationship.type)}`} />
                    <div>
                      <div className="font-medium">{relatedCharacter.name}</div>
                      <div className="text-sm text-gray-600">
                        {relationship.type.charAt(0).toUpperCase() + relationship.type.slice(1)}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{relationship.details}</div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Alibi */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Alibi</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700">{character.alibi}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
