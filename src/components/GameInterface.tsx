import React, { useState, useEffect } from 'react';
import { ChatInterface } from './ChatInterface';
import { EvidenceLog } from './EvidenceLog';
import { CharacterProfile } from './CharacterProfile';
import { GameProgress } from './GameProgress';
import { InteractionHistory } from './InteractionHistory';
import { StoryIntroduction } from './StoryIntroduction';
import { GameCoordinator } from '../services/gameCoordinator';

interface GameInterfaceProps {
  gameCoordinator: GameCoordinator;
  playerId: string;
}

export const GameInterface: React.FC<GameInterfaceProps> = ({
  gameCoordinator,
  playerId
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'evidence' | 'profile' | 'progress' | 'history'>('chat');
  const [gameState, setGameState] = useState<any>(null);
  const [playerCharacter, setPlayerCharacter] = useState<any>(null);
  const [showIntroduction, setShowIntroduction] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeGame = async () => {
      try {
        setIsLoading(true);
        await gameCoordinator.initializeGame({
          numberOfCharacters: 8,
          timePeriod: 'Victorian Era',
          locationType: 'Manor House',
          theme: 'Revenge'
        });
        
        const character = await gameCoordinator.assignCharacterToPlayer(playerId);
        setPlayerCharacter(character);

        const summary = gameCoordinator.getGameSummary(playerId);
        setGameState(summary);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize game:', error);
        setIsLoading(false);
      }
    };

    initializeGame();
  }, []);

  const updateGameState = () => {
    const summary = gameCoordinator.getGameSummary(playerId);
    setGameState(summary);
  };

  const handleSendQuestion = async (targetCharacter: any, question: string) => {
    const response = await gameCoordinator.askCharacter({
      askingPlayerId: playerId,
      targetCharacterId: targetCharacter.id,
      question
    });

    updateGameState();
    return response;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading game...</div>
      </div>
    );
  }

  if (!gameState || !playerCharacter) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Error loading game state</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {showIntroduction && gameState.story && (
        <StoryIntroduction
          story={gameState.story}
          onStart={() => setShowIntroduction(false)}
          assignedCharacter={playerCharacter}
        />
      )}
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Navigation */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'chat' ? 'bg-blue-600 text-white' : 'bg-white'
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab('evidence')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'evidence' ? 'bg-blue-600 text-white' : 'bg-white'
            }`}
          >
            Evidence
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'history' ? 'bg-blue-600 text-white' : 'bg-white'
            }`}
          >
            Interaction History
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'profile' ? 'bg-blue-600 text-white' : 'bg-white'
            }`}
          >
            Your Profile
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'progress' ? 'bg-blue-600 text-white' : 'bg-white'
            }`}
          >
            Progress
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Interface */}
          <div className="lg:col-span-2">
            {activeTab === 'chat' && (
              <ChatInterface
                onSendQuestion={handleSendQuestion}
                characters={gameState.characters}
                playerCharacter={playerCharacter}
                onClueDiscovered={updateGameState}
              />
            )}
            {activeTab === 'evidence' && (
              <EvidenceLog
                clues={gameState.discoveredClues}
              />
            )}
            {activeTab === 'history' && (
              <InteractionHistory
                interactions={gameState.interactions.map((interaction: any) => ({
                  ...interaction,
                  fromCharacter: gameState.characters.find((c: any) => c.id === interaction.fromCharacterId),
                  toCharacter: gameState.characters.find((c: any) => c.id === interaction.toCharacterId)
                }))}
              />
            )}
            {activeTab === 'profile' && (
              <CharacterProfile
                character={playerCharacter}
                knownCharacters={gameState.characters}
              />
            )}
            {activeTab === 'progress' && (
              <GameProgress
                discoveredClueCount={gameState.discoveredClueCount}
                totalClueCount={gameState.totalClueCount}
                interactionCount={gameState.interactionCount}
                progress={gameState.progress}
                publicEvents={gameState.publicEvents}
              />
            )}
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            <GameProgress
              discoveredClueCount={gameState.discoveredClueCount}
              totalClueCount={gameState.totalClueCount}
              interactionCount={gameState.interactionCount}
              progress={gameState.progress}
              publicEvents={gameState.publicEvents}
            />
            <EvidenceLog
              clues={gameState.discoveredClues}
            />
          </div>
        </div>
      </div>
    </div>
  );
};