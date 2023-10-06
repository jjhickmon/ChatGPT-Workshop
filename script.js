const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
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
    // Call OpenAI API to get chatbot response
    const response = await getChatbotResponse(userMessage);
    response.trim();
    appendMessage(response, "chatbot");
}
async function getChatbotResponse(userMessage) {
    const response = await fetch("---YOUR OPENAI API KEY HERE---", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer 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"
        },
        body: JSON.stringify({
            prompt: userMessage,
            max_tokens: 150
        })
    });
    const data = await response.json();
    console.log(data.choices[0].text);
    return data.choices[0].text;
}
