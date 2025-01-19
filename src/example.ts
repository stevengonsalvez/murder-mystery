import { GameCoordinator } from './services/gameCoordinator';

async function runExample() {
  // Initialize game with your LLM API key
  const coordinator = new GameCoordinator('your-api-key-here');

  // Start a new game
  await coordinator.initializeGame({
    numberOfCharacters: 8,
    timePeriod: 'Victorian Era',
    locationType: 'Manor House',
    theme: 'Revenge'
  });

  // Add some players
  const player1Character = await coordinator.assignCharacterToPlayer('player1');
  const player2Character = await coordinator.assignCharacterToPlayer('player2');

  console.log('Player 1 is playing as:', player1Character.name);
  console.log('Player 2 is playing as:', player2Character.name);

  // Player 1 searches the library
  const foundClues = coordinator.searchLocation({
    playerId: 'player1',
    location: 'Library'
  });
  console.log('Found clues:', foundClues);

  // Player 1 questions another character
  const response = await coordinator.askCharacter({
    askingPlayerId: 'player1',
    targetCharacterId: 'some-character-id', // This would be a real character ID from the story
    question: 'Where were you at the time of the murder?'
  });
  console.log('Character response:', response);

  // Get game progress
  const summary = coordinator.getGameSummary('player1');
  console.log('Game progress:', summary);

  // Make an accusation
  const accusationResult = coordinator.makeAccusation({
    accusingPlayerId: 'player1',
    accusedCharacterId: 'suspected-murderer-id', // This would be a real character ID
    evidence: ['clue1', 'clue2', 'testimony1']
  });
  console.log('Accusation result:', accusationResult);
}

// Run the example
runExample().catch(console.error);