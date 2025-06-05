const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

let stage = "greet";

async function sendMessage(userInput = null) {
    const message = userInput !== null ? userInput : input.value.trim();
    if (!message) return;

    appendUserMessage(message);
    input.value = "";

    let botResponse = "";

    switch (stage) {
        case "greet":
            botResponse = await fetchText("/greet");
            stage = "remind-name";
            break;

        case "remind-name":
            botResponse = await postJSON("/remind-name", { name: message });
            stage = "guess-age-intro";
            break;

        case "guess-age-intro":
            botResponse = "Let me guess your age.\nEnter remainders of dividing your age by 3, 5 and 7 (e.g., '2 3 1'):";
            stage = "guess-age";
            break;

        case "guess-age":
            const remainders = message.split(" ").map(Number);
            if (remainders.length === 3) {
                botResponse = await postJSON("/guess-age", {
                    rem3: remainders[0],
                    rem5: remainders[1],
                    rem7: remainders[2]
                });
                stage = "count-intro";
            } else {
                botResponse = "Please enter 3 remainders separated by spaces.";
            }
            break;

        case "count-intro":
            botResponse = "Now I will prove to you that I can count to any number you want. Please type in a number:";
            stage = "count";
            break;

        case "count":
            const number = parseInt(message);
            if (!isNaN(number) && number >= 0) {
                let countLines = [];
                for (let i = 0; i <= number; i++) {
                    countLines.push(`${i}!`);
                }
                appendBotMessage(countLines);
                stage = "test-intro";
                setTimeout(() => sendMessage(""), 500);
                return;
            } else {
                botResponse = "Please enter a valid non-negative number.";
            }
            break;

        case "test-intro":
            botResponse = "Let's test your programming knowledge.\nWhy do we use 'sout' in IntelliJ IDEA?\n1. To highlight the code\n2. Use it as a shortcut to type in the Print command\n3. To make code more readable\n4. To save a file";
            stage = "test";
            break;

        case "test":
            botResponse = await postJSON("/test", { answer: message });
            if (botResponse !== "Correct!") {
                appendBotMessage(botResponse);
                return;
            }
            stage = "end";
            break;

        case "end":
            botResponse = await fetchText("/end");
            stage = "done";
            break;

        default:
            botResponse = "You've completed the session!";
    }

    appendBotMessage(botResponse);
}

function appendUserMessage(msg) {
    const msgDiv = document.createElement("div");
    msgDiv.className = "message user-message";
    msgDiv.textContent = msg;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function appendBotMessage(msg) {
    if (Array.isArray(msg)) {
        msg.forEach(line => createBotBubble(line));
    } else {
        msg.split("\n").forEach(line => createBotBubble(line));
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}

function createBotBubble(text) {
    const botDiv = document.createElement("div");
    botDiv.className = "message bot-message";
    botDiv.textContent = text;
    chatBox.appendChild(botDiv);
}

async function fetchText(path) {
    const res = await fetch("https://java-chatbot-full-production.up.railway.app" + path);
    return res.text();
}

async function postJSON(path, data) {
    const res = await fetch("https://java-chatbot-full-production.up.railway.app" + path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        const json = await res.json();
        return typeof json === "string" ? json : JSON.stringify(json);
    } else {
        return res.text();
    }
}

sendBtn.addEventListener("click", () => sendMessage());
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});
