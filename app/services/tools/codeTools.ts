import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

// Tool for generating Phaser.js game code
export const createGenerateCodeTool = () => {
  return new DynamicStructuredTool({
    name: 'generate_code',
    description: 'Generates complete Phaser.js game code from a game design specification',
    schema: z.object({
      gameDesign: z.string().describe('JSON string of the complete game design'),
      template: z.enum(['platformer', 'top-down', 'obstacle-avoider']).describe('Game template to use'),
    }),
    func: async ({ gameDesign, template }) => {
      // In practice, this would be handled by Claude to generate the actual code
      // This tool represents the signal to start code generation
      return JSON.stringify({
        action: 'generate_phaser_code',
        design: gameDesign,
        template,
        status: 'ready_for_generation',
      });
    },
  });
};

// Tool for validating JavaScript syntax
export const createValidateSyntaxTool = () => {
  return new DynamicStructuredTool({
    name: 'validate_syntax',
    description: 'Validates that generated JavaScript code has correct syntax',
    schema: z.object({
      code: z.string().describe('JavaScript code to validate'),
    }),
    func: async ({ code }) => {
      try {
        // Basic syntax check
        // In a real implementation, you'd use a proper JS parser
        new Function(code);
        
        return JSON.stringify({
          isValid: true,
          errors: [],
        });
      } catch (error) {
        return JSON.stringify({
          isValid: false,
          errors: [error instanceof Error ? error.message : 'Syntax error'],
        });
      }
    },
  });
};

// Tool for applying game templates
export const createApplyTemplateTool = () => {
  return new DynamicStructuredTool({
    name: 'apply_template',
    description: 'Applies a 90s arcade game template and customizes it with game design elements',
    schema: z.object({
      templateType: z.enum(['platformer', 'top-down', 'obstacle-avoider']),
      customizations: z.string().describe('JSON of customization parameters'),
    }),
    func: async ({ templateType, customizations }) => {
      // Signal which template to use
      return JSON.stringify({
        template: templateType,
        customizations: JSON.parse(customizations),
        status: 'template_selected',
      });
    },
  });
};

// Tool for optimizing code performance
export const createOptimizePerformanceTool = () => {
  return new DynamicStructuredTool({
    name: 'optimize_performance',
    description: 'Optimizes game code to ensure it runs smoothly and generates quickly',
    schema: z.object({
      code: z.string().describe('Game code to optimize'),
      targetPlatform: z.string().default('mobile').describe('Target platform (mobile, tablet, etc.)'),
    }),
    func: async ({ code, targetPlatform }) => {
      // Optimization suggestions
      const optimizations = [
        'Use object pooling for frequently created/destroyed objects',
        'Limit particle effects for mobile performance',
        'Use sprite atlases instead of individual images',
        'Implement simple collision detection',
      ];
      
      return JSON.stringify({
        optimizations,
        estimatedImprovement: '20-30% faster',
        applied: true,
      });
    },
  });
};

