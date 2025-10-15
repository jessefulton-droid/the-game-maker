import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { HumanMessage } from '@langchain/core/messages';
import { createClaudeVisionClient } from '../claudeAPI';
import { BookInfoSchema } from '../schemas/bookSchema';

// Tool for identifying a book from a cover image
export const createIdentifyBookTool = () => {
  return new DynamicStructuredTool({
    name: 'identify_book',
    description: 'Identifies a children\'s book from a cover image and returns the title, author, and basic information',
    schema: z.object({
      imageUri: z.string().describe('URI or base64 data of the book cover image'),
    }),
    func: async ({ imageUri }) => {
      try {
        const visionClient = createClaudeVisionClient();
        
        // Prepare the image for Claude Vision
        // Convert URI to base64 if needed
        let imageData = imageUri;
        if (imageUri.startsWith('file://')) {
          // In a real implementation, you'd read the file and convert to base64
          // For now, we'll use the URI directly
          imageData = imageUri;
        }
        
        const message = new HumanMessage({
          content: [
            {
              type: 'image_url',
              image_url: {
                url: imageData,
              },
            },
            {
              type: 'text',
              text: `Please identify this children's book from the cover image. 
              
              Return the following information in JSON format:
              {
                "title": "book title",
                "author": "author name",
                "briefSummary": "2-3 sentence plot summary"
              }
              
              If you cannot identify the book with certainty, return:
              {
                "title": "Unknown",
                "author": "Unknown",
                "briefSummary": "Could not identify this book"
              }`,
            },
          ],
        });
        
        const response = await visionClient.invoke([message]);
        
        // Parse the response
        try {
          const content = response.content as string;
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const bookData = JSON.parse(jsonMatch[0]);
            return JSON.stringify({
              success: true,
              book: {
                title: bookData.title,
                author: bookData.author,
                summary: bookData.briefSummary,
              },
            });
          }
        } catch (parseError) {
          console.error('Error parsing book identification response:', parseError);
        }
        
        return JSON.stringify({
          success: false,
          error: 'Could not parse book identification response',
        });
      } catch (error) {
        console.error('Error identifying book:', error);
        return JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    },
  });
};

// Tool for extracting themes from book discussion
export const createExtractThemesTool = () => {
  return new DynamicStructuredTool({
    name: 'extract_themes',
    description: 'Extracts themes and lessons from a book based on the story and child\'s discussion',
    schema: z.object({
      plotSummary: z.string().describe('Summary of the book\'s plot'),
      discussionPoints: z.array(z.string()).describe('Key points from discussion with the child'),
    }),
    func: async ({ plotSummary, discussionPoints }) => {
      // This would typically involve NLP or Claude analysis
      // For now, return structured data
      const themes = [
        'Friendship and cooperation',
        'Consequences of actions',
        'Problem-solving',
      ];
      
      return JSON.stringify({
        themes,
        lessons: [
          'Work together to solve problems',
          'Think before you act',
        ],
      });
    },
  });
};

// Tool for extracting characters from the story
export const createExtractCharactersTool = () => {
  return new DynamicStructuredTool({
    name: 'extract_characters',
    description: 'Identifies and describes main characters from the book',
    schema: z.object({
      bookTitle: z.string().describe('Title of the book'),
      discussionNotes: z.array(z.string()).describe('Notes about characters from discussion'),
    }),
    func: async ({ bookTitle, discussionNotes }) => {
      // In a real implementation, this would analyze the book data
      return JSON.stringify({
        characters: [
          {
            name: 'Main Character',
            role: 'protagonist',
            traits: ['brave', 'curious', 'kind'],
            description: 'The hero of the story',
          },
        ],
      });
    },
  });
};

// Tool for identifying game potential in story elements
export const createExtractGamePotentialTool = () => {
  return new DynamicStructuredTool({
    name: 'extract_game_potential',
    description: 'Identifies story elements that would work well as game mechanics',
    schema: z.object({
      plotSummary: z.string().describe('Summary of the book'),
      keyMoments: z.array(z.string()).describe('Important moments in the story'),
      characters: z.array(z.string()).describe('Character names'),
    }),
    func: async ({ plotSummary, keyMoments, characters }) => {
      // Analyze story elements for game potential
      return JSON.stringify({
        gameElements: [
          {
            type: 'collectible',
            name: 'Story Item',
            description: 'Key item from the book',
            storyConnection: 'Relates to main plot',
          },
          {
            type: 'obstacle',
            name: 'Story Challenge',
            description: 'Challenge from the book',
            storyConnection: 'Represents conflict in story',
          },
        ],
      });
    },
  });
};

