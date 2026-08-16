import { apiFetch } from "./api.js";

const taskList = document.querySelector("#task-list");
const taskForm = document.querySelector("#task-form");

const editModal = document.querySelector("#edit-modal");
const editForm = document.querySelector("#edit-task-form");
const editTaskId = document.querySelector("#edit-task-id");
const editTitle = document.querySelector("#edit-title");
const cancelEdit = document.querySelector("#cancel-edit");

const logoutButton = document.querySelector("#logout");


// ===================== LOAD TASKS =====================

async function loadTasks() {
    try {
        const response = await apiFetch("/tasks");

        const data = await response.json();

        console.log("Tasks received:", data);

        if (!response.ok) {
            console.error("Failed to load tasks:", data);
            return;
        }

        taskList.innerHTML = "";

        data.forEach(task => {
            const li = document.createElement("li");

            li.className = "task-item";

            li.innerHTML = `
                <span class="task-title"></span>

                <div class="task-actions">
                    <button class="edit-btn">
                        Edit
                    </button>

                    <button class="delete-btn">
                        Delete
                    </button>
                </div>
            `;

            li.querySelector(".task-title").textContent =
                task.title;

            li.querySelector(".edit-btn").addEventListener(
                "click",
                () => editTask(task.id, task.title)
            );

            li.querySelector(".delete-btn").addEventListener(
                "click",
                () => deleteTask(task.id)
            );

            taskList.appendChild(li);
        });

    } catch (error) {
        console.error("Unable to load tasks:", error);
    }
}


// ===================== CREATE TASK =====================

taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document
        .querySelector("#title")
        .value
        .trim();

    if (!title) {
        return;
    }

    try {
        const response = await apiFetch("/tasks", {
            method: "POST",
            body: JSON.stringify({
                title: title
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Unable to create task:", data);
            return;
        }

        taskForm.reset();

        await loadTasks();

    } catch (error) {
        console.error("Unable to create task:", error);
    }
});


// ===================== OPEN EDIT MODAL =====================

function editTask(id, title) {
    editTaskId.value = id;
    editTitle.value = title;

    editModal.classList.add("show");

    editTitle.focus();
}


// ===================== UPDATE TASK =====================

editForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = editTaskId.value;
    const title = editTitle.value.trim();

    if (!title) {
        return;
    }

    try {
        const response = await apiFetch(`/tasks/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                title: title
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Unable to update task:", data);
            return;
        }

        editModal.classList.remove("show");

        editForm.reset();

        await loadTasks();

    } catch (error) {
        console.error("Unable to update task:", error);
    }
});


// ===================== CANCEL EDIT =====================

cancelEdit.addEventListener("click", () => {
    editModal.classList.remove("show");
    editForm.reset();
});


// ===================== CLOSE MODAL =====================

editModal.addEventListener("click", (event) => {
    if (event.target === editModal) {
        editModal.classList.remove("show");
        editForm.reset();
    }
});


// ===================== DELETE TASK =====================

async function deleteTask(id) {
    try {
        const response = await apiFetch(`/tasks/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Unable to delete task:", data);
            return;
        }

        await loadTasks();

    } catch (error) {
        console.error("Unable to delete task:", error);
    }
}


// ===================== LOGOUT =====================

logoutButton.addEventListener("click", () => {
    localStorage.removeItem("accessToken");

    window.location.href = "login.html";
});


// ===================== INITIAL LOAD =====================

loadTasks();