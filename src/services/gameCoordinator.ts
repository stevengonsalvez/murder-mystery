import { LLMService } from './llm';
import { GameState, PlayerState, Interaction } from './gameState';
import { MysteryStory, Character, Clue } from '../types/story';

export class GameCoordinator {
  private llmService: LLMService;
  private gameState: GameState;
  private story: MysteryStory;

  constructor(apiKey: string) {
    this.llmService = new LLMService(apiKey);
  }

  async initializeGame(options: {
    numberOfCharacters: number;
    timePeriod: string;
    locationType: string;
    theme: string;
  }): Promise<void> {
    this.story = await this.llmService.generateStory(options);
    this.gameState = new GameState(this.story);
  }

  async assignCharacterToPlayer(playerId: string): Promise<Character> {
    const availableCharacters = this.story.characters.filter(char => 
      !char.isVictim && 
      !Array.from(this.gameState.getAllPlayers().values())
        .some(p => p.characterId === char.id)
    );

    if (availableCharacters.length === 0) {
      throw new Error('No available characters');
    }

    const randomChar = availableCharacters[
      Math.floor(Math.random() * availableCharacters.length)
    ];

    this.gameState.addPlayer(playerId, randomChar.id);
    return randomChar;
  }

  async askCharacter(params: {
    askingPlayerId: string;
    targetCharacterId: string;
    question: string;
  }): Promise<string> {
    const askingPlayer = this.gameState.getPlayerState(params.askingPlayerId);
    const askingCharacter = this.gameState.getCharacter(askingPlayer.characterId);
    const targetCharacter = this.gameState.getCharacter(params.targetCharacterId);
    const discoveredClues = this.gameState.getDiscoveredClues(params.askingPlayerId);

    const response = await this.llmService.generateCharacterResponse({
      character: targetCharacter,
      question: params.question,
      askedBy: askingCharacter,
      discoveredClues
    });

    this.gameState.recordInteraction({
      fromCharacterId: askingCharacter.id,
      toCharacterId: targetCharacter.id,
      question: params.question,
      answer: response
    });

    return response;
  }

  searchLocation(params: {
    playerId: string;
    location: string;
  }): Clue[] {
    const availableClues = this.story.clues.filter(clue => 
      clue.location === params.location &&
      this.checkClueVisibility(clue, params.playerId)
    );

    availableClues.forEach(clue => {
      this.gameState.discoverClue(params.playerId, clue.id);
    });

    return availableClues;
  }

  private checkClueVisibility(clue: Clue, playerId: string): boolean {
    const playerState = this.gameState.getPlayerState(playerId);
    
    // Check if the player has discovered prerequisite clues
    const hasPrerequisites = clue.visibilityConditions.every(condition => {
      // This is a simplified check - in a real implementation,
      // you might want to use a more sophisticated condition system
      return playerState.discoveredClues.some(discoveredClue => 
        discoveredClue.includes(condition)
      );
    });

    return hasPrerequisites;
  }

  makeAccusation(params: {
    accusingPlayerId: string;
    accusedCharacterId: string;
    evidence: string[];
  }): {
    correct: boolean;
    feedback: string;
  } {
    const accusedCharacter = this.gameState.getCharacter(params.accusedCharacterId);
    
    if (accusedCharacter.id === this.story.murdererId) {
      return {
        correct: true,
        feedback: this.generateVictoryFeedback(params.evidence)
      };
    }

    return {
      correct: false,
      feedback: this.generateFailureFeedback(params.evidence)
    };
  }

  private generateVictoryFeedback(evidence: string[]): string {
    // In a real implementation, you might want to use the LLM to generate
    // more sophisticated feedback based on the evidence provided
    return `Congratulations! You've solved the mystery. Your evidence was solid:
      ${evidence.join('\n')}`;
  }

  private generateFailureFeedback(evidence: string[]): string {
    // Similarly, this could be enhanced with LLM-generated feedback
    return `Your accusation was incorrect. Consider:
      - Review all discovered clues
      - Question more suspects
      - Look for contradictions in alibis`;
  }

  getGameSummary(playerId: string): {
    discoveredClueCount: number;
    totalClueCount: number;
    interactionCount: number;
    progress: number;
    publicEvents: Event[];
  } {
    const playerState = this.gameState.getPlayerState(playerId);
    const discoveredClues = this.gameState.getDiscoveredClues(playerId);

    return {
      discoveredClueCount: discoveredClues.length,
      totalClueCount: this.story.clues.length,
      interactionCount: playerState.interactionsHistory.length,
      progress: this.gameState.getStoryProgress(),
      publicEvents: this.gameState.getAllPublicEvents()
    };
  }

  // Add hint system for stuck players
  async getHint(playerId: string): Promise<string> {
    const playerState = this.gameState.getPlayerState(playerId);
    const discoveredClues = this.gameState.getDiscoveredClues(playerId);
    
    // In a real implementation, you would use the LLM to generate
    // contextual hints based on the player's progress
    if (discoveredClues.length < this.story.clues.length * 0.3) {
      return "Try searching more locations for physical evidence.";
    } else if (playerState.interactionsHistory.length < 5) {
      return "Question more characters about their whereabouts during the crime.";
    } else {
      return "Review the relationships between characters for potential motives.";
    }
  }
}