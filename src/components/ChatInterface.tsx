import React, { useState, useEffect } from 'react';
import { Send, UserCircle2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface Character {
  id: string;
  name: string;
  occupation: string;
}

interface ChatMessage {
  type: 'question' | 'answer';
  content: string;
  timestamp: string;
  character?: Character;
}

interface ChatInterfaceProps {
  onSendQuestion: (character: Character, question: string) => Promise<string>;
  characters: Character[];
  playerCharacter: Character;
  onClueDiscovered?: (clue: any) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onSendQuestion,
  characters,
  playerCharacter,
  onClueDiscovered
}) => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendQuestion = async () => {
    if (!selectedCharacter || !question.trim() || isLoading) return;

    const newQuestion: ChatMessage = {
      type: 'question',
      content: question,
      timestamp: new Date().toISOString(),
    };

    setChatHistory(prev => [...prev, newQuestion]);
    setIsLoading(true);

    try {
      const response = await onSendQuestion(selectedCharacter, question);
      
      const newAnswer: ChatMessage = {
        type: 'answer',
        character: selectedCharacter,
        content: response,
        timestamp: new Date().toISOString(),
      };

      setChatHistory(prev => [...prev, newAnswer]);
    } catch (error) {
      console.error('Failed to get response:', error);
      const errorMsg: ChatMessage = {
        type: 'answer',
        content: "I apologize, but I am unable to respond at the moment.",
        timestamp: new Date().toISOString(),
        character: selectedCharacter
      };
      setChatHistory(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setQuestion('');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col h-screen bg-gray-50">
      {/* Character Selection */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Select Character to Question</h2>
        <div className="flex gap-2 flex-wrap">
          {characters.filter(char => char.id !== playerCharacter.id).map(char => (
            <button
              key={char.id}
              onClick={() => setSelectedCharacter(char)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                selectedCharacter?.id === char.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white border border-gray-300'
              }`}
            >
              <UserCircle2 className="w-5 h-5" />
              {char.name}
            </button>
          ))}
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-auto bg-white rounded-lg border border-gray-200 mb-4 p-4">
        <div className="space-y-4">
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.type === 'question' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.type === 'question'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {msg.type === 'answer' && msg.character && (
                  <div className="font-semibold text-sm text-gray-600 mb-1">
                    {msg.character.name}
                  </div>
                )}
                <div>{msg.content}</div>
              </div>
            </div>
          ))}
          {chatHistory.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              Select a character and start asking questions to investigate the murder.
            </div>
          )}
        </div>
      </div>

      {/* Question Input */}
      <div className="relative">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={selectedCharacter 
            ? `Ask ${selectedCharacter.name} a question...` 
            : "Select a character to question"
          }
          className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!selectedCharacter || isLoading}
          onKeyPress={(e) => e.key === 'Enter' && handleSendQuestion()}
        />
        <button
          onClick={handleSendQuestion}
          disabled={!selectedCharacter || !question.trim() || isLoading}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-blue-600 disabled:text-gray-400"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
