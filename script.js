const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");

let stage = "greet";

async function sendMessage() {
    const message = input.value.trim();
    if (!message) return;

    appendUserBubble(message);
    input.value = "";

    showTyping();
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
                removeTyping();
                return appendBotBubble("Please enter 3 remainders separated by spaces.");
            }
            break;

        case "count-intro":
            botResponse = "Now I will prove to you that I can count to any number you want. Please type in a number:";
            stage = "count";
            break;

        case "count":
            botResponse = await postJSON("/count", { num: parseInt(message) });
            stage = "test-intro";
            break;

        case "test-intro":
            botResponse = "Let's test your programming knowledge.\nWhy do we use 'sout' in IntelliJ IDEA?\n1. To highlight the code\n2. Use it as a shortcut to type in the Print command\n3. To make code more readable\n4. To save a file";
            stage = "test";
            break;

        case "test":
            botResponse = await postJSON("/test", { answer: message });
            if (botResponse !== "Correct!") {
                removeTyping();
                return appendBotBubble(botResponse);
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

    removeTyping();
    appendBotBubble(botResponse);
}

function appendUserBubble(message) {
    const bubble = document.createElement("div");
    bubble.className = "bubble user";
    bubble.innerHTML = `<strong>You:</strong> ${message}`;
    chatBox.appendChild(bubble);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function appendBotBubble(message) {
    const bubble = document.createElement("div");
    bubble.className = "bubble bot";
    message.split("\n").forEach((line) => {
        const p = document.createElement("p");
        p.textContent = line;
        bubble.appendChild(p);
    });
    chatBox.appendChild(bubble);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function showTyping() {
    const typing = document.createElement("div");
    typing.className = "bubble bot typing";
    typing.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;
    chatBox.appendChild(typing);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTyping() {
    const typing = document.querySelector(".typing");
    if (typing) typing.remove();
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
        const result = await res.json();
        return typeof result === "string" ? result : JSON.stringify(result);
    } else {
        return res.text();
    }
}

input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});
