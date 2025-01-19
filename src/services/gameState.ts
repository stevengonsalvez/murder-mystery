import { MysteryStory, Character, Clue, Event } from '../types/story';

export interface PlayerState {
  playerId: string;
  characterId: string;
  discoveredClues: string[];
  interactionsHistory: Interaction[];
}

export interface Interaction {
  timestamp: Date;
  fromCharacterId: string;
  toCharacterId: string;
  question: string;
  answer: string;
}

export class GameState {
  private story: MysteryStory;
  private players: Map<string, PlayerState>;
  private gameStartTime: Date;

  constructor(story: MysteryStory) {
    this.story = story;
    this.players = new Map();
    this.gameStartTime = new Date();
  }

  addPlayer(playerId: string, characterId: string): void {
    if (this.players.has(playerId)) {
      throw new Error('Player already exists');
    }

    this.players.set(playerId, {
      playerId,
      characterId,
      discoveredClues: [],
      interactionsHistory: []
    });
  }

  getAllPlayers(): Map<string, PlayerState> {
    return this.players;
  }

  recordInteraction(interaction: Omit<Interaction, 'timestamp'>): void {
    const fromPlayer = Array.from(this.players.values())
      .find(p => p.characterId === interaction.fromCharacterId);
    
    if (!fromPlayer) {
      throw new Error('Invalid asking character');
    }

    const fullInteraction: Interaction = {
      ...interaction,
      timestamp: new Date()
    };

    fromPlayer.interactionsHistory.push(fullInteraction);
  }

  discoverClue(playerId: string, clueId: string): void {
    const player = this.players.get(playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    const clue = this.story.clues.find(c => c.id === clueId);
    if (!clue) {
      throw new Error('Clue not found');
    }

    if (!player.discoveredClues.includes(clueId)) {
      player.discoveredClues.push(clueId);
    }
  }

  getPlayerState(playerId: string): PlayerState {
    const state = this.players.get(playerId);
    if (!state) {
      throw new Error('Player not found');
    }
    return state;
  }

  getCharacter(characterId: string): Character {
    const character = this.story.characters.find(c => c.id === characterId);
    if (!character) {
      throw new Error('Character not found');
    }
    return character;
  }

  getDiscoveredClues(playerId: string): Clue[] {
    const player = this.players.get(playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    return this.story.clues.filter(clue => 
      player.discoveredClues.includes(clue.id)
    );
  }

  getAllPublicEvents(): Event[] {
    return this.story.timeline.filter(event => event.isPublicKnowledge);
  }

  getStoryProgress(): number {
    const totalClues = this.story.clues.length;
    const discoveredClues = new Set(
      Array.from(this.players.values())
        .flatMap(p => p.discoveredClues)
    ).size;

    return (discoveredClues / totalClues) * 100;
  }

  getGameSummary(playerId: string): {
    story: MysteryStory;
    characters: Character[];
    discoveredClues: Clue[];
    discoveredClueCount: number;
    totalClueCount: number;
    interactionCount: number;
    interactions: Interaction[];
    progress: number;
    publicEvents: Event[];
  } {
    const playerState = this.getPlayerState(playerId);
    const discoveredClues = this.getDiscoveredClues(playerId);

    return {
      story: this.story,
      characters: this.story.characters,
      discoveredClues,
      discoveredClueCount: discoveredClues.length,
      totalClueCount: this.story.clues.length,
      interactionCount: playerState.interactionsHistory.length,
      interactions: playerState.interactionsHistory,
      progress: this.getStoryProgress(),
      publicEvents: this.getAllPublicEvents()
    };
  }
}