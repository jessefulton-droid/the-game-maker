import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

// Tool for asking questions to the child
export const createAskQuestionTool = () => {
  return new DynamicStructuredTool({
    name: 'ask_question',
    description: 'Asks a question to the child and waits for their response',
    schema: z.object({
      question: z.string().describe('The question to ask the child'),
      context: z.string().optional().describe('Optional context for why this question is being asked'),
    }),
    func: async ({ question, context }) => {
      // In practice, this tool would signal the UI to display the question
      // and wait for user input. For agent planning, we return the question.
      return JSON.stringify({
        action: 'ask_user',
        question,
        context,
        awaitingResponse: true,
      });
    },
  });
};

// Tool for processing user responses
export const createProcessResponseTool = () => {
  return new DynamicStructuredTool({
    name: 'process_response',
    description: 'Processes and analyzes the child\'s response to extract key information',
    schema: z.object({
      userResponse: z.string().describe('The child\'s response (text or transcribed audio)'),
      questionContext: z.string().describe('The question that was asked'),
    }),
    func: async ({ userResponse, questionContext }) => {
      // Analyze the response
      return JSON.stringify({
        response: userResponse,
        keywords: extractKeywords(userResponse),
        sentiment: 'positive', // Could use NLP here
        hasMoreToDiscuss: userResponse.length > 50,
      });
    },
  });
};

// Tool for generating follow-up questions
export const createGenerateFollowUpTool = () => {
  return new DynamicStructuredTool({
    name: 'generate_follow_up',
    description: 'Generates appropriate follow-up questions based on the conversation so far',
    schema: z.object({
      conversationHistory: z.array(z.string()).describe('Previous messages in the conversation'),
      currentTopic: z.string().describe('The current topic being discussed'),
    }),
    func: async ({ conversationHistory, currentTopic }) => {
      // Generate contextual follow-up questions
      return JSON.stringify({
        suggestedQuestions: [
          'Can you tell me more about that?',
          'What was your favorite part?',
          'How did that make you feel?',
        ],
        shouldContinue: conversationHistory.length < 10,
      });
    },
  });
};

// Helper function to extract keywords from text
function extractKeywords(text: string): string[] {
  // Simple keyword extraction (could be enhanced with NLP)
  const words = text.toLowerCase().split(/\s+/);
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'is', 'was', 'it']);
  
  return words
    .filter(word => word.length > 3 && !stopWords.has(word))
    .filter((word, index, self) => self.indexOf(word) === index) // unique
    .slice(0, 10);
}

