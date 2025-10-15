import { z } from 'zod';

// Schema for book identification
export const BookInfoSchema = z.object({
  title: z.string().describe('The title of the children\'s book'),
  author: z.string().describe('The author of the book'),
  coverImageUri: z.string().describe('URI of the book cover image'),
  identifiedAt: z.date().default(() => new Date()),
});

// Schema for character extraction
export const CharacterSchema = z.object({
  name: z.string().describe('Character name'),
  description: z.string().describe('Brief character description'),
  role: z.string().describe('Role in the story (protagonist, antagonist, helper, etc.)'),
  traits: z.array(z.string()).describe('Key personality traits or abilities'),
});

// Schema for game elements identified from the story
export const GameElementSchema = z.object({
  type: z.enum(['collectible', 'obstacle', 'power-up', 'enemy', 'goal']).describe('Type of game element'),
  name: z.string().describe('Name of the element'),
  description: z.string().describe('How it appears/works in the story'),
  storyConnection: z.string().describe('How this connects to the book\'s narrative'),
});

// Main schema for book analysis output
export const BookAnalysisSchema = z.object({
  book: BookInfoSchema,
  plotSummary: z.string().describe('Brief summary of the book\'s plot (2-3 sentences)'),
  themes: z.array(z.string()).describe('Main themes and lessons from the book'),
  characters: z.array(CharacterSchema).describe('Key characters from the story'),
  keyMoments: z.array(z.string()).describe('Important plot points or memorable scenes'),
  gameElements: z.array(GameElementSchema).describe('Story elements that could work well in a game'),
  discussionNotes: z.array(z.string()).describe('Notes from the conversation with the child about the book'),
});

export type BookInfo = z.infer<typeof BookInfoSchema>;
export type Character = z.infer<typeof CharacterSchema>;
export type GameElement = z.infer<typeof GameElementSchema>;
export type BookAnalysis = z.infer<typeof BookAnalysisSchema>;

