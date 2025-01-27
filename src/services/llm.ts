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
        const errorText = await response.text();
        throw new Error('Failed to generate story: ' + errorText);
      }

      const story = await response.json();
      
      // Convert date strings to Date objects in timeline
      const processedStory = {
        ...story,
        timeline: story.timeline.map((event: any) => ({
          ...event,
          timestamp: new Date(event.timestamp)
        }))
      };

      this.validateStoryStructure(processedStory);
      return processedStory;
      
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
        const errorText = await response.text();
        throw new Error('Failed to generate response: ' + errorText);
      }

      const data = await response.json();
      return data.response;

    } catch (error) {
      console.error('Error generating character response:', error);
      throw new Error('Failed to generate character response');
    }
  }

  private validateStoryStructure(story: MysteryStory): void {
    console.log('Validating story structure:', story);
    
    // Basic structure check
    if (!story || typeof story !== 'object') {
      throw new Error('Invalid story structure: story must be an object');
    }

    // Required fields check
    const requiredFields = ['id', 'setting', 'characters', 'victimId', 'murdererId', 'clues', 'timeline', 'solution'];
    const missingFields = requiredFields.filter(field => !story[field]);
    
    if (missingFields.length > 0) {
      throw new Error('Invalid story structure: missing required fields: ' + missingFields.join(', '));
    }

    // Setting check
    if (!story.setting.location || !story.setting.timePeriod || !story.setting.description || !Array.isArray(story.setting.rooms)) {
      throw new Error('Invalid story structure: setting missing required properties');
    }

    // Characters check
    if (!Array.isArray(story.characters) || story.characters.length === 0) {
      throw new Error('Invalid story structure: characters must be a non-empty array');
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
          throw new Error('Invalid relationship: character ' + relationship.characterId + ' not found');
        }
      });
    });

    // Validate timeline references valid characters
    if (!Array.isArray(story.timeline)) {
      throw new Error('Invalid story structure: timeline must be an array');
    }

    story.timeline.forEach(event => {
      if (!Array.isArray(event.participants)) {
        throw new Error('Invalid story structure: event participants must be an array');
      }

      event.participants.forEach(participantId => {
        if (!characterIds.has(participantId)) {
          throw new Error('Invalid timeline event: character ' + participantId + ' not found');
        }
      });
    });

    // Clues check
    if (!Array.isArray(story.clues) || story.clues.length === 0) {
      throw new Error('Invalid story structure: clues must be a non-empty array');
    }

    // All validation passed
    console.log('Story structure validation passed');
  }
}