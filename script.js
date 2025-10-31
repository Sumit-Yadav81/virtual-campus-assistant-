document.addEventListener('DOMContentLoaded', () => {
    // Get all the necessary DOM elements
    const chatForm = document.getElementById('chatbot-form');
    const userInput = document.getElementById('user-input');
    const messagesContainer = document.getElementById('chatbot-messages');
    const voiceBtn = document.getElementById('voice-btn');

    // Display the initial welcome message from the bot
    const initialMessage = "Hello! 👋 I'm your virtual campus assistant. What can I help you with today?";
    displayMessage(initialMessage, 'bot');

    // Handle form submission for text messages
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userMessage = userInput.value.trim();
        if (userMessage) {
            displayMessage(userMessage, 'user');
            userInput.value = ''; // Clear the input field

            // Here you'll make a request to your AI backend.
            // For now, we'll simulate a bot response.
            // In a real implementation, you would replace this call
            // with a fetch() request to your Dialogflow or OpenAI endpoint.
            const botResponse = await getBotResponseFromAI(userMessage);
            displayMessage(botResponse, 'bot');
            speakText(botResponse); // Use Text-to-Speech to read the response
        }
    });

    // Handle button click for voice input
    voiceBtn.addEventListener('click', () => {
        voiceBtn.classList.toggle('listening');
        if (voiceBtn.classList.contains('listening')) {
            startVoiceRecognition();
        } else {
            stopVoiceRecognition();
        }
    });

    // Function to display a message in the chat window
    function displayMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        // Scroll to the bottom to show the new message
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Placeholder function for AI interaction
    async function getBotResponseFromAI(userMessage) {
        // This is where you would integrate with your AI.
        // Example:
        // const response = await fetch('your-ai-api-endpoint', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ query: userMessage })
        // });
        // const data = await response.json();
        // return data.fulfillmentText; // or data.response from OpenAI

        // For this demo, we'll just return a static response after a delay.
        return new Promise(resolve => {
            setTimeout(() => {
                const knownAnswers = {
                    "where is room 104": "Room 104 is on the first floor, at the end of the east wing. It's next to the computer lab.",
                    "how to apply for a bonafide certificate": "You can apply for a bonafide certificate through the student portal. Navigate to 'Certificates' and follow the instructions to submit your request.",
                    "what is the dress code on fridays": "The dress code on Fridays is smart casual. Jeans are allowed, but please avoid ripped or distressed clothing.",
                    "hello": "Hello there! How can I assist you?",
                    "hi": "Hello there! How can I assist you?",
                    "hey": "Hello there! How can I assist you?"
                };
                const lowerCaseMessage = userMessage.toLowerCase();
                const foundAnswer = Object.keys(knownAnswers).find(q => lowerCaseMessage.includes(q));

                if (foundAnswer) {
                    resolve(knownAnswers[foundAnswer]);
                } else {
                    resolve("I'm sorry, I don't have an answer for that specific question. You can try asking about room locations, certificates, or dress code. If you need further assistance, please visit the student services office.");
                }
            }, 1000);
        });
    }

    // Web Speech API for voice input
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false; // Only get a single result at a time
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            const last = event.results.length - 1;
            const text = event.results[last][0].transcript;
            userInput.value = text;
            chatForm.dispatchEvent(new Event('submit')); // Submit the form automatically
            stopVoiceRecognition();
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            stopVoiceRecognition();
        };
    } else {
        // Hide the voice button if the API is not supported by the browser
        voiceBtn.style.display = 'none';
        console.warn("Web Speech API is not supported in this browser.");
    }

    function startVoiceRecognition() {
        if (recognition) {
            recognition.start();
            console.log('Voice recognition started...');
        }
    }

    function stopVoiceRecognition() {
        if (recognition) {
            recognition.stop();
            voiceBtn.classList.remove('listening');
            console.log('Voice recognition stopped.');
        }
    }

    // Web Speech API for voice output (Text-to-Speech)
    const SpeechSynthesis = window.speechSynthesis;

    function speakText(text) {
        if (SpeechSynthesis) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.volume = 1;
            utterance.rate = 1;
            utterance.pitch = 1;
            SpeechSynthesis.speak(utterance);
        } else {
            console.warn("Text-to-speech not supported.");
        }
    }

});
