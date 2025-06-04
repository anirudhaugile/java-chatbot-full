async function sendMessage() {
    const input = document.getElementById("user-input");
    const message = input.value.trim();
    if (!message) return;

    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML += `<div><strong>You:</strong> ${message}</div>`;

    const response = await fetch("https://YOUR_RENDER_URL/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message)
    });

    const reply = await response.text();
    chatBox.innerHTML += `<div><strong>Bot:</strong> ${reply}</div>`;

    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
}
