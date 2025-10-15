import { StateGraph, END, START } from '@langchain/langgraph';
import { getStoryAnalyst } from './storyAnalystAgent';
import { getGameDesigner } from './gameDesignerAgent';
import { getCodeGenerator } from './codeGeneratorAgent';
import { BookAnalysis } from '../schemas/bookSchema';
import { GameDesign } from '../schemas/gameDesignSchema';

/**
 * State interface for the game creation workflow
 */
export interface GameCreationState {
  // Current phase
  phase: 'book-capture' | 'book-discussion' | 'game-design' | 'code-generation' | 'complete' | 'error';
  
  // Book information
  bookImageUri?: string;
  bookAnalysis?: BookAnalysis;
  
  // Game design
  gameDesign?: GameDesign;
  
  // Generated game
  generatedCode?: string;
  generatedHtml?: string;
  
  // Conversation history
  conversationHistory: any[];
  
  // Current agent message
  currentMessage?: string;
  
  // Waiting for user input
  awaitingUserInput: boolean;
  userInput?: string;
  
  // Error handling
  error?: string;
  
  // Progress tracking
  startTime: Date;
  generationStartTime?: Date;
}

/**
 * Orchestrator class that coordinates the three agents
 * Uses LangGraph to manage state transitions
 */
export class GameCreationOrchestrator {
  private storyAnalyst: any;
  private gameDesigner: any;
  private codeGenerator: any;
  private graph: any;
  private state: GameCreationState;

  constructor() {
    this.state = {
      phase: 'book-capture',
      conversationHistory: [],
      awaitingUserInput: false,
      startTime: new Date(),
    };
  }

  /**
   * Initialize all agents
   */
  async initialize() {
    console.log('Initializing agents...');
    this.storyAnalyst = await getStoryAnalyst();
    this.gameDesigner = await getGameDesigner();
    this.codeGenerator = await getCodeGenerator();
    console.log('All agents initialized!');
  }

  /**
   * Start the book discussion phase
   */
  async startBookDiscussion(bookImageUri: string) {
    this.state.phase = 'book-discussion';
    this.state.bookImageUri = bookImageUri;

    try {
      const result = await this.storyAnalyst.analyzeBook(
        bookImageUri,
        this.state.conversationHistory
      );

      if (result.success) {
        this.state.currentMessage = result.output;
        this.state.awaitingUserInput = true;
        this.addToHistory('agent', result.output, 'story-analyst');
      } else {
        this.state.error = result.error;
        this.state.phase = 'error';
      }

      return this.state;
    } catch (error) {
      this.state.error = error instanceof Error ? error.message : 'Unknown error';
      this.state.phase = 'error';
      return this.state;
    }
  }

  /**
   * Process user response in book discussion
   */
  async processBookDiscussionResponse(userResponse: string) {
    this.addToHistory('user', userResponse);
    this.state.awaitingUserInput = false;

    try {
      const result = await this.storyAnalyst.processResponse(
        userResponse,
        'book discussion',
        this.state.conversationHistory
      );

      if (result.success) {
        this.state.currentMessage = result.output;
        
        // Check if we should complete the analysis
        if (this.shouldCompleteBookDiscussion()) {
          return await this.completeBookDiscussion();
        } else {
          this.state.awaitingUserInput = true;
          this.addToHistory('agent', result.output, 'story-analyst');
        }
      } else {
        this.state.error = result.error;
        this.state.phase = 'error';
      }

      return this.state;
    } catch (error) {
      this.state.error = error instanceof Error ? error.message : 'Unknown error';
      this.state.phase = 'error';
      return this.state;
    }
  }

  /**
   * Complete book discussion and transition to game design
   */
  async completeBookDiscussion() {
    try {
      const result = await this.storyAnalyst.completeAnalysis(
        this.state.conversationHistory
      );

      if (result.success) {
        // Parse the book analysis from the output
        try {
          const analysisMatch = result.output.match(/\{[\s\S]*\}/);
          if (analysisMatch) {
            this.state.bookAnalysis = JSON.parse(analysisMatch[0]);
          }
        } catch (parseError) {
          console.error('Error parsing book analysis:', parseError);
        }

        // Transition to game design
        return await this.startGameDesign();
      } else {
        this.state.error = result.error;
        this.state.phase = 'error';
        return this.state;
      }
    } catch (error) {
      this.state.error = error instanceof Error ? error.message : 'Unknown error';
      this.state.phase = 'error';
      return this.state;
    }
  }

  /**
   * Start game design phase
   */
  async startGameDesign() {
    if (!this.state.bookAnalysis) {
      this.state.error = 'No book analysis available';
      this.state.phase = 'error';
      return this.state;
    }

    this.state.phase = 'game-design';
    this.state.conversationHistory = []; // Fresh conversation for game design

    try {
      const result = await this.gameDesigner.startDesign(
        this.state.bookAnalysis,
        this.state.conversationHistory
      );

      if (result.success) {
        this.state.currentMessage = result.output;
        this.state.awaitingUserInput = true;
        this.addToHistory('agent', result.output, 'game-designer');
      } else {
        this.state.error = result.error;
        this.state.phase = 'error';
      }

      return this.state;
    } catch (error) {
      this.state.error = error instanceof Error ? error.message : 'Unknown error';
      this.state.phase = 'error';
      return this.state;
    }
  }

