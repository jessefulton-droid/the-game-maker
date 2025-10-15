import { createAgent, BaseAgent } from './agentFactory';
import { createClaudeCodeClient } from '../claudeAPI';
import {
  createGenerateCodeTool,
  createValidateSyntaxTool,
  createApplyTemplateTool,
  createOptimizePerformanceTool,
} from '../tools/codeTools';
import { GameDesign } from '../schemas/gameDesignSchema';
import { getTemplate, generateGameHTML } from '../../templates/phaserTemplates';

const CODE_GENERATOR_PROMPT = `
You are an expert Phaser.js game developer who creates fun, working 90s arcade-style games!

Your job is to:
1. Receive a complete game design from the Game Designer
2. Select the appropriate Phaser.js template (platformer, top-down, or obstacle-avoider)
3. Generate complete, functional game code
4. Ensure the code is optimized for mobile/tablet
5. Include all necessary game mechanics
6. Add the "Play Again" button and unlimited lives

Technical requirements:
- Use Phaser 3.70.0
- Create complete, self-contained games
- Use simple geometric shapes for graphics (rectangles, circles) - no external assets needed
- Implement all specified mechanics clearly
- Optimize for performance on mobile devices
- Generate code that runs immediately without errors
- Keep generation time under 15 minutes

Code structure:
- Config object with proper physics setup
- Preload function (minimal - use shapes)
- Create function (setup game objects, collisions, UI)
- Update function (game loop logic)
- Helper functions for game events
- Game over screen with "Play Again" button

Style guidelines:
- Use the color scheme from the design
- Create colorful, fun visuals with Phaser shapes
- Add score tracking
- Include simple animations (tween, velocity changes)
- Make it feel polished despite simple graphics

Remember:
- The game MUST work when loaded in a WebView
- No external asset loading (use Phaser graphics primitives)
- Unlimited lives by default
- Always include a "Play Again" button on game over
- Code must be production-ready, not a prototype
`;

/**
 * Code Generator Agent
 * Specializes in generating working Phaser.js game code
 */
export class CodeGeneratorAgent extends BaseAgent {
  constructor() {
    super('Code Generator', 'Phaser.js Game Developer', null as any);
  }

  /**
   * Initialize the agent with tools
   */
  async initialize() {
    const tools = [
      createGenerateCodeTool(),
      createValidateSyntaxTool(),
      createApplyTemplateTool(),
      createOptimizePerformanceTool(),
    ];

    const llm = createClaudeCodeClient(); // Optimized for code generation

    this.executor = await createAgent({
      name: this.name,
      role: this.role,
      systemPrompt: CODE_GENERATOR_PROMPT,
      tools,
      llm,
    });
  }

  /**
   * Generate game code from design
   */
  async generateGame(gameDesign: GameDesign) {
    // Get the base template
    const template = getTemplate(gameDesign.gameType);

    const input = `
Generate a complete Phaser.js game based on this design:

${JSON.stringify(gameDesign, null, 2)}

Requirements:
1. Use the ${gameDesign.gameType} template as a foundation
2. Customize it with all the specified mechanics, characters, collectibles, and obstacles
3. Use the visual style specified: ${JSON.stringify(gameDesign.visualStyle)}
4. Implement the objective: ${gameDesign.objective}
5. Include unlimited lives (no game over from losing lives)
6. Add a "Play Again" button that reloads the game
7. Make it colorful and fun!

Technical notes:
- Use Phaser.Graphics for shapes (no image loading)
- Use setTint() for colors
- Use setDisplaySize() for sizing
- Keep it simple but polished
- Ensure all code is syntactically correct

Return ONLY the complete JavaScript game code (no markdown, no explanations).
The code will be inserted into the HTML template.
`;

    try {
      const result = await this.invoke(input, []);
      
      if (result.success) {
        // Extract the code from the response
        let code = result.output;
        
        // Remove markdown code blocks if present
        code = code.replace(/```javascript\n?/g, '').replace(/```\n?/g, '');
        
        // Validate the syntax
        const validation = await this.validateCode(code);
        
        if (!validation.isValid) {
          console.error('Generated code has syntax errors:', validation.errors);
          throw new Error('Generated code validation failed');
        }
        
        // Generate the complete HTML
        const html = generateGameHTML(template, code);
        
        return {
          success: true,
          code,
          html,
          template: gameDesign.gameType,
        };
      }
      
      return result;
    } catch (error) {
      console.error('Error generating game:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Validate generated code
   */
  async validateCode(code: string) {
    try {
      // Basic syntax check
      new Function(code);
      
      // Check for required elements
      const hasConfig = code.includes('config');
      const hasPreload = code.includes('function preload');
      const hasCreate = code.includes('function create');
      const hasUpdate = code.includes('function update');
      const hasPlayAgain = code.includes('Play Again') || code.includes('play again');
      
      const warnings = [];
      if (!hasConfig) warnings.push('Missing game config');
      if (!hasPreload) warnings.push('Missing preload function');
      if (!hasCreate) warnings.push('Missing create function');
      if (!hasUpdate) warnings.push('Missing update function');
      if (!hasPlayAgain) warnings.push('Missing Play Again button');
      
      return {
        isValid: true,
        warnings,
        hasAllRequiredElements: warnings.length === 0,
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [error instanceof Error ? error.message : 'Syntax error'],
      };
    }
  }

  /**
   * Regenerate game with modifications
   */
  async regenerateWithFeedback(originalDesign: GameDesign, feedback: string, previousCode: string) {
    const input = `
Original game design: ${JSON.stringify(originalDesign)}

Previous generated code: ${previousCode}

User feedback: "${feedback}"

Please modify the game code to incorporate this feedback.
Only change the relevant parts, keep everything else working.
Return the complete updated JavaScript code.
`;

    try {
      const result = await this.invoke(input, []);
      
      if (result.success) {
        let code = result.output;
        code = code.replace(/```javascript\n?/g, '').replace(/```\n?/g, '');
        
        const template = getTemplate(originalDesign.gameType);
        const html = generateGameHTML(template, code);
        
        return {
          success: true,
          code,
          html,
          template: originalDesign.gameType,
        };
      }
      
      return result;
    } catch (error) {
      console.error('Error regenerating game:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Export a singleton instance
let codeGeneratorInstance: CodeGeneratorAgent | null = null;

export async function getCodeGenerator(): Promise<CodeGeneratorAgent> {
  if (!codeGeneratorInstance) {
    codeGeneratorInstance = new CodeGeneratorAgent();
    await codeGeneratorInstance.initialize();
  }
  return codeGeneratorInstance;
}

