// ==============================
// SELECT HTML ELEMENTS
// ==============================

const taskForm = document.getElementById("taskForm");

const taskInput = document.getElementById("taskInput");

const taskList = document.getElementById("taskList");

const taskCount = document.getElementById("taskCount");

const clearCompletedButton =
    document.getElementById("clearCompleted");

const filterButtons =
    document.querySelectorAll(".filter");


// ==============================
// APPLICATION DATA
// ==============================

let tasks =
    JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";


// ==============================
// SAVE TASKS
// ==============================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// ==============================
// DISPLAY TASKS
// ==============================

function renderTasks() {

    taskList.innerHTML = "";


    // Filter tasks

    let filteredTasks = tasks.filter(function(task) {

        if (currentFilter === "active") {

            return !task.completed;

        }

        if (currentFilter === "completed") {

            return task.completed;

        }

        return true;

    });


    // No tasks

    if (filteredTasks.length === 0) {

        taskList.innerHTML = `
            <li class="empty-message">
                No tasks found.
            </li>
        `;

    }


    // Create each task

    filteredTasks.forEach(function(task) {

        const li = document.createElement("li");

        li.className = "task";


        if (task.completed) {

            li.classList.add("completed");

        }


        li.innerHTML = `

            <input
                type="checkbox"
                class="task-checkbox"
                ${task.completed ? "checked" : ""}
            >

            <span class="task-text">
                ${escapeHTML(task.text)}
            </span>

            <button class="edit-btn">
                Edit
            </button>

            <button class="delete-btn">
                Delete
            </button>

        `;


        // Checkbox

        const checkbox =
            li.querySelector(".task-checkbox");

        checkbox.addEventListener("change", function() {

            toggleTask(task.id);

        });


        // Edit button

        const editButton =
            li.querySelector(".edit-btn");

        editButton.addEventListener("click", function() {

            editTask(task.id);

        });


        // Delete button

        const deleteButton =
            li.querySelector(".delete-btn");

        deleteButton.addEventListener("click", function() {

            deleteTask(task.id);

        });


        taskList.appendChild(li);

    });


    updateTaskCount();

}


// ==============================
// ADD TASK
// ==============================

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const text = taskInput.value.trim();


    // Don't add empty task

    if (text === "") {

        alert("Please enter a task.");

        return;

    }


    const newTask = {

        id: Date.now(),

        text: text,

        completed: false

    };


    tasks.push(newTask);


    saveTasks();

    renderTasks();


    // Clear input

    taskInput.value = "";

    taskInput.focus();

});


// ==============================
// COMPLETE / UNCOMPLETE TASK
// ==============================

function toggleTask(id) {

    tasks = tasks.map(function(task) {

        if (task.id === id) {

            return {
                ...task,
                completed: !task.completed
            };

        }

        return task;

    });


    saveTasks();

    renderTasks();

}


// ==============================
// DELETE TASK
// ==============================

function deleteTask(id) {

    tasks = tasks.filter(function(task) {

        return task.id !== id;

    });


    saveTasks();

    renderTasks();

}


// ==============================
// EDIT TASK
// ==============================

function editTask(id) {

    const task = tasks.find(function(task) {

        return task.id === id;

    });


    if (!task) {

        return;

    }


    const newText = prompt(
        "Edit your task:",
        task.text
    );


    if (newText === null) {

        return;

    }


    const cleanedText = newText.trim();


    if (cleanedText === "") {

        alert("Task cannot be empty.");

        return;

    }


    task.text = cleanedText;


    saveTasks();

    renderTasks();

}


// ==============================
// FILTER TASKS
// ==============================

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        // Remove active class

        filterButtons.forEach(function(btn) {

            btn.classList.remove("active");

        });


        // Add active class

        button.classList.add("active");


        // Get selected filter

        currentFilter =
            button.dataset.filter;


        renderTasks();

    });

});


// ==============================
// CLEAR COMPLETED
// ==============================

clearCompletedButton.addEventListener(
    "click",
    function() {

        tasks = tasks.filter(function(task) {

            return !task.completed;

        });


        saveTasks();

        renderTasks();

    }
);


// ==============================
// TASK COUNTER
// ==============================

function updateTaskCount() {

    const remainingTasks =
        tasks.filter(function(task) {

            return !task.completed;

        }).length;


    if (remainingTasks === 1) {

        taskCount.textContent =
            "1 task left";

    } else {

        taskCount.textContent =
            `${remainingTasks} tasks left`;

    }

}


// ==============================
// SECURITY HELPER
// ==============================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ==============================
// INITIAL RENDER
// ==============================

renderTasks();