  /**
   * Process user response in game design
   */
  async processGameDesignResponse(userResponse: string) {
    this.addToHistory('user', userResponse);
    this.state.awaitingUserInput = false;

    try {
      const result = await this.gameDesigner.continueDesign(
        userResponse,
        'game design',
        this.state.conversationHistory
      );

      if (result.success) {
        this.state.currentMessage = result.output;
        
        // Check if we should finalize the design
        if (this.shouldFinalizeGameDesign()) {
          return await this.finalizeGameDesign();
        } else {
          this.state.awaitingUserInput = true;
          this.addToHistory('agent', result.output, 'game-designer');
        }
      } else {
        this.state.error = result.error;
        this.state.phase = 'error';
      }

      return this.state;
    } catch (error) {
      this.state.error = error instanceof Error ? error.message : 'Unknown error';
      this.state.phase = 'error';
      return this.state;
    }
  }

  /**
   * Finalize game design and start code generation
   */
  async finalizeGameDesign() {
    try {
      const result = await this.gameDesigner.finalizeDesign(
        this.state.conversationHistory
      );

      if (result.success) {
        // Parse the game design
        try {
          const designMatch = result.output.match(/\{[\s\S]*\}/);
          if (designMatch) {
            this.state.gameDesign = JSON.parse(designMatch[0]);
          }
        } catch (parseError) {
          console.error('Error parsing game design:', parseError);
        }

        // Transition to code generation
        return await this.startCodeGeneration();
      } else {
        this.state.error = result.error;
        this.state.phase = 'error';
        return this.state;
      }
    } catch (error) {
      this.state.error = error instanceof Error ? error.message : 'Unknown error';
      this.state.phase = 'error';
      return this.state;
    }
  }

  /**
   * Start code generation phase
   */
  async startCodeGeneration() {
    if (!this.state.gameDesign) {
      this.state.error = 'No game design available';
      this.state.phase = 'error';
      return this.state;
    }

    this.state.phase = 'code-generation';
    this.state.generationStartTime = new Date();

    try {
      const result = await this.codeGenerator.generateGame(this.state.gameDesign);

      if (result.success) {
        this.state.generatedCode = result.code;
        this.state.generatedHtml = result.html;
        this.state.phase = 'complete';
        this.state.currentMessage = 'Your game is ready to play!';
      } else {
        this.state.error = result.error;
        this.state.phase = 'error';
      }

      return this.state;
    } catch (error) {
      this.state.error = error instanceof Error ? error.message : 'Unknown error';
      this.state.phase = 'error';
      return this.state;
    }
  }

  /**
   * Handle "Spice It Up" feedback
   */
  async spiceItUp(feedback: string) {
    if (!this.state.gameDesign || !this.state.generatedCode) {
      this.state.error = 'No game to modify';
      return this.state;
    }

    try {
      // Update the design
      const designResult = await this.gameDesigner.spiceItUp(
        this.state.gameDesign,
        feedback,
        []
      );

      if (designResult.success) {
        // Parse updated design
        try {
          const designMatch = designResult.output.match(/\{[\s\S]*\}/);
          if (designMatch) {
            this.state.gameDesign = JSON.parse(designMatch[0]);
          }
        } catch (parseError) {
          console.error('Error parsing updated design:', parseError);
        }

        // Regenerate code
        const codeResult = await this.codeGenerator.regenerateWithFeedback(
          this.state.gameDesign,
          feedback,
          this.state.generatedCode
        );

        if (codeResult.success) {
          this.state.generatedCode = codeResult.code;
          this.state.generatedHtml = codeResult.html;
          this.state.currentMessage = 'Your updated game is ready!';
        } else {
          this.state.error = codeResult.error;
        }
      } else {
        this.state.error = designResult.error;
      }

      return this.state;
    } catch (error) {
      this.state.error = error instanceof Error ? error.message : 'Unknown error';
      return this.state;
    }
  }

  /**
   * Get current state
   */
  getState(): GameCreationState {
    return this.state;
  }

  /**
   * Helper methods
   */
  private addToHistory(role: 'user' | 'agent', content: string, agentType?: string) {
    this.state.conversationHistory.push({
      role,
      content,
      agentType,
      timestamp: new Date(),
    });
  }

  private shouldCompleteBookDiscussion(): boolean {
    // Complete after 5+ exchanges or if agent signals completion
    return this.state.conversationHistory.length >= 10;
  }

  private shouldFinalizeGameDesign(): boolean {
    // Finalize after 5+ exchanges or if agent signals ready
    return this.state.conversationHistory.length >= 10;
  }
}

// Export singleton
let orchestratorInstance: GameCreationOrchestrator | null = null;

export async function getOrchestrator(): Promise<GameCreationOrchestrator> {
  if (!orchestratorInstance) {
    orchestratorInstance = new GameCreationOrchestrator();
    await orchestratorInstance.initialize();
  }
  return orchestratorInstance;
}

