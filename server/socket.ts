import { Server } from 'socket.io';
import { GameState } from './gameState';

export class GameServer {
  private io: Server;
  private activeGames: Map<string, GameState>;
  private playerRooms: Map<string, string>; // playerId -> gameId

  constructor(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    this.activeGames = new Map();
    this.playerRooms = new Map();

    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);

      // Create or join a game room
      socket.on('join_game', ({ gameId, playerName }) => {
        const game = this.activeGames.get(gameId) || this.createNewGame(gameId);
        
        // Add player to game
        const playerId = socket.id;
        this.playerRooms.set(playerId, gameId);
        socket.join(gameId);

        // Notify everyone in the room
        this.io.to(gameId).emit('player_joined', {
          playerId,
          playerName,
          players: game.getConnectedPlayers()
        });
      });

      // Handle player questioning
      socket.on('ask_question', ({ gameId, fromPlayer, toCharacter, question }) => {
        const game = this.activeGames.get(gameId);
        if (!game) return;

        // Generate response and update game state
        game.handleQuestion(fromPlayer, toCharacter, question)
          .then(response => {
            this.io.to(gameId).emit('question_response', {
              fromPlayer,
              toCharacter,
              question,
              response,
              timestamp: new Date()
            });

            // Update all players with new game state
            this.broadcastGameState(gameId);
          });
      });

      // Handle clue discovery
      socket.on('discover_clue', ({ gameId, playerId, clueId }) => {
        const game = this.activeGames.get(gameId);
        if (!game) return;

        game.discoverClue(playerId, clueId);
        this.broadcastGameState(gameId);
      });

      // Handle accusation
      socket.on('make_accusation', ({ gameId, playerId, accusedId, evidence }) => {
        const game = this.activeGames.get(gameId);
        if (!game) return;

        const result = game.makeAccusation(playerId, accusedId, evidence);
        this.io.to(gameId).emit('accusation_result', result);

        if (result.correct) {
          // Game over - broadcast final state
          this.io.to(gameId).emit('game_over', {
            winner: playerId,
            solution: game.getSolution()
          });
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        const gameId = this.playerRooms.get(socket.id);
        if (gameId) {
          const game = this.activeGames.get(gameId);
          if (game) {
            game.removePlayer(socket.id);
            this.io.to(gameId).emit('player_left', {
              playerId: socket.id,
              players: game.getConnectedPlayers()
            });
          }
          this.playerRooms.delete(socket.id);
        }
      });
    });
  }

  private createNewGame(gameId: string): GameState {
    const game = new GameState({
      maxPlayers: 6,
      timeLimit: 60 * 60 * 1000 // 1 hour in milliseconds
    });
    this.activeGames.set(gameId, game);
    return game;
  }

  private broadcastGameState(gameId: string) {
    const game = this.activeGames.get(gameId);
    if (!game) return;

    this.io.to(gameId).emit('game_state_update', game.getPublicGameState());
  }
}