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

        if (!response.ok) {
            console.error("Failed to load tasks:", data);
            return;
        }

        taskList.innerHTML = data.map(task => `
            <li class="task-item">
                <span class="task-title">
                    ${task.title}
                </span>

                <div class="task-actions">
                    <button
                        class="edit-btn"
                        onclick="openEditModal(${task.id}, '${task.title.replace(/'/g, "\\'")}')"
                    >
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteTask(${task.id})"
                    >
                        Delete
                    </button>
                </div>
            </li>
        `).join("");

    } catch (error) {
        console.error("Unable to load tasks:", error);
    }
}


// ===================== CREATE TASK =====================

taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.querySelector("#title").value.trim();

    if (!title) {
        return;
    }

    try {
        await apiFetch("/tasks", {
            method: "POST",
            body: JSON.stringify({
                title: title
            })
        });

        taskForm.reset();

        loadTasks();

    } catch (error) {
        console.error("Unable to create task:", error);
    }
});


// ===================== OPEN EDIT MODAL =====================

window.editTask = function (id, title) {
    editTaskId.value = id;
    editTitle.value = title;

    editModal.classList.add("show");
};


// ===================== UPDATE TASK =====================

editForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = editTaskId.value;
    const title = editTitle.value.trim();

    if (!title) {
        return;
    }

    try {
        await apiFetch(`/tasks/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                title: title
            })
        });

        editModal.classList.remove("show");

        editForm.reset();

        loadTasks();

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

window.deleteTask = async function (id) {
    try {
        await apiFetch(`/tasks/${id}`, {
            method: "DELETE"
        });

        loadTasks();

    } catch (error) {
        console.error("Unable to delete task:", error);
    }
};


// ===================== LOGOUT =====================

logoutButton.addEventListener("click", () => {
    localStorage.removeItem("accessToken");
    window.location.href = "login.html";
});


// ===================== INITIAL LOAD =====================

loadTasks();