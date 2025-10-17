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
  
  console.log('🤖 Creating Claude client with:', {
    model: 'claude-sonnet-4-20250514',
    temperature: options?.temperature ?? 0.7,
    maxTokens: options?.maxTokens ?? 4096,
  });
  
  return new ChatAnthropic({
    modelName: 'claude-sonnet-4-20250514', // Claude 4.5 Sonnet
    anthropicApiKey: apiKey,
    temperature: options?.temperature ?? 0.7,
    maxTokens: options?.maxTokens ?? 4096,
    callbacks: [{
      handleLLMStart: () => console.log('🔄 LLM call started...'),
      handleLLMEnd: () => console.log('✅ LLM call completed'),
      handleLLMError: (error) => console.error('❌ LLM error:', error),
    }],
  });
};

// Create Claude Vision client for book identification
export const createClaudeVisionClient = () => {
  const apiKey = getApiKey();
  
  console.log('👁️ Creating Claude Vision client for book identification');
  
  return new ChatAnthropic({
    modelName: 'claude-sonnet-4-20250514', // Claude 4.5 Sonnet with vision
    anthropicApiKey: apiKey,
    temperature: 0.3, // Lower temperature for more accurate identification
    maxTokens: 2048,
    callbacks: [{
      handleLLMStart: () => console.log('🔄 Vision API call started...'),
      handleLLMEnd: () => console.log('✅ Vision API call completed'),
      handleLLMError: (error) => console.error('❌ Vision API error:', error),
    }],
  });
};

// Create Claude client for code generation (may need more tokens)
export const createClaudeCodeClient = () => {
  const apiKey = getApiKey();
  
  console.log('💻 Creating Claude Code client for game generation');
  
  return new ChatAnthropic({
    modelName: 'claude-sonnet-4-20250514', // Claude 4.5 Sonnet
    anthropicApiKey: apiKey,
    temperature: 0.5, // Balanced for creative but functional code
    maxTokens: 8192, // More tokens for game code
    callbacks: [{
      handleLLMStart: () => console.log('🔄 Code generation started...'),
      handleLLMEnd: () => console.log('✅ Code generation completed'),
      handleLLMError: (error) => console.error('❌ Code generation error:', error),
    }],
  });
};

