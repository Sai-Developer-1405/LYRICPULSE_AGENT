const generateBtn = document.getElementById('generateBtn');
const feedbackBtn = document.getElementById('feedbackBtn');
const promptInput = document.getElementById('prompt');
const styleSelect = document.getElementById('style');
const lyricsOutput = document.getElementById('lyricsOutput');
const feedbackInput = document.getElementById('feedback');
const improvedOutput = document.getElementById('improvedOutput');

const SESSION_ID = "user123";

generateBtn.addEventListener('click', async () => {
  const prompt = promptInput.value.trim();
  if (!prompt) {
    alert("Please enter a prompt!");
    return;
  }
  lyricsOutput.classList.remove('visible');
  lyricsOutput.textContent = "Generating lyrics...";

  try {
    const response = await fetch("http://localhost:5000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: SESSION_ID,
        prompt,
        style: styleSelect.value,
        rhyme_strict: true,
      }),
    });
    const data = await response.json();
    if (data.lyrics) {
      lyricsOutput.textContent = data.lyrics;
      setTimeout(() => lyricsOutput.classList.add('visible'), 100);
      improvedOutput.textContent = "";
      feedbackInput.value = "";
    } else {
      lyricsOutput.textContent = "Failed to generate lyrics.";
    }
  } catch (error) {
    lyricsOutput.textContent = "Error contacting backend.";
    console.error(error);
  }
});

feedbackBtn.addEventListener('click', async () => {
  const feedback = feedbackInput.value.trim();
  if (!feedback) {
    alert("Please enter feedback.");
    return;
  }
  improvedOutput.classList.remove('visible');
  improvedOutput.textContent = "Improving lyrics based on feedback...";

  try {
    const response = await fetch("http://localhost:5000/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: SESSION_ID,
        feedback,
      }),
    });
    const data = await response.json();
    if (data.improved_lyrics) {
      improvedOutput.textContent = data.improved_lyrics;
      setTimeout(() => improvedOutput.classList.add('visible'), 100);
    } else {
      improvedOutput.textContent = "Failed to improve lyrics.";
    }
  } catch (error) {
    improvedOutput.textContent = "Error contacting backend.";
    console.error(error);
  }
});
