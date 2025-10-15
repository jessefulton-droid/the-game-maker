import { createAgent, BaseAgent } from './agentFactory';
import { createClaudeClient } from '../claudeAPI';
import {
  createIdentifyBookTool,
  createExtractThemesTool,
  createExtractCharactersTool,
  createExtractGamePotentialTool,
} from '../tools/bookTools';
import {
  createAskQuestionTool,
  createProcessResponseTool,
  createGenerateFollowUpTool,
} from '../tools/chatTools';
import { BookAnalysisSchema } from '../schemas/bookSchema';

const STORY_ANALYST_PROMPT = `
You are a friendly and enthusiastic children's literature expert who loves talking to kids about books!

Your job is to:
1. Identify the book from a cover photo
2. Have a warm, engaging conversation with the child about the book
3. Ask about what they liked, what the story was about, and what they learned
4. Extract key story elements that would make great game components
5. Build excitement about turning their favorite book into a game!

Remember:
- Keep questions simple and age-appropriate
- Be genuinely interested in their answers
- Use their enthusiasm to guide the conversation
- Look for story elements that have game potential (characters, challenges, goals, items)
- Summarize what you learned in a structured format for the game designer

When talking to kids:
- Use encouraging language ("That's so cool!", "I love that part too!")
- Ask one question at a time
- Build on their responses
- Be patient and let them express themselves
- Make them feel heard and valued
`;

/**
 * Story Analyst Agent
 * Specializes in understanding children's books and discussing them with kids
 */
export class StoryAnalystAgent extends BaseAgent {
  constructor() {
    super('Story Analyst', 'Children\'s Literature Expert', null as any);
  }

  /**
   * Initialize the agent with tools
   */
  async initialize() {
    const tools = [
      createIdentifyBookTool(),
      createExtractThemesTool(),
      createExtractCharactersTool(),
      createExtractGamePotentialTool(),
      createAskQuestionTool(),
      createProcessResponseTool(),
      createGenerateFollowUpTool(),
    ];

    const llm = createClaudeClient({ temperature: 0.8 }); // More creative for conversation

    this.executor = await createAgent({
      name: this.name,
      role: this.role,
      systemPrompt: STORY_ANALYST_PROMPT,
      tools,
      llm,
    });
  }

  /**
   * Analyze a book and conduct discussion
   */
  async analyzeBook(bookImageUri: string, conversationHistory: string[]) {
    const input = `
I have a photo of a children's book cover at: ${bookImageUri}

Please:
1. Identify the book from the cover
2. Engage in a conversation with the child about the book
3. Ask them what the book was about
4. Ask what they liked most
5. Ask what they learned
6. Extract themes, characters, and game-worthy elements

After the discussion, provide a structured analysis following the BookAnalysis schema.
`;

    return this.invoke(input, conversationHistory);
  }

  /**
   * Process a child's response and generate follow-up
   */
  async processResponse(childResponse: string, context: string, conversationHistory: any[]) {
    const input = `
The child just said: "${childResponse}"

Context: ${context}

Please:
1. Acknowledge their response warmly
2. Ask a relevant follow-up question to learn more
3. Guide the conversation toward understanding what they loved about the book

Keep the conversation natural and kid-friendly!
`;

    return this.invoke(input, conversationHistory);
  }

  /**
   * Complete the analysis and prepare handoff to Game Designer
   */
  async completeAnalysis(conversationHistory: any[]) {
    const input = `
Based on our conversation, please create a complete book analysis.

Extract and structure:
- Book title and author
- Plot summary (2-3 sentences)
- Main themes
- Key characters with descriptions
- Important plot points
- Story elements that would work well in a game (collectibles, obstacles, goals)
- Notes from our discussion

Format the output as a structured JSON matching the BookAnalysis schema so the Game Designer Agent can use it.
`;

    return this.invoke(input, conversationHistory);
  }
}

// Export a singleton instance
let storyAnalystInstance: StoryAnalystAgent | null = null;

export async function getStoryAnalyst(): Promise<StoryAnalystAgent> {
  if (!storyAnalystInstance) {
    storyAnalystInstance = new StoryAnalystAgent();
    await storyAnalystInstance.initialize();
  }
  return storyAnalystInstance;
}

