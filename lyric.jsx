import React, { useState } from 'react';

const SESSION_ID = "user123";

export default function RapLyricGenerator() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('normal');
  const [lyrics, setLyrics] = useState('');
  const [feedback, setFeedback] = useState('');
  const [improvedLyrics, setImprovedLyrics] = useState('');
  const [loading, setLoading] = useState(false);
  const [improving, setImproving] = useState(false);

  async function generateLyrics() {
    if (!prompt.trim()) {
      alert("Please enter a prompt!");
      return;
    }
    setLoading(true);
    setImprovedLyrics('');
    try {
      const res = await fetch("http://localhost:5000/generate", {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          session_id: SESSION_ID,
          prompt,
          style,
          rhyme_strict: true,
        }),
      });
      const data = await res.json();
      setLyrics(data.lyrics || "Failed to generate lyrics.");
    } catch {
      setLyrics("Error contacting backend.");
    }
    setLoading(false);
  }

  async function submitFeedback() {
    if (!feedback.trim()) {
      alert("Please enter feedback.");
      return;
    }
    setImproving(true);
    try {
      const res = await fetch("http://localhost:5000/feedback", {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ session_id: SESSION_ID, feedback }),
      });
      const data = await res.json();
      setImprovedLyrics(data.improved_lyrics || "Failed to improve lyrics.");
    } catch {
      setImprovedLyrics("Error contacting backend.");
    }
    setImproving(false);
  }

  return (
    <div style={{
      maxWidth: 400,
      margin: '2rem auto',
      padding: '2rem',
      backgroundColor: 'rgba(30,30,30,0.85)',
      borderRadius: 16,
      color: '#1db954',
      fontFamily: "'Montserrat', sans-serif"
    }}>
      <h2>Rap Lyric Generator</h2>
      <textarea
        rows={4}
        placeholder="Enter your rap prompt/theme..."
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        style={{width: '100%', padding: '0.75rem', borderRadius: 8, border: 'none', backgroundColor: '#222', color:'#1db954'}}
      />
      <select
        value={style}
        onChange={e => setStyle(e.target.value)}
        style={{width: '100%', padding: '0.75rem', marginTop: '1rem', borderRadius: 8, border: 'none', backgroundColor: '#222', color:'#1db954'}}
      >
        <option value="normal">Normal</option>
        <option value="aggressive">Aggressive</option>
        <option value="humorous">Humorous</option>
      </select>
      <button
        onClick={generateLyrics}
        disabled={loading}
        style={{ marginTop: 16, padding: '0.75rem', width: '100%', fontWeight: 'bold', cursor: 'pointer', background: 'linear-gradient(45deg, #1db954, #1ed760)', border: 'none', borderRadius: 8, color: '#000' }}
      >
        {loading ? 'Generating...' : 'Generate Lyrics'}
      </button>
      <pre style={{ whiteSpace: 'pre-wrap', marginTop: 16, minHeight: 120, color: '#1ed760' }}>{lyrics}</pre>

      <h3>Provide Feedback for Improvement:</h3>
      <textarea
        rows={3}
        placeholder="Enter your feedback here..."
        value={feedback}
        onChange={e => setFeedback(e.target.value)}
        style={{width: '100%', padding: '0.75rem', borderRadius: 8, border: 'none', backgroundColor: '#222', color:'#1db954'}}
      />
      <button
        onClick={submitFeedback}
        disabled={improving}
        style={{ marginTop: 16, padding: '0.75rem', width: '100%', fontWeight: 'bold', cursor: 'pointer', background: 'linear-gradient(45deg, #1db954, #1ed760)', border: 'none', borderRadius: 8, color: '#000' }}
      >
        {improving ? 'Improving...' : 'Submit Feedback'}
      </button>
      <pre style={{ whiteSpace: 'pre-wrap', marginTop: 16, minHeight: 120, color: '#1ed760' }}>{improvedLyrics}</pre>
    </div>
  );
}
