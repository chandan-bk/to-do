const savedTasks = localStorage.getItem("my-tasks");
let tasks = savedTasks ? JSON.parse(savedTasks) : [];
let selectedFilter = "all";

const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector("#taskList");
const emptyMessage = document.querySelector("#emptyMessage");
const remainingCount = document.querySelector("#remainingCount");

function saveTasks() {
    localStorage.setItem("my-tasks", JSON.stringify(tasks));
}

function showTasks() {
    taskList.innerHTML = "";

    const visibleTasks = tasks.filter((task) => {
        if (selectedFilter === "active") return !task.done;
        if (selectedFilter === "completed") return task.done;
        return true;
    });

    visibleTasks.forEach((task) => {
        const listItem = document.createElement("li");
        if (task.done) listItem.classList.add("done");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done;
        checkbox.addEventListener("change", () => {
            task.done = checkbox.checked;
            saveTasks();
            showTasks();
        });

        const taskText = document.createElement("span");
        taskText.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter((item) => item.id !== task.id);
            saveTasks();
            showTasks();
        });

        listItem.append(checkbox, taskText, deleteButton);
        taskList.appendChild(listItem);
    });

    const tasksLeft = tasks.filter((task) => !task.done).length;
    remainingCount.textContent = tasksLeft;
    emptyMessage.hidden = visibleTasks.length !== 0;
}

taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = taskInput.value.trim();

    if (text === "") return;

    tasks.push({
        id: Date.now(),
        text: text,
        done: false
    });

    taskInput.value = "";
    saveTasks();
    showTasks();
});

document.querySelectorAll(".filter-button").forEach((button) => {
    button.addEventListener("click", () => {
        selectedFilter = button.dataset.filter;

        document.querySelectorAll(".filter-button").forEach((item) => {
            item.classList.remove("active");
        });
        button.classList.add("active");
        showTasks();
    });
});

document.querySelector("#clearCompleted").addEventListener("click", () => {
    tasks = tasks.filter((task) => !task.done);
    saveTasks();
    showTasks();
});

showTasks();
