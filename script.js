const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");

let stage = "greet";

async function sendMessage() {
    const message = input.value.trim();
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
                stage = "count";
            } else {
                botResponse = "Please enter 3 remainders separated by spaces.";
            }
            break;

        case "count":
            botResponse = await postJSON("/count", { num: parseInt(message) });
            stage = "test";
            break;

        case "test":
            botResponse = await postJSON("/test", { answer: message });
            if (botResponse !== "Correct!") return appendBotMessage(botResponse);
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
    chatBox.innerHTML += `<div><strong>You:</strong> ${msg}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
}

function appendBotMessage(msg) {
    if (Array.isArray(msg)) {
        msg.forEach(line => {
            chatBox.innerHTML += `<div><strong>Bot:</strong> ${line}</div>`;
        });
    } else {
        chatBox.innerHTML += `<div><strong>Bot:</strong> ${msg}</div>`;
    }
    chatBox.scrollTop = chatBox.scrollHeight;
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
        return res.json();
    } else {
        return res.text();
    }
}
