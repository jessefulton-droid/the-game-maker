import { z } from 'zod';

// Schema for generated game code output
export const GameCodeSchema = z.object({
  phaserCode: z.string().describe('Complete Phaser.js game code'),
  htmlWrapper: z.string().describe('HTML wrapper to run the game in WebView'),
  assets: z.array(z.object({
    type: z.enum(['image', 'audio', 'sprite']).describe('Asset type'),
    name: z.string().describe('Asset identifier'),
    data: z.string().describe('Base64 encoded data or placeholder'),
  })).describe('Game assets (can be placeholders for MVP)'),
  metadata: z.object({
    generatedAt: z.date().default(() => new Date()),
    phaserVersion: z.string().default('3.70.0'),
    estimatedSize: z.string().describe('Estimated code size'),
  }).describe('Metadata about the generated code'),
});

export type GameCode = z.infer<typeof GameCodeSchema>;
export type GameAsset = z.infer<typeof GameCodeSchema>['assets'][number];

