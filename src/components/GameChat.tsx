import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare } from 'lucide-react';

interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  content: string;
  timestamp: Date;
  type: 'public' | 'clue' | 'system';
}

interface GameChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  currentPlayerId: string;
  players: { id: string; name: string }[];
}

export const GameChat: React.FC<GameChatProps> = ({
  messages,
  onSendMessage,
  currentPlayerId,
  players
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Game Chat
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isCurrentPlayer = message.playerId === currentPlayerId;
          const playerName = players.find(p => p.id === message.playerId)?.name || message.playerName;

          if (message.type === 'system') {
            return (
              <div key={message.id} className="flex justify-center">
                <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                  {message.content}
                </div>
              </div>
            );
          }

          if (message.type === 'clue') {
            return (
              <div key={message.id} className="flex justify-center">
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg max-w-[80%]">
                  <div className="text-sm font-medium mb-1">🔍 New Clue Discovered</div>
                  <div>{message.content}</div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={message.id}
              className={`flex ${isCurrentPlayer ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] ${
                  isCurrentPlayer
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                } rounded-lg px-4 py-2`}
              >
                <div className="flex items-baseline gap-2 mb-1">
                  <span className={`text-sm ${
                    isCurrentPlayer ? 'text-blue-100' : 'text-gray-600'
                  }`}>
                    {playerName}
                  </span>
                  <span className={`text-xs ${
                    isCurrentPlayer ? 'text-blue-200' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <div>{message.content}</div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="relative">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-blue-600 hover:text-blue-700 disabled:text-gray-400"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
