const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const API_KEY = "--Your API Key Here--";

const recognition = new webkitSpeechRecognition();
recognition.interimResults = true;
recognition.addEventListener('result', function(e){
    const transcript = e.results[0][0].transcript;
    console.log(transcript);
    userInput.value = transcript;
});
recognition.addEventListener('end', recognition.start);
recognition.start();

function appendMessage(message, sender) {
    const messageElement = document.createElement("div");
    messageElement.classList.add(sender);
    messageElement.innerText = message;
    chatBox.appendChild(messageElement);
}

async function sendMessage() {
    const userMessage = userInput.value;
    appendMessage(userMessage, "user");
    userInput.value = "";

    // NOTE: Speech synthesis
    const response = await getChatbotResponseDialoGPT(userMessage);
    response.trim();
    const msg = new SpeechSynthesisUtterance();
    msg.text = response;
    window.speechSynthesis.speak(msg);

    appendMessage(response, "chatbot");
}

async function getChatbotResponseGPT2(userMessage) {
    const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + API_KEY
        },
        body: JSON.stringify({"inputs": userMessage})
    });
    const data = await response.json();
    return data[0].generated_text;
}

async function getChatbotResponseCodeLlama(userMessage) {
    const response = await fetch("https://api-inference.huggingface.co/models/codellama/CodeLlama-34b-Instruct-hf", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + API_KEY
        },
        body: JSON.stringify({"inputs": userMessage})
    });
    const data = await response.json();
    return data[0].generated_text;
}

let prev_user_inputs = [];
let prev_generated_responses = []
async function getChatbotResponseDialoGPT(userMessage) {
    const input = {"inputs": {
        "past_user_inputs": prev_user_inputs,
        "generated_responses": prev_generated_responses,
        "text": userMessage}}
    const response = await fetch("https://api-inference.huggingface.co/models/microsoft/DialoGPT-large", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + API_KEY
        },
        body: JSON.stringify(input)
    });
    const data = await response.json();
    prev_user_inputs.push(userMessage);
    prev_generated_responses.push(data.generated_text);
    return data.generated_text;
}