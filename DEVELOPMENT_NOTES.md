# 🧠 Development Notes: Understanding the Agent Architecture

## Overview

This document explains how the agent-based architecture works in The Game Maker, helping you understand and complete the implementation.

## Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│              React Native UI                     │
│  (Screens, Components, Navigation)              │
└───────────────────┬─────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│           Orchestrator                           │
│  (State Machine & Agent Coordination)           │
└───────────────────┬─────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   Story     │ │    Game     │ │    Code     │
│  Analyst    │→│  Designer   │→│  Generator  │
│   Agent     │ │   Agent     │ │   Agent     │
└──────┬──────┘ └──────┬──────┘ └──────┬──────┘
       │               │               │
       ▼               ▼               ▼
  [Book Tools]   [Game Tools]    [Code Tools]
       │               │               │
       └───────────────┴───────────────┘
                       │
                       ▼
              ┌────────────────┐
              │  Claude 4.5    │
              │    Sonnet      │
              └────────────────┘
```

## Agent Architecture Explained

### 1. Agent Factory Pattern

**File**: `app/services/agents/agentFactory.ts`

```typescript
export async function createAgent(config: AgentConfig): Promise<AgentExecutor>
```

**Purpose**: Creates specialized agents with:
- Custom system prompts
- Specific tools
- Claude 4.5 Sonnet integration
- Conversation management

**Key Concept**: Each agent is a LangChain `AgentExecutor` that can:
- Use tools to perform actions
- Maintain conversation history
- Make decisions based on context
- Return structured outputs

### 2. The Three Agents

#### Story Analyst Agent
**File**: `app/services/agents/storyAnalystAgent.ts`

**Role**: Book expert who discusses stories with kids

**Tools**:
- `identify_book` - Uses Claude Vision to identify book covers
- `extract_themes` - Analyzes story themes
- `extract_characters` - Identifies key characters
- `extract_game_potential` - Finds game-worthy elements
- `ask_question` - Asks questions to the child
- `process_response` - Analyzes child's answers

**Output**: `BookAnalysis` (Zod validated schema)

**Integration Point**:
```typescript
// In BookDiscussionScreen.tsx
const orchestrator = await getOrchestrator();
const result = await orchestrator.startBookDiscussion(bookImageUri);
```

#### Game Designer Agent
**File**: `app/services/agents/gameDesignerAgent.ts`

**Role**: Creative designer who turns stories into games

**Tools**:
- `suggest_game_type` - Proposes game styles
- `brainstorm_mechanics` - Creates game mechanics
- `spice_it_up` - Suggests enhancements
- `validate_design` - Checks feasibility
- `ask_question` - Gets child's preferences

**Output**: `GameDesign` (Zod validated schema)

**Integration Point**:
```typescript
// In GameDesignScreen.tsx
const result = await orchestrator.startGameDesign();
```

#### Code Generator Agent
**File**: `app/services/agents/codeGeneratorAgent.ts`

**Role**: Phaser.js expert who generates working game code

**Tools**:
- `generate_code` - Creates Phaser.js game
- `apply_template` - Uses game templates
- `validate_syntax` - Checks code validity
- `optimize_performance` - Ensures smooth gameplay

**Output**: Working Phaser.js JavaScript code

**Integration Point**:
```typescript
// In GenerationScreen.tsx
const result = await orchestrator.startCodeGeneration();
```

### 3. The Orchestrator

**File**: `app/services/agents/orchestrator.ts`

**Purpose**: Coordinates the three agents in a linear workflow

**State Machine**:
```
book-capture → book-discussion → game-design → code-generation → complete
```

**Key Methods**:

```typescript
// Start book discussion with Story Analyst
async startBookDiscussion(bookImageUri: string)

// Process user response during discussion
async processBookDiscussionResponse(userResponse: string)

// Transition to Game Designer
async startGameDesign()

// Process user response during design
async processGameDesignResponse(userResponse: string)

// Generate code with Code Generator
async startCodeGeneration()

// Handle "Spice It Up" iterations
async spiceItUp(feedback: string)
```

**State Management**:
```typescript
interface GameCreationState {
  phase: 'book-capture' | 'book-discussion' | 'game-design' | 'code-generation' | 'complete';
  bookAnalysis?: BookAnalysis;
  gameDesign?: GameDesign;
  generatedCode?: string;
  conversationHistory: ChatMessage[];
  awaitingUserInput: boolean;
  error?: string;
}
```

## Data Flow

### 1. Book Discussion Phase

```
User takes photo
     ↓
