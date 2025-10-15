# 🎮 The Game Maker

**Created by Farrah**

Kids can turn their favorite bedtime books into awesome 90s arcade-style games using AI!

## ✨ What It Does

The Game Maker is an innovative app that lets kids photograph their favorite books and turn them into playable games through an interactive AI-powered process:

1. **📚 Book Capture** - Take a picture of any book cover
2. **💬 Story Discussion** - Chat with the Story Analyst AI about the book
3. **🎨 Game Design** - Collaborate with the Game Designer AI to create your dream game
4. **⚙️ Game Generation** - Watch as the Code Generator AI builds your game (5-15 minutes)
5. **🎮 Play** - Play your custom game with unlimited lives!
6. **✨ Spice It Up** - Provide feedback to make your game even better

## 🏗️ Architecture

This app uses an **agent-based architecture** with three specialized AI agents:

- **Story Analyst Agent** - Understands books and conducts engaging discussions
- **Game Designer Agent** - Translates stories into fun game mechanics
- **Code Generator Agent** - Creates working Phaser.js games

Built with:
- **React Native + Expo** - Cross-platform mobile development
- **LangChain + LangGraph** - Agent orchestration framework
- **Claude 4.5 Sonnet** - AI reasoning and creativity
- **Phaser.js** - 90s arcade-style game engine
- **TypeScript + Zod** - Type safety and validation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- iOS Simulator (Mac) or Android Emulator
- Anthropic API key for Claude 4.5 Sonnet

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up your API key:**
   
   Create a `.env` file in the root directory:
   ```env
   ANTHROPIC_API_KEY=your_claude_api_key_here
   ```
   
   Or add it to `app.json` under `expo.extra.ANTHROPIC_API_KEY`

3. **Install Expo CLI globally (if needed):**
   ```bash
   npm install -g expo-cli
   ```

### Running the App

**iOS (Mac only):**
```bash
npm run ios
```

**Android:**
```bash
npm run android
```

**Web (for testing):**
```bash
npm run web
```

**Development Mode:**
```bash
npm start
```

Then scan the QR code with the Expo Go app on your mobile device.

## 📱 Testing on Your Device

### iOS/iPad:
1. Install Expo Go from the App Store
2. Run `npm start`
3. Scan the QR code with your camera
4. The app will open in Expo Go

### Android:
1. Install Expo Go from Google Play
2. Run `npm start`
3. Scan the QR code with the Expo Go app
4. The app will open

## 🎯 Features

### MVP Features (Implemented)
- ✅ Book cover capture with camera
- ✅ AI-powered book identification
- ✅ Interactive story discussion
- ✅ Collaborative game design
- ✅ Three game templates (platformer, top-down, obstacle-avoider)
- ✅ Real-time game generation
- ✅ Unlimited lives gameplay
- ✅ "Play Again" functionality
- ✅ "Spice It Up" iteration system
- ✅ Voice input support
- ✅ iPad optimization

### Coming Soon
- 🔄 Real agent integration (currently using mock responses)
- 🔄 Speech-to-text integration
- 🔄 Game save/load from library
- 🔄 More game templates
- 🔄 Multiplayer support
- 🔄 Social sharing

## 🛠️ Development

### Project Structure

```
the-game-maker/
├── app/
│   ├── components/          # Reusable UI components
│   ├── screens/            # Main app screens
│   ├── services/
│   │   ├── agents/         # AI agent implementations
│   │   ├── tools/          # Agent tools
│   │   └── schemas/        # Zod validation schemas
│   ├── templates/          # Phaser.js game templates
│   └── types/              # TypeScript types
├── docs/                   # Documentation and brainstorming
├── App.tsx                 # Main app entry with navigation
└── package.json
```

### Key Files

- **`app/services/agents/orchestrator.ts`** - Coordinates all agents
- **`app/services/agents/storyAnalystAgent.ts`** - Book discussion agent
- **`app/services/agents/gameDesignerAgent.ts`** - Game design agent
- **`app/services/agents/codeGeneratorAgent.ts`** - Code generation agent
- **`app/templates/phaserTemplates.ts`** - Game templates

### Adding New Game Templates

1. Create template in `app/templates/phaserTemplates.ts`
2. Add type to `GameDesign` schema
3. Update Code Generator Agent prompts
4. Test generation

## 🐛 Troubleshooting

### Common Issues

**Camera not working:**
- Make sure you granted camera permissions
- On iOS, check Settings → The Game Maker → Camera
- Try restarting the app

**API errors:**
- Verify your Anthropic API key is correct
- Check that you have API credits
- Look for rate limit errors in console

**Game won't load:**
- Check browser console for errors
- Verify game code is valid JavaScript
- Try a simpler game design

**Voice input not working:**
- Grant microphone permissions
- Note: Speech-to-text needs additional integration (see TODOs)

## 🎓 Learning Agent Architecture

This project is designed to teach agent-based AI development:

### Key Concepts Demonstrated

1. **Agent Specialization** - Each agent has a specific role and tools
2. **State Management** - Orchestrator manages workflow state
3. **Tool Usage** - Agents use tools to interact with the system
4. **Schema Validation** - Zod ensures type-safe data passing
5. **LangGraph** - State machine for agent coordination

### Educational TODOs

Current implementations use simplified logic. To learn more, try:

- [ ] Integrate real Claude API calls in agents
- [ ] Implement actual speech-to-text service
- [ ] Add error handling and retry logic
- [ ] Implement streaming responses for better UX
- [ ] Add agent memory for better conversations
- [ ] Create custom tools for specific tasks

## 📝 Notes

### Speech-to-Text Integration

The voice recording is implemented, but transcription needs a service:
- OpenAI Whisper API (recommended)
- Google Cloud Speech-to-Text
- Rev.ai
- AssemblyAI

See `app/services/speechService.ts` for integration points.

### Agent Integration

Agents are structured but currently use mock responses for MVP testing.
To fully integrate:
1. Ensure API key is set
2. Uncomment agent invocation code in screens
3. Test with real Claude API calls
4. Monitor token usage

## 🌟 Credits

- **Concept & Design:** Farrah
- **Development:** Built as a learning project for agent-based AI
- **Powered by:** Claude 4.5 Sonnet, Phaser.js, React Native

## 📄 License

Created for educational purposes. 

---

**Have fun turning your favorite books into games! 🎮📚✨**

