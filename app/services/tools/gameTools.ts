import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

// Tool for suggesting game types based on story
export const createSuggestGameTypeTool = () => {
  return new DynamicStructuredTool({
    name: 'suggest_game_type',
    description: 'Suggests appropriate 90s arcade game types based on the book\'s story elements',
    schema: z.object({
      bookThemes: z.array(z.string()).describe('Themes from the book'),
      characters: z.array(z.string()).describe('Main characters'),
      plotType: z.string().describe('Type of plot (adventure, problem-solving, journey, etc.)'),
    }),
    func: async ({ bookThemes, characters, plotType }) => {
      // Analyze story and suggest game types
      const suggestions = [];
      
      if (plotType.includes('journey') || plotType.includes('adventure')) {
        suggestions.push({
          type: 'platformer',
          reason: 'Side-scrolling platformer fits the journey narrative',
          mechanics: ['jumping', 'running', 'collecting'],
        });
      }
      
      if (plotType.includes('collect') || bookThemes.some(t => t.includes('gather'))) {
        suggestions.push({
          type: 'top-down',
          reason: 'Top-down collection game matches the gathering theme',
          mechanics: ['movement', 'collecting', 'avoiding'],
        });
      }
      
      suggestions.push({
        type: 'obstacle-avoider',
        reason: 'Fast-paced obstacle avoidance creates exciting gameplay',
        mechanics: ['dodging', 'quick reflexes', 'timing'],
      });
      
      return JSON.stringify({
        suggestions,
        recommended: suggestions[0],
      });
    },
  });
};

// Tool for brainstorming game mechanics
export const createBrainstormMechanicsTool = () => {
  return new DynamicStructuredTool({
    name: 'brainstorm_mechanics',
    description: 'Generates creative game mechanics based on story elements',
    schema: z.object({
      gameType: z.enum(['platformer', 'top-down', 'obstacle-avoider', 'custom']),
      storyElements: z.array(z.string()).describe('Key elements from the story'),
      childPreferences: z.array(z.string()).describe('What the child wants in the game'),
    }),
    func: async ({ gameType, storyElements, childPreferences }) => {
      const mechanics = [];
      
      // Generate mechanics based on game type
      if (gameType === 'platformer') {
        mechanics.push(
          { name: 'Jump', description: 'Jump over obstacles', difficulty: 'easy' },
          { name: 'Double Jump', description: 'Jump twice in the air', difficulty: 'medium' },
          { name: 'Wall Slide', description: 'Slide down walls', difficulty: 'medium' }
        );
      } else if (gameType === 'top-down') {
        mechanics.push(
          { name: 'Free Movement', description: 'Move in all directions', difficulty: 'easy' },
          { name: 'Dash', description: 'Quick dash in any direction', difficulty: 'medium' },
          { name: 'Area Collection', description: 'Collect items in an area', difficulty: 'easy' }
        );
      } else if (gameType === 'obstacle-avoider') {
        mechanics.push(
          { name: 'Left/Right Movement', description: 'Move horizontally', difficulty: 'easy' },
          { name: 'Speed Boost', description: 'Temporary speed increase', difficulty: 'medium' },
          { name: 'Invincibility', description: 'Brief invulnerability', difficulty: 'medium' }
        );
      }
      
      return JSON.stringify({
        mechanics,
        combinations: [
          'Combine jumping with collecting for classic platformer feel',
          'Add power-ups for variety and excitement',
        ],
      });
    },
  });
};

// Tool for the "spice it up" feature
export const createSpiceItUpTool = () => {
  return new DynamicStructuredTool({
    name: 'spice_it_up',
    description: 'Suggests creative enhancements to make the game more exciting',
    schema: z.object({
      currentDesign: z.string().describe('JSON description of current game design'),
      childFeedback: z.string().optional().describe('Specific feedback from the child'),
    }),
    func: async ({ currentDesign, childFeedback }) => {
      const enhancements = [
        {
          category: 'Visual',
          suggestion: 'Add particle effects when collecting items',
          impact: 'Makes game feel more dynamic and rewarding',
        },
        {
          category: 'Audio',
          suggestion: 'Add fun sound effects for actions',
          impact: 'Enhances feedback and immersion',
        },
        {
          category: 'Gameplay',
          suggestion: 'Add combo system for collecting multiple items quickly',
          impact: 'Rewards skilled play and adds depth',
        },
        {
          category: 'Story',
          suggestion: 'Add story-based checkpoints with dialogue',
          impact: 'Connects game more closely to the book',
        },
      ];
      
      return JSON.stringify({
        enhancements,
        quickWins: enhancements.slice(0, 2),
        needsMoreTime: enhancements.slice(2),
      });
    },
  });
};

// Tool for validating game design feasibility
export const createValidateDesignTool = () => {
  return new DynamicStructuredTool({
    name: 'validate_design',
    description: 'Checks if a game design is feasible to implement in Phaser.js within time constraints',
    schema: z.object({
      gameDesign: z.string().describe('JSON description of game design'),
      timeLimit: z.number().describe('Maximum generation time in minutes'),
    }),
    func: async ({ gameDesign, timeLimit }) => {
      // Simple feasibility check
      const design = JSON.parse(gameDesign);
      const complexity = calculateComplexity(design);
      const estimatedTime = complexity * 2; // rough estimate
      
      return JSON.stringify({
        isFeasible: estimatedTime <= timeLimit,
        estimatedTime: `${estimatedTime} minutes`,
        complexity: complexity > 5 ? 'high' : complexity > 3 ? 'medium' : 'low',
        warnings: complexity > 5 ? ['Design is complex, may take longer to generate'] : [],
        suggestions: complexity > 5 ? ['Consider simplifying some mechanics'] : [],
      });
    },
  });
};

// Helper function to calculate design complexity
function calculateComplexity(design: any): number {
  let score = 1; // base complexity
  
  if (design.mechanics) score += design.mechanics.length * 0.5;
  if (design.characters) score += design.characters.length * 0.3;
  if (design.collectibles) score += design.collectibles.length * 0.2;
  if (design.obstacles) score += design.obstacles.length * 0.3;
  if (design.powerUps) score += design.powerUps.length * 0.3;
  
  return Math.round(score);
}

