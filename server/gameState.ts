import { LLMService } from './llm';
import { Character, Clue } from '../src/types/story';

interface GameOptions {
  maxPlayers: number;
  timeLimit: number;
}

interface Player {
  id: string;
  name: string;
  characterId: string;
  discoveredClues: string[];
  interactionHistory: Interaction[];
}

interface Interaction {
  timestamp: Date;
  fromPlayerId: string;
  toCharacterId: string;
  question: string;
  answer: string;
}

export class GameState {
  private llm: LLMService;
  private players: Map<string, Player>;
  private story: any;
  private startTime: Date;
  private options: GameOptions;

  constructor(options: GameOptions) {
    this.llm = new LLMService(process.env.ANTHROPIC_API_KEY || '');
    this.players = new Map();
    this.options = options;
    this.startTime = new Date();
    this.initializeStory();
  }

  private async initializeStory() {
    this.story = await this.llm.generateStory({
      numberOfCharacters: 10,
      timePeriod: 'Victorian Era',
      locationType: 'Manor House',
      theme: 'Revenge'
    });
  }

  async addPlayer(playerId: string, playerName: string): Promise<Character> {
    if (this.players.size >= this.options.maxPlayers) {
      throw new Error('Game is full');
    }

    const availableCharacters = this.story.characters.filter(char => 
      !char.isVictim && 
      !Array.from(this.players.values()).some(p => p.characterId === char.id)
    );

    if (availableCharacters.length === 0) {
      throw new Error('No available characters');
    }

    const character = availableCharacters[Math.floor(Math.random() * availableCharacters.length)];

    this.players.set(playerId, {
      id: playerId,
      name: playerName,
      characterId: character.id,
      discoveredClues: [],
      interactionHistory: []
    });

    return character;
  }

  removePlayer(playerId: string) {
    this.players.delete(playerId);
  }

  getConnectedPlayers() {
    return Array.from(this.players.values()).map(player => ({
      id: player.id,
      name: player.name,
      character: this.story.characters.find(c => c.id === player.characterId)
    }));
  }

  async handleQuestion(fromPlayerId: string, toCharacterId: string, question: string): Promise<string> {
    const player = this.players.get(fromPlayerId);
    if (!player) throw new Error('Player not found');

    const response = await this.llm.generateCharacterResponse({
      character: this.story.characters.find(c => c.id === toCharacterId),
      question,
      askedBy: this.story.characters.find(c => c.id === player.characterId),
      discoveredClues: this.getPlayerClues(fromPlayerId)
    });

    player.interactionHistory.push({
      timestamp: new Date(),
      fromPlayerId,
      toCharacterId,
      question,
      answer: response
    });

    return response;
  }

  discoverClue(playerId: string, clueId: string) {
    const player = this.players.get(playerId);
    if (!player) throw new Error('Player not found');

    if (!player.discoveredClues.includes(clueId)) {
      player.discoveredClues.push(clueId);
    }
  }

  makeAccusation(playerId: string, accusedId: string, evidence: string[]): {
    correct: boolean;
    feedback: string;
  } {
    if (accusedId === this.story.murdererId) {
      return {
        correct: true,
        feedback: `Congratulations! You've solved the mystery. ${this.story.solution}`
      };
    }

    return {
      correct: false,
      feedback: 'Your accusation was incorrect. Keep investigating!'
    };
  }

  getPlayerClues(playerId: string): Clue[] {
    const player = this.players.get(playerId);
    if (!player) throw new Error('Player not found');

    return this.story.clues.filter(clue => 
      player.discoveredClues.includes(clue.id)
    );
  }

  getSolution(): string {
    return this.story.solution;
  }

  getPublicGameState() {
    return {
      players: this.getConnectedPlayers(),
      story: {
        ...this.story,
        murdererId: undefined, // Hide the murderer's identity
        solution: undefined    // Hide the solution
      },
      timeRemaining: this.options.timeLimit - (new Date().getTime() - this.startTime.getTime())
    };
  }

  getPlayerState(playerId: string) {
    const player = this.players.get(playerId);
    if (!player) throw new Error('Player not found');

    return {
      player,
      character: this.story.characters.find(c => c.id === player.characterId),
      discoveredClues: this.getPlayerClues(playerId),
      interactionHistory: player.interactionHistory
    };
  }
}