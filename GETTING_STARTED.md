# 🚀 Getting Started Checklist

## Your 5-Minute Launch Plan

### ☐ Step 1: Get Your API Key (2 minutes)
1. Go to https://console.anthropic.com/
2. Sign in or create account
3. Navigate to "API Keys"
4. Click "Create Key"
5. Copy your key

### ☐ Step 2: Add API Key (1 minute)
Create `.env` file in project root:
```bash
echo "ANTHROPIC_API_KEY=sk-ant-your-key-here" > .env
```

Or add to `app.json` at line 57:
```json
"extra": {
  "ANTHROPIC_API_KEY": "sk-ant-your-key-here"
}
```

### ☐ Step 3: Install Dependencies (2 minutes)
```bash
npm install
```

### ☐ Step 4: Launch! (30 seconds)
```bash
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go on your device

## ✅ Verify It Works

1. **Home Screen** shows "The Game Maker by Farrah"
2. **Tap "Create New Game"** opens camera
3. **Grant camera permission** when asked
4. **Take a photo** of any book
5. **Confirm** the picture
6. **See the chat interface** with Story Analyst
7. **Success!** 🎉

## 🎮 Test the Full Flow

For your first test:
1. Use a well-known book (like "Dragons Love Tacos")
2. Answer the Story Analyst's questions
3. Choose a game type with Game Designer
4. Wait for generation (~30 seconds in demo mode)
5. Play your game!
6. Try "Spice It Up" to modify it

## ⚠️ Troubleshooting

**"Cannot find module" error:**
```bash
npm install
rm -rf node_modules
npm install
```

**Camera not working:**
- Check device permissions
- Try on physical device (not simulator)
- Restart app

**API errors:**
- Verify API key is correct
- Check you have credits
- Look in console for details

## 📖 Read Next

1. **README.md** - Full documentation
2. **DEVELOPMENT_NOTES.md** - Understand the agents
3. **PROJECT_SUMMARY.md** - See what we built

## 🎯 Your Mission

Make Farrah smile by showing her a working game made from her favorite book! 🎮📚✨

---

**Ready? Let's go!**
```bash
npm start
```

