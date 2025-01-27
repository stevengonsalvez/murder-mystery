# Murder Mystery Game

An interactive multiplayer murder mystery game built with React, TypeScript, and Socket.IO, powered by LLM for dynamic story generation and character interactions.

## Features

- 🎭 Dynamic character generation and role assignment
- 🔍 Interactive investigation system
- 💬 Real-time character conversations with AI-powered responses
- 🗺️ Multiple location exploration
- 📜 Evidence collection and tracking
- 🏆 Scoring and achievement system
- 👥 Multiplayer support with real-time updates

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: Node.js, Express, Socket.IO
- **AI Integration**: Anthropic Claude API
- **State Management**: Custom game state system
- **Build Tools**: Vite
- **Testing**: Jest

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Anthropic API key

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd murder-mystery
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Add your Anthropic API key to the `.env` file:
```
VITE_ANTHROPIC_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

This will start both the frontend (port 3000) and backend (port 3001) servers.

## Project Structure

```
murder-mystery/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── services/          # Game logic and API services
│   └── types/             # TypeScript type definitions
├── server/                # Backend server code
│   ├── socket.ts         # Socket.IO server setup
│   └── gameState.ts      # Game state management
└── public/               # Static assets
```

## Game Flow

1. **Lobby Creation**: Players can create or join game rooms
2. **Character Assignment**: Each player is assigned a unique character
3. **Investigation**: Players can:
   - Question other characters
   - Search locations for clues
   - Review evidence
   - Track their progress
4. **Accusation**: Players can make accusations when they think they've solved the case
5. **Resolution**: Game concludes when the correct murderer is identified

## Components

- **ChatInterface**: Handles character conversations
- **EvidenceLog**: Tracks discovered clues and evidence
- **GameProgress**: Shows investigation progress and timeline
- **CharacterProfile**: Displays character information
- **StoryIntroduction**: Presents the initial story setup
- **ScoreBoard**: Shows player achievements and rankings

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

- Built with [React](https://reactjs.org/)
- AI powered by [Anthropic Claude](https://www.anthropic.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