Story Analyst Agent
     │
     ├─→ identify_book(imageUri)
     │        ↓
     │   [Claude Vision API]
     │        ↓
     │   Book identified
     │
     ├─→ ask_question("Tell me about the book")
     │        ↓
     │   [User responds]
     │        ↓
     │   process_response(userAnswer)
     │        ↓
     │   [More questions...]
     │
     └─→ completeAnalysis()
              ↓
         BookAnalysis (validated with Zod)
              ↓
         Passed to Game Designer
```

### 2. Game Design Phase

```
BookAnalysis received
     ↓
Game Designer Agent
     │
     ├─→ suggest_game_type(bookAnalysis)
     │        ↓
     │   [3 game type options]
     │        ↓
     │   ask_question("Which type?")
     │        ↓
     │   [User chooses]
     │
     ├─→ brainstorm_mechanics(choice)
     │        ↓
     │   [Collaborative design]
     │        ↓
     │   ask_question("What to collect?")
     │
     └─→ finalizeDesign()
              ↓
         GameDesign (validated with Zod)
              ↓
         Passed to Code Generator
```

### 3. Code Generation Phase

```
GameDesign received
     ↓
Code Generator Agent
     │
     ├─→ apply_template(gameType)
     │        ↓
     │   [Select Phaser.js template]
     │
     ├─→ generate_code(gameDesign)
     │        ↓
     │   [Claude generates custom code]
     │        ↓
     │   validate_syntax(code)
     │        ↓
     │   [Check JavaScript validity]
     │
     └─→ optimize_performance(code)
              ↓
         Working game code
              ↓
         HTML wrapper generated
              ↓
         Ready to play!
```

## Zod Schemas for Data Validation

### Why Zod?

Zod ensures type-safe data passing between agents:

```typescript
// Define schema
const BookAnalysisSchema = z.object({
  book: BookInfoSchema,
  plotSummary: z.string(),
  themes: z.array(z.string()),
  // ... more fields
});

// Validate data
const validatedAnalysis = BookAnalysisSchema.parse(rawData);

// TypeScript type inference
type BookAnalysis = z.infer<typeof BookAnalysisSchema>;
```

**Benefits**:
- Runtime validation
- Automatic TypeScript types
- Clear agent contracts
- Error handling

## LangChain & LangGraph Integration

### Current Implementation

The project is structured for LangChain but uses simplified logic for MVP:

```typescript
// Full LangChain integration (to be completed):
import { createToolCallingAgent } from 'langchain/agents';
import { ChatAnthropic } from '@langchain/anthropic';

const agent = await createToolCallingAgent({
  llm: new ChatAnthropic({
    modelName: 'claude-sonnet-4-20250514',
  }),
  tools: [tool1, tool2, tool3],
  prompt: systemPrompt,
});
```

### Completing the Integration

**Step 1**: Enable real Claude API calls

```typescript
// In agent files, the structure is ready:
const llm = createClaudeClient({ temperature: 0.8 });

// Just need to ensure API key is set
```

**Step 2**: Test agent invocations

```typescript
// In screens, replace mock logic:
const result = await agent.invoke('Your question here');
console.log(result.output); // Agent's response
```

**Step 3**: Handle streaming (optional but better UX)

```typescript
for await (const chunk of agent.stream('question')) {
  console.log(chunk); // Real-time updates
}
```

## Tool Creation Pattern

### Example: Book Identification Tool

```typescript
export const createIdentifyBookTool = () => {
  return new DynamicStructuredTool({
    name: 'identify_book',
    description: 'Identifies a children\'s book from a cover image',
    
    // Input schema (Zod)
    schema: z.object({
      imageUri: z.string().describe('URI of book cover'),
    }),
    
    // Tool implementation
    func: async ({ imageUri }) => {
      // 1. Get vision client
      const visionClient = createClaudeVisionClient();
      
      // 2. Create message with image
      const message = new HumanMessage({
        content: [
          { type: 'image_url', image_url: { url: imageUri } },
          { type: 'text', text: 'Identify this book...' },
        ],
      });
      
      // 3. Get response
      const response = await visionClient.invoke([message]);
      
      // 4. Return structured result
      return JSON.stringify({ success: true, book: {...} });
    },
  });
};
```

### Key Points:

1. **Name**: Descriptive tool name
2. **Description**: Tells agent when to use it
3. **Schema**: Defines required inputs
4. **Func**: Actual implementation
5. **Return**: Always return JSON string

## Phaser.js Game Templates

### Template Structure

```javascript
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: { default: 'arcade' },
  scene: { preload, create, update }
};

