import { apiFetch } from "./api.js";

const loginForm = document.querySelector("#login-form");
const message = document.querySelector("#message");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    try {
        const response = await apiFetch("/auth/login", {
            method: "POST",
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            message.textContent = data.message;
            return;
        }

        localStorage.setItem("accessToken", data.accessToken);

        window.location.href = "tasks.html";

    } catch (error) {
        console.error(error);
        message.textContent = "Unable to connect to server";
    }
});