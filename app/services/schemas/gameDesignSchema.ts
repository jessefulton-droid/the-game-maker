import { z } from 'zod';

// Schema for game mechanics
export const GameMechanicSchema = z.object({
  name: z.string().describe('Name of the mechanic (e.g., "Jump", "Collect Tacos")'),
  description: z.string().describe('How the mechanic works'),
  implementation: z.string().describe('Technical hint for implementation in Phaser.js'),
});

// Schema for game characters
export const GameCharacterSchema = z.object({
  name: z.string().describe('Character name'),
  role: z.enum(['player', 'enemy', 'npc']).describe('Character\'s role in the game'),
  abilities: z.array(z.string()).describe('What the character can do'),
  appearance: z.string().describe('Visual description for sprite creation'),
});

// Schema for collectibles
export const CollectibleSchema = z.object({
  name: z.string().describe('Name of the collectible item'),
  points: z.number().int().positive().describe('Points awarded when collected'),
  appearance: z.string().describe('Visual description'),
});

// Schema for obstacles
export const ObstacleSchema = z.object({
  name: z.string().describe('Name of the obstacle'),
  behavior: z.string().describe('How it moves or behaves'),
  appearance: z.string().describe('Visual description'),
});

// Schema for power-ups
export const PowerUpSchema = z.object({
  name: z.string().describe('Name of the power-up'),
  effect: z.string().describe('What special ability or benefit it provides'),
  duration: z.number().optional().describe('Duration in seconds (if temporary)'),
  appearance: z.string().describe('Visual description'),
});

// Schema for level design
export const LevelDesignSchema = z.object({
  layout: z.string().describe('Description of the level layout and structure'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('Difficulty level'),
  estimatedDuration: z.string().describe('Estimated time to complete (e.g., "3-5 minutes")'),
});

// Schema for visual style
export const VisualStyleSchema = z.object({
  colorScheme: z.array(z.string()).describe('Main colors to use (hex codes or names)'),
  artStyle: z.string().describe('Art style description (e.g., "colorful pixel art", "cartoon style")'),
  animations: z.array(z.string()).describe('Key animations needed'),
});

// Main schema for game design output
export const GameDesignSchema = z.object({
  gameTitle: z.string().describe('Title of the game'),
  gameType: z.enum(['platformer', 'top-down', 'obstacle-avoider', 'custom']).describe('Type of 90s arcade game'),
  objective: z.string().describe('Main goal of the game'),
  mechanics: z.array(GameMechanicSchema).describe('Core game mechanics'),
  characters: z.array(GameCharacterSchema).describe('Characters in the game'),
  collectibles: z.array(CollectibleSchema).describe('Items to collect'),
  obstacles: z.array(ObstacleSchema).describe('Obstacles and enemies'),
  powerUps: z.array(PowerUpSchema).describe('Power-ups available'),
  levelDesign: LevelDesignSchema.describe('Level layout and structure'),
  visualStyle: VisualStyleSchema.describe('Visual style and aesthetics'),
  designNotes: z.array(z.string()).describe('Additional design notes from conversation'),
});

export type GameMechanic = z.infer<typeof GameMechanicSchema>;
export type GameCharacter = z.infer<typeof GameCharacterSchema>;
export type Collectible = z.infer<typeof CollectibleSchema>;
export type Obstacle = z.infer<typeof ObstacleSchema>;
export type PowerUp = z.infer<typeof PowerUpSchema>;
export type LevelDesign = z.infer<typeof LevelDesignSchema>;
export type VisualStyle = z.infer<typeof VisualStyleSchema>;
export type GameDesign = z.infer<typeof GameDesignSchema>;