function create() {
  // Setup game world
  // Create player
  // Create collectibles
  // Setup collisions
}

function update() {
  // Game loop
  // Handle input
  // Update game state
}
```

### Customization Points

The Code Generator Agent customizes:
- Colors (using `setTint()`)
- Sizes (using `setDisplaySize()`)
- Positions (coordinates)
- Physics (velocities, gravity)
- Game logic (win conditions, scoring)

## Next Steps for Full Implementation

### 1. Complete Agent Integration

**File**: All screen files

```typescript
// Replace mock responses with:
import { getOrchestrator } from '../services/agents/orchestrator';

const orchestrator = await getOrchestrator();
const result = await orchestrator.methodName(params);

// Handle result
if (result.success) {
  // Update UI with agent response
  setMessages(orchestrator.getState().conversationHistory);
}
```

### 2. Add Speech-to-Text

**File**: `app/services/speechService.ts`

```typescript
export const transcribeAudio = async (audioUri: string): Promise<string> => {
  // Option 1: OpenAI Whisper (recommended)
  const formData = new FormData();
  formData.append('file', { uri: audioUri, type: 'audio/m4a', name: 'recording.m4a' });
  formData.append('model', 'whisper-1');
  
  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` },
    body: formData,
  });
  
  const data = await response.json();
  return data.text;
};
```

### 3. Enhance Error Handling

```typescript
// Add to orchestrator:
try {
  const result = await agent.invoke(input);
  return result;
} catch (error) {
  console.error('Agent error:', error);
  return {
    success: false,
    error: 'Something went wrong. Let\'s try again!',
    recovery: 'retry', // or 'skip', 'fallback'
  };
}
```

### 4. Add Persistence

```typescript
// Save games to AsyncStorage:
import AsyncStorage from '@react-native-async-storage/async-storage';

const saveGame = async (game: GeneratedGame) => {
  const games = await AsyncStorage.getItem('saved_games') || '[]';
  const parsedGames = JSON.parse(games);
  parsedGames.push({ id: uuid(), ...game });
  await AsyncStorage.setItem('saved_games', JSON.stringify(parsedGames));
};
```

## Testing Strategy

### 1. Test Agents Individually

```typescript
// Test Story Analyst:
const analyst = await getStoryAnalyst();
const result = await analyst.analyzeBook(testImageUri, []);
console.log('Result:', result);
```

### 2. Test Orchestrator Flow

```typescript
// Test full flow:
const orchestrator = await getOrchestrator();
await orchestrator.initialize();
const state1 = await orchestrator.startBookDiscussion(imageUri);
const state2 = await orchestrator.processBookDiscussionResponse('Great book!');
// ... continue testing
```

### 3. Test Game Generation

```typescript
// Test Code Generator:
const generator = await getCodeGenerator();
const result = await generator.generateGame(mockGameDesign);
console.log('Generated code length:', result.code?.length);
```

## Performance Considerations

### 1. Agent Response Time

- Story Analyst: ~2-5 seconds per response
- Game Designer: ~2-5 seconds per response
- Code Generator: ~30 seconds to 15 minutes

### 2. Optimization Tips

- Use appropriate temperature settings
- Limit token usage with maxTokens
- Cache agent instances (singleton pattern)
- Stream responses for better UX

### 3. Cost Management

- Monitor API usage
- Implement rate limiting
- Use cheaper models for simple tasks
- Cache responses when possible

## Learning Resources

### LangChain Documentation
- https://js.langchain.com/docs/
- Agent concepts
- Tool creation
- Prompt engineering

### LangGraph Documentation
- https://langchain-ai.github.io/langgraphjs/
- State machines
- Agent orchestration
- Graph workflows

### Claude Documentation
- https://docs.anthropic.com/
- API reference
- Vision API
- Best practices

### Phaser.js Documentation
- https://phaser.io/docs
- Game development
- Physics systems
- WebGL rendering

---

**Happy coding! This architecture teaches you real-world agent-based AI development! 🚀**

