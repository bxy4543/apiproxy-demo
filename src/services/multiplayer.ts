import { io, Socket } from 'socket.io-client';
import { Room, Player, GameRound } from '@/types/multiplayer';

export class MultiplayerService {
  private static socket: Socket | null = null;
  private static rooms: Map<string, Room> = new Map();

  static init() {
    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://localhost:3001', {
      autoConnect: false,
    });

    this.setupEventListeners();
  }

  private static setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('room:update', (room: Room) => {
      this.rooms.set(room.id, room);
      this.emit('roomUpdated', room);
    });

    this.socket.on('game:start', (data: { room: Room; round: GameRound }) => {
      this.emit('gameStarted', data);
    });

    this.socket.on('round:end', (data: { room: Room; round: GameRound; nextRound?: GameRound }) => {
      this.emit('roundEnded', data);
    });
  }

  static connect(token: string) {
    if (!this.socket) return;
    this.socket.auth = { token };
    this.socket.connect();
  }

  static disconnect() {
    if (!this.socket) return;
    this.socket.disconnect();
  }

  static createRoom(name: string, difficulty: 'easy' | 'hard', maxRounds: number = 5): Promise<Room> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not initialized'));
        return;
      }

      this.socket.emit('room:create', { name, difficulty, maxRounds }, (response: { room?: Room; error?: string }) => {
        if (response.error) {
          reject(new Error(response.error));
        } else if (response.room) {
          resolve(response.room);
        }
      });
    });
  }

  static joinRoom(roomId: string): Promise<Room> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not initialized'));
        return;
      }

      this.socket.emit('room:join', { roomId }, (response: { room?: Room; error?: string }) => {
        if (response.error) {
          reject(new Error(response.error));
        } else if (response.room) {
          resolve(response.room);
        }
      });
    });
  }

  static submitAnswer(roomId: string, answer: string, timeSpent: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not initialized'));
        return;
      }

      this.socket.emit('game:submit', { roomId, answer, timeSpent }, (response: { error?: string }) => {
        if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve();
        }
      });
    });
  }

  private static listeners: { [event: string]: Function[] } = {};

  static on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  static off(event: string, callback: Function) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  private static emit(event: string, data: any) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => callback(data));
  }
} 