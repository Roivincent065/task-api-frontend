import { apiFetch } from "./api.js";

const taskList = document.querySelector("#task-list");
const taskForm = document.querySelector("#task-form");
const logoutButton = document.querySelector("#logout-button");

async function loadTasks() {
    const response = await apiFetch("/tasks");
    const tasks = await response.json();

    taskList.innerHTML = tasks.map(task => `
        <li>
            ${task.title}
            <button onclick="deleteTask(${task.id})">Delete</button>
        </li>
    `).join("");
}

taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.querySelector("#title").value;

    await apiFetch("/tasks", {
        method: "POST",
        body: JSON.stringify({ title })
    });

    taskForm.reset();
    loadTasks();
});

window.deleteTask = async function (id) {
    await apiFetch(`/tasks/${id}`, {
        method: "DELETE"
    });

    loadTasks();
};

// ================Logout logic==========================
logoutButton.addEventListener("click", () => {
    localStorage.removeItem("accessToken");
    window.location.href = "./login.html";
});

loadTasks();