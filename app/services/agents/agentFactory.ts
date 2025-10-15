import { ChatAnthropic } from '@langchain/anthropic';
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { DynamicStructuredTool } from '@langchain/core/tools';

export interface AgentConfig {
  name: string;
  role: string;
  systemPrompt: string;
  tools: DynamicStructuredTool[];
  llm?: ChatAnthropic;
  temperature?: number;
}

/**
 * Factory function to create specialized agents
 * Each agent has a specific role and set of tools
 */
export async function createAgent(config: AgentConfig): Promise<AgentExecutor> {
  const {
    name,
    role,
    systemPrompt,
    tools,
    llm,
    temperature = 0.7,
  } = config;

  // Use provided LLM or create a new one
  const model = llm || new ChatAnthropic({
    modelName: 'claude-sonnet-4-20250514',
    temperature,
  });

  // Create the prompt template for this agent
  const prompt = ChatPromptTemplate.fromMessages([
    ['system', `You are ${name}, a ${role}.
    
${systemPrompt}

You have access to the following tools to help you complete your tasks.
Always think step by step about what information you need and which tools to use.
Be friendly and conversational, especially when talking to children.`],
    ['placeholder', '{chat_history}'],
    ['human', '{input}'],
    ['placeholder', '{agent_scratchpad}'],
  ]);

  // Create the tool-calling agent
  const agent = await createToolCallingAgent({
    llm: model,
    tools,
    prompt,
  });

  // Create the agent executor
  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: true, // Enable logging for debugging
    maxIterations: 10, // Prevent infinite loops
    returnIntermediateSteps: true, // Return tool call details
  });

  return agentExecutor;
}

/**
 * Base agent class for shared functionality
 */
export class BaseAgent {
  name: string;
  role: string;
  executor: AgentExecutor;

  constructor(name: string, role: string, executor: AgentExecutor) {
    this.name = name;
    this.role = role;
    this.executor = executor;
  }

  /**
   * Invoke the agent with an input
   */
  async invoke(input: string, chatHistory: any[] = []) {
    try {
      const result = await this.executor.invoke({
        input,
        chat_history: chatHistory,
      });
      
      return {
        success: true,
        output: result.output,
        intermediateSteps: result.intermediateSteps,
      };
    } catch (error) {
      console.error(`Error in ${this.name}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Stream the agent's response (for real-time UI updates)
   */
  async *stream(input: string, chatHistory: any[] = []) {
    try {
      const stream = await this.executor.stream({
        input,
        chat_history: chatHistory,
      });

      for await (const chunk of stream) {
        yield chunk;
      }
    } catch (error) {
      console.error(`Error streaming from ${this.name}:`, error);
      throw error;
    }
  }
}

