# RhymeCraft AI - Rap Lyric Generator Agent

## Project Overview
RhymeCraft AI is an AI-powered rap lyric generator that creates original, styled rap verses using a multi-agent AI architecture. It combines a Flask backend powered by a large language model (LLM), custom rhyme checking, style modulation, and user-feedback loops, paired with an engaging and customizable frontend UI.

## Features
- Multi-agent system integrating LLM, rhyme checker, style modifier, and feedback agents
- Custom and built-in AI tools using OpenAI GPT API
- Session and state management with in-memory sessions
- Iterative lyric improvements through user feedback
- Observability with logging and tracing
- Deployable REST API backend and versatile frontends (Vanilla JS and React)
- Optional 3D animated and aesthetic UI (can be extended)

## File Structure

## Getting Started

### Backend
1. Install required packages:
2. Replace `YOUR_OPENAI_API_KEY` in `app.py` with your OpenAI API key.
3. Run the backend server:
4. Server runs at `http://localhost:5000/`.

### Frontend (Vanilla)
1. Open `index.html` in your browser.
2. Make sure backend is running.
3. Use the UI to input prompts and generate rap lyrics.

### Frontend (React - Optional)
1. Create React app and add `RapLyricGenerator.jsx`.
2. Import the component into `App.js`.
3. Run React dev server (`npm start`).
4. Visit `http://localhost:3000`.

## Usage
- Generate rap lyrics by entering prompts.
- Select lyric styles like normal, aggressive, humorous.
- Submit textual feedback to iteratively enhance lyrics.

## Future Enhancements
- Integrate phonetic rhyme checker.
- Add user accounts and persistent memory.
- Deploy on cloud platforms.
- Expand 3D visualizations or audio-reactive UI.

## License
MIT License

## Contact
For inquiries or contributions, reach out at ping2saas145@gmail.com.
---

**RhymeCraft AI** blends creativity and AI for dynamic, personalized rap lyric generation.
