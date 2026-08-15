import { API_BASE_URL } from "./api.js";

const registerForm =
    document.querySelector("#register-form");

registerForm.addEventListener(
    "submit",
    async (event) => {
        event.preventDefault();

        const name =
            document.querySelector("#name").value;

        const email =
            document.querySelector("#email").value;

        const password =
            document.querySelector("#password").value;

        try {
            const response = await fetch(
                `${API_BASE_URL}/auth/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Registration failed"
                );
            }

            alert("Registration successful!");
            window.location.href =
                "login.html";
        } catch (error) {
            alert(error.message);
        }
    }
);