import { apiFetch } from "./api.js";

const registerForm =
    document.querySelector("#register-form");

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name =
        document.querySelector("#name").value.trim();

    const email =
        document.querySelector("#email").value.trim();

    const password =
        document.querySelector("#password").value;

    try {
        const response = await apiFetch("/auth/register", {
            method: "POST",
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Registration failed"
            );
        }

        alert("Registration successful!");

        window.location.href = "index.html";

    } catch (error) {
        console.error("Registration error:", error);
        alert(error.message);
    }
});