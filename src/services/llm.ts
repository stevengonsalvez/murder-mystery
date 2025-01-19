import Anthropic from '@anthropic-ai/sdk';
import { MysteryStory, Character, Clue } from '../types/story';
import { createStoryPrompt, createCharacterResponsePrompt, createHintPrompt } from './prompts';

export class LLMService {
  private anthropic: Anthropic;

  constructor(apiKey: string) {
    this.anthropic = new Anthropic({
      apiKey: apiKey
    });
  }

  async generateStory(options: {
    numberOfCharacters: number;
    timePeriod: string;
    locationType: string;
    theme: string;
  }): Promise<MysteryStory> {
    const prompt = createStoryPrompt(options);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 4000,
        temperature: 0.7,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      // Extract the JSON from the response
      const jsonMatch = response.content[0].text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const story: MysteryStory = JSON.parse(jsonMatch[0]);
      
      // Validate the story structure
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
    const prompt = createCharacterResponsePrompt(params);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 1000,
        temperature: 0.8,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      return response.content[0].text;
    } catch (error) {
      console.error('Error generating character response:', error);
      throw new Error('Failed to generate character response');
    }
  }

  async generateHint(params: {
    discoveredClues: Clue[];
    unsolvedClues: Clue[];
    interactionHistory: Array<{question: string; answer: string}>;
    story: MysteryStory;
  }): Promise<string> {
    const prompt = createHintPrompt(params);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 300,
        temperature: 0.7,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      return response.content[0].text;
    } catch (error) {
      console.error('Error generating hint:', error);
      throw new Error('Failed to generate hint');
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
          throw new Error(\`Invalid relationship: character \${relationship.characterId} not found\`);
        }
      });
    });

    // Validate timeline references valid characters
    story.timeline.forEach(event => {
      event.participants.forEach(participantId => {
        if (!characterIds.has(participantId)) {
          throw new Error(\`Invalid timeline event: character \${participantId} not found\`);
        }
      });
    });
  }
}