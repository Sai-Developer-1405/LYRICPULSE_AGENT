from flask import Flask, request, jsonify
import openai
import logging

openai.api_key = "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"
logging.basicConfig(level=logging.INFO)

app = Flask(__name__)

class InMemorySessionService:
    def __init__(self):
        self.sessions = {}

    def get_session(self, session_id):
        if session_id not in self.sessions:
            self.sessions[session_id] = {
                "history": [],
                "preferences": {"style": "normal", "rhyme_strict": True}
            }
        return self.sessions[session_id]

    def add_interaction(self, session_id, prompt, response):
        self.get_session(session_id)["history"].append({"prompt": prompt, "response": response})

    def get_recent_context(self, session_id, max_turns=5):
        history = self.get_session(session_id)["history"]
        return history[-max_turns:]

session_service = InMemorySessionService()

def advanced_rhyme_checker(lyrics: str) -> bool:
    logging.info("Rhyme check in progress...")
    return True  # Simplified rhyme check here

def style_modifier(lyrics: str, style: str) -> str:
    if style == "aggressive":
        return lyrics.upper()
    if style == "humorous":
        return lyrics + "\nHaha!"
    return lyrics

def llm_generate_lyrics(prompt: str, context, style: str, rhyme_strict: bool) -> str:
    context_text = "\n".join([f"Prompt: {c['prompt']}\nLyrics: {c['response']}" for c in context])
    full_prompt = f"""
You are a rap lyric generator. Follow user's style: {style}. Generate rhyming lyrics strictly: {rhyme_strict}.
Previous conversation context:
{context_text}
New prompt:
{prompt}
"""
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=full_prompt.strip(),
        max_tokens=150,
        temperature=0.85,
        n=1,
        stop=None,
    )
    return response.choices[0].text.strip()

def iterative_improvement(session_id: str, user_feedback: str):
    session = session_service.get_session(session_id)
    last_lyrics = session["history"][-1]["response"] if session["history"] else ""
    new_prompt = f"Improve the following lyrics with feedback: {user_feedback}\nLyrics: {last_lyrics}"
    improved_lyrics = llm_generate_lyrics(new_prompt, session["history"], session["preferences"]["style"], session["preferences"]["rhyme_strict"])
    session_service.add_interaction(session_id, new_prompt, improved_lyrics)
    return improved_lyrics

@app.route("/generate", methods=["POST"])
def generate():
    data = request.json
    session_id = data.get("session_id")
    prompt = data.get("prompt")
    style = data.get("style", "normal")
    rhyme_strict = data.get("rhyme_strict", True)

    session = session_service.get_session(session_id)
    session["preferences"]["style"] = style
    session["preferences"]["rhyme_strict"] = rhyme_strict

    context = session_service.get_recent_context(session_id)

    lyrics = llm_generate_lyrics(prompt, context, style, rhyme_strict)

    if rhyme_strict and not advanced_rhyme_checker(lyrics):
        logging.warning("Rhyme check failed, regenerating lyrics with relaxed constraints.")
        lyrics = llm_generate_lyrics(prompt, context, style, False)

    lyrics = style_modifier(lyrics, style)
    session_service.add_interaction(session_id, prompt, lyrics)

    return jsonify({"lyrics": lyrics})

@app.route("/feedback", methods=["POST"])
def feedback():
    data = request.json
    session_id = data.get("session_id")
    user_feedback = data.get("feedback")

    if not user_feedback:
        return jsonify({"error": "Feedback is required"}), 400

    improved_lyrics = iterative_improvement(session_id, user_feedback)

    return jsonify({"improved_lyrics": improved_lyrics})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
