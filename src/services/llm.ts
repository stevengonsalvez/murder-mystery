import { MysteryStory, Character, Clue } from '../types/story';

export class LLMService {
  constructor(apiKey: string) {
    // API key is now handled by the backend
  }

  async generateStory(options: {
    numberOfCharacters: number;
    timePeriod: string;
    locationType: string;
    theme: string;
  }): Promise<MysteryStory> {
    try {
      const response = await fetch('http://localhost:3001/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        throw new Error('Failed to generate story');
      }

      const story: MysteryStory = await response.json();
      this.validateStoryStructure(story);
      return story;
      
    } catch (error) {
      console.error('Error generating story:', error);
      throw new Error('Failed to generate mystery story');
    }
  }

  async generateCharacterResponse(params: {
    character: Character;
    question: string;
    askedBy: Character;
    discoveredClues: Clue[];
  }): Promise<string> {
    try {
      const response = await fetch('http://localhost:3001/api/character-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to generate response');
      }

      const data = await response.json();
      return data.response;

    } catch (error) {
      console.error('Error generating character response:', error);
      throw new Error('Failed to generate character response');
    }
  }

  private validateStoryStructure(story: MysteryStory): void {
    // Ensure all required fields are present
    if (!story.id || !story.setting || !story.characters || 
        !story.victimId || !story.murdererId || !story.clues || 
        !story.timeline || !story.solution) {
      throw new Error('Invalid story structure: missing required fields');
    }

    // Validate character references
    const characterIds = new Set(story.characters.map(c => c.id));
    
    // Check victim exists
    if (!characterIds.has(story.victimId)) {
      throw new Error('Invalid story structure: victim ID does not match any character');
    }

    // Check murderer exists
    if (!characterIds.has(story.murdererId)) {
      throw new Error('Invalid story structure: murderer ID does not match any character');
    }

    // Validate relationships reference valid characters
    story.characters.forEach(character => {
      character.relationships.forEach(relationship => {
        if (!characterIds.has(relationship.characterId)) {
          throw new Error(`Invalid relationship: character ${relationship.characterId} not found`);
        }
      });
    });

    // Validate timeline references valid characters
    story.timeline.forEach(event => {
      event.participants.forEach(participantId => {
        if (!characterIds.has(participantId)) {
          throw new Error(`Invalid timeline event: character ${participantId} not found`);
        }
      });
    });
  }
}