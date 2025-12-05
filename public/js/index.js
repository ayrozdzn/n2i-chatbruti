async function fetchGeminiResponse(content) {
    const apiUrl = "/ask";
    const headers = {
        "Content-Type": "application/json",
    };

    if (!content || content.trim() === "") {
        return {
            status: 400,
            data: { success: false, error: "Aucun message fourni." }
        };
    }

    const requestBody = { content };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (!response.ok) {
            throw { status: response.status, data };
        }

        return { status: response.status, data };
    } catch (error) {
        if (error.status && error.data) {
            return { status: error.status, data: error.data };
        } else {
            return {
                status: 500,
                data: { success: false, error: "Erreur interne du serveur" }
            };
        }
    }
}

const messagesContainer = document.querySelector(".messages");

function addMessage(content, sender) {
    const message = document.createElement("div");
    message.classList.add("message", sender);
    message.textContent = content;
    messagesContainer.appendChild(message);

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

document.addEventListener("DOMContentLoaded", () => {
    const input = document.querySelector(".input-area input");
    const button = document.querySelector(".input-area button");
    const messagesDiv = document.querySelector(".messages");

    function addMessage(text, type = "user") {
        const msg = document.createElement("div");
        msg.classList.add("message", type);
        msg.textContent = text;
        messagesDiv.appendChild(msg);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    button.addEventListener("click", async () => {
        const content = input.value;
        input.value = "";

        if (!content.trim()) {
            addMessage("❌ Tu dois écrire un message avant d'envoyer.", "error");
            return;
        }

        addMessage(content, "user");

        const response = await fetchGeminiResponse(content);

        if (!response.data.success) {
            addMessage("⚠️ Erreur : " + response.data.error, "error");
        } else {
            addMessage(response.data.data, "bot");
        }

    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") button.click();
    });
});