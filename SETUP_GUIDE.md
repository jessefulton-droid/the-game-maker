# 🚀 Quick Setup Guide for The Game Maker

## Step 1: API Key Setup

You'll need an Anthropic API key to use Claude 4.5 Sonnet.

### Get Your API Key
1. Go to https://console.anthropic.com/
2. Create an account or sign in
3. Navigate to API Keys
4. Create a new key

### Add to Your Project

**Option A: Using .env file (Recommended for Development)**
1. Create a `.env` file in the project root
2. Add: `ANTHROPIC_API_KEY=your_key_here`

**Option B: Using app.json (For Production)**
1. Open `app.json`
2. Find `expo.extra.ANTHROPIC_API_KEY`
3. Replace the empty string with your key

## Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages including:
- React Native & Expo
- LangChain & LangGraph
- Navigation libraries
- Camera & Audio libraries
- And more!

## Step 3: Run the App

### For iOS (Mac only)
```bash
npm run ios
```

### For Android
```bash
npm run android
```

### For Development/Testing
```bash
npm start
```
Then scan the QR code with Expo Go app on your device.

## 📝 First Time Running

1. The app will ask for camera permissions - **Grant them**
2. The app will ask for microphone permissions - **Grant them**
3. You're ready to go!

## 🎮 Testing the App Flow

### Quick Test Path:
1. **Home Screen** → Tap "Create New Game"
2. **Camera Screen** → Take a picture of any book (or use mock mode)
3. **Book Discussion** → Chat with the Story Analyst about the book
4. **Game Design** → Collaborate on game mechanics
5. **Generation** → Wait for game to build (~30 seconds in demo mode)
6. **Play Game** → Enjoy your custom game!
7. **Feedback** → Use "Spice It Up" to improve

## ⚠️ Known Limitations (MVP)

1. **Mock Responses**: Agents currently use simulated responses for faster testing
   - To enable real agents: Update screens to call orchestrator methods
   - See TODOs in screen files

2. **Speech-to-Text**: Voice recording works, but transcription needs integration
   - Add your preferred service (Whisper, Google, etc.)
   - See `app/services/speechService.ts`

3. **Game Generation**: Uses templates with minimal customization
   - Full generation requires real Claude API integration
   - Currently demonstrates the flow

## 🐛 Troubleshooting

### "Cannot find module" errors
```bash
npm install
npx expo install
```

### Camera not working
- Check permissions in device settings
- Restart the app
- Try running with `npm start` and use physical device

### API errors
- Verify API key is correct
- Check you have API credits
- Look at console for specific errors

### Expo Go issues
- Update to latest Expo Go app
- Clear Expo Go cache
- Try `npm start -- --clear`

## 📱 Testing on iPad

The app is optimized for iPad! Simply:
1. Install Expo Go on your iPad
2. Run `npm start` on your computer
3. Scan QR code with iPad
4. Grant permissions
5. Enjoy the full iPad experience!

## 🎯 Next Steps

### To Complete the Full Integration:

1. **Enable Real Agents**:
   ```typescript
   // In screens, replace mock logic with:
   const orchestrator = await getOrchestrator();
   const result = await orchestrator.startBookDiscussion(imageUri);
   ```

2. **Add Speech-to-Text**:
   - Choose a service (OpenAI Whisper recommended)
   - Update `app/services/speechService.ts`
   - Test voice input

3. **Implement Game Saving**:
   - Currently saves to AsyncStorage
   - Add cloud sync for production
   - Implement load functionality

4. **Enhance Game Generation**:
   - Fine-tune prompts for better games
   - Add more templates
   - Implement asset generation

## 💡 Tips

- **Start Simple**: Test with a well-known book like "Dragons Love Tacos"
- **Be Patient**: Real agent responses take 2-5 seconds
- **Iterate**: Use "Spice It Up" to refine your games
- **Have Fun**: This is a learning project - experiment!

## 🆘 Need Help?

Check:
1. Console logs for errors
2. README.md for detailed info
3. Code comments for implementation notes

---

**Ready to make some games? Let's go! 🎮📚✨**

