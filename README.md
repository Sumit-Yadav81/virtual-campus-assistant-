# 🎓 Virtual Campus Assistant

A sleek, modern, and interactive chatbot designed to help university students find answers to common campus-related questions. This project is built with pure HTML, CSS, and JavaScript, leveraging modern web APIs for a rich user experience, including voice input and output.

---
## 🚀 Features

* **Modern UI:** A clean, responsive, and professional chat interface built with modern CSS.
* **Voice-to-Text:** Ask questions using your voice via the Web Speech `SpeechRecognition` API.
* **Text-to-Speech:** Listen to the bot's answers read aloud using the Web Speech `SpeechSynthesis` API.
* **Typing Indicator:** A "bot is typing..." animation provides a natural and responsive feel during the simulated backend delay.
* **Smart Keyword Matching:** A flexible, token-based matching system (in `script.js`) to understand user queries without requiring an exact match.
* **Accessible:** Includes ARIA attributes (`aria-live`, `aria-label`) for improved screen reader support.
* **Zero Dependencies:** Built with 100% vanilla HTML, CSS, and JavaScript. No frameworks or libraries are required.
---
## 🤖 How It Works

The chatbot's entire logic is self-contained within the `script.js` file.

* **Event Listeners:** The app waits for user input, either from a form submission (typing) or a button click (voice).
* **`getBotResponseFromAI` Function:** This `async` function simulates an API call with a `setTimeout`. It processes the user's message using a simple `tokenize` function, which splits the input into keywords and removes common "stop words."
* **Keyword Matching:** It then loops through its internal `knownAnswers` database, calculates a "score" for each known question based on how many keywords match the user's input, and returns the answer with the highest score.
* **Fallback:** If no suitable match is found (or the score is too low), it provides a helpful fallback response.

---

The smart matching system will automatically handle variations of these questions.
