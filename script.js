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
            showTypingIndicator(); // Show typing animation

            // Here you'll make a request to your AI backend.
            // For now, we'll simulate a bot response.
            const botResponse = await getBotResponseFromAI(userMessage);
            
            hideTypingIndicator(); // Hide typing animation
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
        scrollToBottom();
    }

    // Function to show the typing indicator
    function showTypingIndicator() {
        const indicatorDiv = document.createElement('div');
        indicatorDiv.id = 'typing-indicator';
        indicatorDiv.classList.add('message', 'bot', 'typing-indicator');
        indicatorDiv.innerHTML = '<span></span><span></span><span></span>';
        messagesContainer.appendChild(indicatorDiv);
        scrollToBottom();
    }

    // Function to hide the typing indicator
    function hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            messagesContainer.removeChild(indicator);
        }
    }

    // Function to scroll the chat window to the bottom
    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // --- NEW: Improved AI Response Logic ---

    // Database of known questions and answers
    const knownAnswers = {
        "where is library in uit": "Library is on the ground floor, adjcent to the cse 3 near the stairs.",
        "how to apply for a bonafide certificate": "For a bonafide certificate you have to reach the 1st floor of the admission block with normal details like student name, ERP id , adhaar no.",
        "where is the dean office in uit": "It is at the right side immidiately as you enter the uit building.",
        "what is the duration of scholership offered by the college": "the scholrship of domicile is for all 4 years but the scholership on the marks of class 12th is only for the 1st year(2 semesters) only",
        "hello": "Hello there! How can I assist you?",
        "hi": "Hello there! How can I assist you?",
        "hey": "Hello there! How can I assist you?",
        "what is the college timing": "The college timings are generally from 9:30 AM to 4:30 PM, Monday to Friday. Please check your department's specific timetable for class schedules.",
        "where can i find the syllabus": "You can find the official syllabus for all courses on the university ERP under the 'Library' section named previous syllabus.",
        "how to check my attendance": "Your attendance can be viewed by logging into the ERP there in the attendance section. It is updated regularly by the faculty.",
        "where is the canteen": "The main canteen, backhouse, cafeteria is located near the Auditorium. There are also Tea stall beside the uit building.",
        "is there a dress code": "Yes, students are required to adhere to the university's dress code. On Mondays and Thursdays, formals are mandatory. On other days, smart casuals are permitted.",
        "what are the library hours": "The central library is open from 9:00 AM to 8:00 PM on weekdays and from 10:00 AM to 4:00 PM on Saturdays. It remains closed on Sundays and public holidays.",
        "how do i pay my fees": "You can pay your fees online through the student ERP portal using net banking, credit/debit cards, or UPI. You can also pay offline at the accounts office in the admin block.",
        "who is the head of the cse department": "The Head of the Computer Science Department can be found in their office on the 2nd floor of the engineering block. It's best to check the website for the current HOD's name.",
        "how to get a new id card": "To get a new ID card, you need to report the loss to the student services office. You will have to fill out a form and pay a small fee for a duplicate card.",
        "are there any clubs i can join": "Absolutely! There are many technical, cultural, and sports clubs on campus. You can find information about them and the joining process during the annual club recruitment drive or on the student council notice board.",
        "thank you": "You're welcome! Is there anything else I can help you with?",
        "bye": "Goodbye! Have a great day."

// --- End: Paste before the last closing brace } ---
    };

    // Fallback response
    const fallbackResponse = "I'm sorry, I don't have an answer for that specific question. You can try asking about room locations, certificates, or dress code. If you need further assistance, please visit the student services office.";

    // Function to process and tokenize text
    function tokenize(text) {
        // Lowercase, remove punctuation, and split into words
        // Also removes common "stop words" that don't add much meaning
        const stopWords = new Set(['i', 'me', 'my', 'a', 'an', 'the', 'is', 'are', 'in', 'on', 'to', 'for', 'of', 'how', 'what', 'where', 'when', 'why']);
        return text.toLowerCase()
                   .replace(/[^\w\s]/g, '') // remove punctuation
                   .split(/\s+/) // split by spaces
                   .filter(word => word.length > 0 && !stopWords.has(word));
    }

    // Placeholder function for AI interaction (with improved logic)
    async function getBotResponseFromAI(userMessage) {
        return new Promise(resolve => {
            setTimeout(() => {
                const userTokens = tokenize(userMessage);
                let bestMatch = null;
                let highestScore = 0;

                // Loop through all known questions
                for (const question in knownAnswers) {
                    const questionTokens = tokenize(question);
                    
                    // Calculate a score based on matching tokens
                    let currentScore = 0;
                    for (const token of userTokens) {
                        if (questionTokens.includes(token)) {
                            currentScore++;
                        }
                    }

                    // Give a bonus if the token count is similar
                    if (Math.abs(userTokens.length - questionTokens.length) < 3) {
                        currentScore += 0.5;
                    }

                    // Update the best match if this one is better
                    if (currentScore > highestScore) {
                        highestScore = currentScore;
                        bestMatch = knownAnswers[question];
                    }
                }

                // Require a minimum score to consider it a match
                if (highestScore > 1) { // Threshold (e.g., at least 2 keywords match)
                    resolve(bestMatch);
                } else {
                    resolve(fallbackResponse);
                }
            }, 1000); // Simulate API delay
        });
    }

    // --- End of Improved AI Logic ---

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
            // Cancel any ongoing speech
            SpeechSynthesis.cancel();
            
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