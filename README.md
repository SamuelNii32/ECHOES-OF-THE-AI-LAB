🤖 Echoes of the AI Lab
A thrilling 2D platformer where you play as Subject Delta, escaping from a high-security AI laboratory with dynamic AI interference and progressive difficulty.

Game BannerNext.jsTypeScriptAI Powered

🎮 Game Overview
Echoes of the AI Lab is an innovative 2D platformer that combines classic gameplay with AI-driven narrative and dynamic game modifiers. As Subject Delta, you must escape from a containment facility while an AI Overseer actively works against you, modifying the environment in real-time.

🏆 Key Features
🤖 AI-Powered Narrative: Real-time story generation using OpenAI GPT-4
⚡ Dynamic Game Modifiers: AI changes gravity, spawns drones, and manipulates platforms
🎯 Three Difficulty Modes: Beginner, Medium, and Hard with unique challenges
🔊 Retro Sound Effects: Procedurally generated 8-bit style audio
💎 Power-Up System: High Jump, Speed Boost, and Shield abilities
🏃 Progressive Levels: 3 increasingly challenging levels with unique layouts
⏱️ Time Pressure: Dynamic time limits that scale with difficulty
🛡️ Smart Drone AI: Aggressive security drones with cooldown-based attacks
🎯 Gameplay
Story
You are Subject Delta, trapped in a high-security AI research facility. The AI Overseer monitors your every move and actively interferes with your escape attempt. Navigate through 3 levels of increasing difficulty while collecting orbs and avoiding security measures.

Objective
Collect all orbs in each level to progress
Avoid security drones and environmental hazards
Use power-ups strategically to overcome challenges
Complete all 3 levels to achieve total facility escape
Game Mechanics
Platform Physics: Realistic jumping and movement with gravity effects
AI Interference: Every 10-25 seconds, the AI modifies the game:
🌙 Low Gravity: Reduced gravity for floaty movement
💥 Disappearing Platforms: Platforms vanish and reappear
🤖 Drone Deployment: Security drones hunt the player
Power-Up System:
🚀 High Jump: Single-use super jump (Q/E keys or double-tap)
⚡ Speed Boost: Temporary movement speed increase
🛡️ Shield: Protection from drone attacks
🎮 Controls
Action	Keys	Description
Move Left	← / A	Move character left
Move Right	→ / D	Move character right
Jump	Space / W / ↑	Regular jump
High Jump	Q / E	Use high jump power-up
Double Jump	Double-tap jump	Alternative high jump activation
Restart	R	Restart game (when game over)
🏅 Difficulty Modes
🟢 Beginner Mode
Lives: 5
Time Bonus: +50% more time
Drone Speed: 30% slower
Drone Count: 1 fewer per level
Power-Ups: 20% more frequent
AI Interference: Every 25 seconds
🟡 Medium Mode (Default)
Lives: 3
Time Bonus: Normal time limits
Drone Speed: Normal speed
Drone Count: Standard count
Power-Ups: Normal frequency
AI Interference: Every 15 seconds
🔴 Hard Mode
Lives: 2
Time Bonus: 25% less time
Drone Speed: 40% faster
Drone Count: 1 extra per level
Power-Ups: 20% less frequent
AI Interference: Every 10 seconds
🚀 Installation & Setup
Prerequisites
Node.js 18+
npm or yarn
OpenAI API Key (optional - game works without it)
Quick Start
Clone the repository

git clone https://github.com/yourusername/echoes-ai-lab.git
cd echoes-ai-lab
Install dependencies

npm install
# or
yarn install
Set up environment variables (optional)

cp .env.example .env.local
Add your OpenAI API key to .env.local:

OPENAI_API_KEY=your_openai_api_key_here
Run the development server

npm run dev
# or
yarn dev
Open your browser Navigate to http://localhost:3000

🔑 OpenAI API Key (Optional)
The game includes AI-powered narrative generation. Without an API key, the game uses fallback narratives and still provides full gameplay functionality.

To get an OpenAI API key:

Visit OpenAI Platform
Create an account and generate an API key
Add it to your .env.local file
🏗️ Technical Architecture
Built With
Next.js 15 - React framework with App Router
TypeScript - Type-safe development
HTML5 Canvas - Game rendering and physics
AI SDK - OpenAI integration for narrative generation
Tailwind CSS - UI styling
Web Audio API - Procedural sound generation
Key Components
Game Engine (lib/game-engine.ts) - Core game loop and state management
Player System (lib/player.ts) - Character physics and abilities
Level Manager (lib/level.ts) - Platform and orb management
AI Controller (lib/ai-controller.ts) - Dynamic narrative and modifiers
Difficulty Manager (lib/difficulty-manager.ts) - Scaling system
Sound Manager (lib/sound-manager.ts) - Audio generation
Power-Up System (lib/power-ups.ts) - Ability management
Performance Features
60 FPS game loop with requestAnimationFrame
Efficient collision detection with bounding box optimization
Smart AI interference with configurable intervals
Responsive design that works on different screen sizes
🎨 Game Assets
Visual Style
Retro-futuristic aesthetic with neon green terminals
Minimalist pixel art style
Dynamic lighting effects with glows and shadows
Difficulty-themed colors (Green/Yellow/Red)
Audio Design
Procedurally generated 8-bit style sound effects
Dynamic audio cues for different game events
Difficulty-specific audio intensity
🏆 Achievements
Achievement	Description	Difficulty
🌟 Rookie Escapist	Complete all levels on Beginner	Beginner
🏆 Skilled Operative	Complete all levels on Medium	Medium
💀 Legendary Survivor	Complete all levels on Hard	Hard
🐛 Troubleshooting
Common Issues
Game won't start:

Ensure Node.js 18+ is installed
Run npm install to install dependencies
Check console for error messages
AI features not working:

Verify OpenAI API key in .env.local
Check API key has sufficient credits
Game works without API key using fallbacks
Performance issues:

Close other browser tabs
Ensure hardware acceleration is enabled
Try a different browser (Chrome recommended)
Audio not working:

Check browser audio permissions
Ensure volume is turned up
Try refreshing the page
🤝 Contributing
We welcome contributions! Here's how to get started:

Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
Development Guidelines
Follow TypeScript best practices
Maintain 60 FPS performance
Test across different browsers
Keep accessibility in mind
Document new features
📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
OpenAI for GPT-4 API powering dynamic narratives
Vercel for hosting and AI SDK
Next.js team for the amazing framework
Retro gaming community for inspiration
📊 Game Statistics
3 Unique Levels with progressive difficulty
19 Total Orbs to collect across all levels
3 Power-Up Types with strategic usage
Dynamic AI System with 4 different modifiers
Infinite Replayability with AI-generated narratives
Ready to escape the AI Lab? 🚀

Play Now | Report Bug | Request Feature

Made with ❤️ and AI assistance




