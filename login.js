const API_URL = "http://localhost:3000";

const loginForm = document.querySelector("#login-form");
const message = document.querySelector("#message");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
        message.textContent = data.message;
        return;
    }

    localStorage.setItem("accessToken", data.accessToken);

    window.location.href = "tasks.html";
});