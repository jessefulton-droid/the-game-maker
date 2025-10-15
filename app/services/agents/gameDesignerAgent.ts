import { createAgent, BaseAgent } from './agentFactory';
import { createClaudeClient } from '../claudeAPI';
import {
  createSuggestGameTypeTool,
  createBrainstormMechanicsTool,
  createSpiceItUpTool,
  createValidateDesignTool,
} from '../tools/gameTools';
import {
  createAskQuestionTool,
  createProcessResponseTool,
} from '../tools/chatTools';
import { GameDesignSchema } from '../schemas/gameDesignSchema';
import { BookAnalysis } from '../schemas/bookSchema';

const GAME_DESIGNER_PROMPT = `
You are an enthusiastic and creative game designer who specializes in making 90s arcade-style games!

Your job is to:
1. Receive a book analysis from the Story Analyst
2. Brainstorm game ideas based on the book's story elements
3. Collaborate with the child to design the perfect game
4. Suggest creative "spice it up" ideas to make the game more exciting
5. Create a complete game design document for the Code Generator

Game design principles:
- Keep it simple and fun (90s arcade style)
- Use story elements as game mechanics (characters, items, challenges)
- Make it feel connected to the book
- Ensure it's achievable in Phaser.js
- Focus on replayability with unlimited lives

Game types to consider:
- Side-scrolling platformer (jump, run, collect)
- Top-down collection game (move around, gather items, avoid enemies)
- Obstacle avoider (dodge incoming obstacles)

When working with kids:
- Present 2-3 options and let them choose
- Build on their ideas enthusiastically
- Suggest enhancements that align with their vision
- Make them feel like the co-creator
- Keep the design conversation fun and exciting

Remember:
- The game must be completable in under 15 minutes of generation time
- Use the Phaser.js templates as a foundation
- Provide clear, implementable mechanics
- Include visual style guidance for the code generator
`;

/**
 * Game Designer Agent
 * Specializes in translating stories into fun game designs
 */
export class GameDesignerAgent extends BaseAgent {
  constructor() {
    super('Game Designer', 'Creative Game Design Expert', null as any);
  }

  /**
   * Initialize the agent with tools
   */
  async initialize() {
    const tools = [
      createSuggestGameTypeTool(),
      createBrainstormMechanicsTool(),
      createSpiceItUpTool(),
      createValidateDesignTool(),
      createAskQuestionTool(),
      createProcessResponseTool(),
    ];

    const llm = createClaudeClient({ temperature: 0.9 }); // High creativity for game design

    this.executor = await createAgent({
      name: this.name,
      role: this.role,
      systemPrompt: GAME_DESIGNER_PROMPT,
      tools,
      llm,
    });
  }

  /**
   * Start the game design process from book analysis
   */
  async startDesign(bookAnalysis: BookAnalysis, conversationHistory: any[]) {
    const input = `
I have a book analysis to work with:

Title: ${bookAnalysis.book.title}
Author: ${bookAnalysis.book.author}
Plot: ${bookAnalysis.plotSummary}
Themes: ${bookAnalysis.themes.join(', ')}
Characters: ${bookAnalysis.characters.map(c => c.name).join(', ')}
Game Elements: ${bookAnalysis.gameElements.map(e => e.name).join(', ')}

Please:
1. Analyze the story elements for game potential
2. Suggest 2-3 game types that would fit this book
3. Ask the child which type sounds most fun to them
4. Prepare to collaborate on the detailed design

Present the options in an exciting, kid-friendly way!
`;

    return this.invoke(input, conversationHistory);
  }

  /**
   * Continue designing based on child's choices
   */
  async continueDesign(childResponse: string, context: string, conversationHistory: any[]) {
    const input = `
The child responded: "${childResponse}"

Context: ${context}

Please:
1. Acknowledge their choice enthusiastically
2. Ask about specific game elements they want (what to collect, what obstacles, special powers)
3. Suggest creative ideas that align with the book's story
4. Build the game design collaboratively

Keep it fun and make them feel like the lead designer!
`;

    return this.invoke(input, conversationHistory);
  }

  /**
   * Apply "spice it up" suggestions
   */
  async spiceItUp(currentDesign: any, feedback: string, conversationHistory: any[]) {
    const input = `
Current game design: ${JSON.stringify(currentDesign)}

Child's feedback: "${feedback}"

Please:
1. Understand what they want to change or enhance
2. Suggest creative improvements that maintain the 15-minute generation limit
3. Update only the relevant parts of the design
4. Make the changes exciting!

Focus on quick wins that make a big impact.
`;

    return this.invoke(input, conversationHistory);
  }

  /**
   * Finalize the game design
   */
  async finalizeDesign(conversationHistory: any[]) {
    const input = `
Based on our design conversation, create a complete game design document.

The design must include:
1. Game title (based on the book)
2. Game type (platformer, top-down, or obstacle-avoider)
3. Main objective
4. Core mechanics (how the game plays)
5. Characters (player, enemies, NPCs)
6. Collectibles (items to gather)
7. Obstacles (things to avoid)
8. Power-ups (special abilities)
9. Level design (layout and difficulty)
10. Visual style (colors, art style, animations)

Format as JSON matching the GameDesign schema.
Ensure everything is feasible for Phaser.js and can be generated in under 15 minutes.
`;

    return this.invoke(input, conversationHistory);
  }

  /**
   * Validate that the design is feasible
   */
  async validateDesign(gameDesign: any) {
    const input = `
Validate this game design for feasibility:

${JSON.stringify(gameDesign, null, 2)}

Check:
1. Can this be implemented in Phaser.js?
2. Is it achievable in under 15 minutes of generation time?
3. Are the mechanics clear and implementable?
4. Does it maintain the 90s arcade style?

Provide validation results and suggestions if needed.
`;

    return this.invoke(input, []);
  }
}

// Export a singleton instance
let gameDesignerInstance: GameDesignerAgent | null = null;

export async function getGameDesigner(): Promise<GameDesignerAgent> {
  if (!gameDesignerInstance) {
    gameDesignerInstance = new GameDesignerAgent();
    await gameDesignerInstance.initialize();
  }
  return gameDesignerInstance;
}

