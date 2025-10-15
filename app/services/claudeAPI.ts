import { ChatAnthropic } from '@langchain/anthropic';
import Constants from 'expo-constants';

// Get API key from environment
const getApiKey = (): string => {
  const apiKey = Constants.expoConfig?.extra?.ANTHROPIC_API_KEY || 
                 process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not found. Please set it in your .env file or app.json');
  }
  
  return apiKey;
};

// Create Claude 4.5 Sonnet client for agents
export const createClaudeClient = (options?: {
  temperature?: number;
  maxTokens?: number;
}) => {
  const apiKey = getApiKey();
  
  return new ChatAnthropic({
    modelName: 'claude-sonnet-4-20250514', // Claude 4.5 Sonnet
    anthropicApiKey: apiKey,
    temperature: options?.temperature ?? 0.7,
    maxTokens: options?.maxTokens ?? 4096,
  });
};

// Create Claude Vision client for book identification
export const createClaudeVisionClient = () => {
  const apiKey = getApiKey();
  
  return new ChatAnthropic({
    modelName: 'claude-sonnet-4-20250514', // Claude 4.5 Sonnet with vision
    anthropicApiKey: apiKey,
    temperature: 0.3, // Lower temperature for more accurate identification
    maxTokens: 2048,
  });
};

// Create Claude client for code generation (may need more tokens)
export const createClaudeCodeClient = () => {
  const apiKey = getApiKey();
  
  return new ChatAnthropic({
    modelName: 'claude-sonnet-4-20250514', // Claude 4.5 Sonnet
    anthropicApiKey: apiKey,
    temperature: 0.5, // Balanced for creative but functional code
    maxTokens: 8192, // More tokens for game code
  });
};

