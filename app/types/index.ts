// Core types for The Game Maker app

export interface BookInfo {
  title: string;
  author: string;
  coverImageUri: string;
  identifiedAt: Date;
}

export interface BookAnalysis {
  book: BookInfo;
  plotSummary: string;
  themes: string[];
  characters: Character[];
  keyMoments: string[];
  gameElements: GameElement[];
  discussionNotes: string[];
}

export interface Character {
  name: string;
  description: string;
  role: string;
  traits: string[];
}

export interface GameElement {
  type: 'collectible' | 'obstacle' | 'power-up' | 'enemy' | 'goal';
  name: string;
  description: string;
  storyConnection: string;
}

export interface GameDesign {
  gameTitle: string;
  gameType: 'platformer' | 'top-down' | 'obstacle-avoider' | 'custom';
  objective: string;
  mechanics: GameMechanic[];
  characters: GameCharacter[];
  collectibles: Collectible[];
  obstacles: Obstacle[];
  powerUps: PowerUp[];
  levelDesign: LevelDesign;
  visualStyle: VisualStyle;
  designNotes: string[];
}

export interface GameMechanic {
  name: string;
  description: string;
  implementation: string;
}

export interface GameCharacter {
  name: string;
  role: 'player' | 'enemy' | 'npc';
  abilities: string[];
  appearance: string;
}

export interface Collectible {
  name: string;
  points: number;
  appearance: string;
}

export interface Obstacle {
  name: string;
  behavior: string;
  appearance: string;
}

export interface PowerUp {
  name: string;
  effect: string;
  duration?: number;
  appearance: string;
}

export interface LevelDesign {
  layout: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedDuration: string;
}

export interface VisualStyle {
  colorScheme: string[];
  artStyle: string;
  animations: string[];
}

export interface GeneratedGame {
  design: GameDesign;
  code: string;
  htmlWrapper: string;
  generatedAt: Date;
  version: number;
}

export interface SavedGame {
  id: string;
  book: BookInfo;
  game: GeneratedGame;
  playCount: number;
  lastPlayed?: Date;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  agentType?: 'story-analyst' | 'game-designer' | 'code-generator';
}

export interface AgentState {
  currentAgent: 'story-analyst' | 'game-designer' | 'code-generator' | null;
  phase: 'book-capture' | 'book-discussion' | 'game-design' | 'code-generation' | 'playing' | 'feedback';
  bookAnalysis?: BookAnalysis;
  gameDesign?: GameDesign;
  generatedGame?: GeneratedGame;
  conversationHistory: ChatMessage[];
  isProcessing: boolean;
  error?: string;
}

export type RootStackParamList = {
  Home: undefined;
  Camera: undefined;
  BookDiscussion: { bookInfo: BookInfo };
  GameDesign: { bookAnalysis: BookAnalysis };
  Generation: { gameDesign: GameDesign };
  Game: { generatedGame: GeneratedGame };
  Feedback: { generatedGame: GeneratedGame; onSpiceItUp: (feedback: string) => void };
};

