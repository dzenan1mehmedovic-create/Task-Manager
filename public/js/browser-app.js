const tasksDOM = document.querySelector(".tasks");
const formDOM = document.querySelector(".task-form");
const taskInputDOM = document.querySelector(".task-input");
const formAlertDOM = document.querySelector(".form-alert");

const showAlert = (text) => {
  formAlertDOM.textContent = text;

  setTimeout(() => {
    formAlertDOM.textContent = "";
  }, 2000);
};

const showTasks = async () => {
  try {
    const response = await fetch("/api/v1/tasks");
    const data = await response.json();
    const { tasks } = data;

    if (!tasks || tasks.length < 1) {
      tasksDOM.innerHTML = `<p class="empty-list">No tasks in your list</p>`;
      return;
    }

    const allTasks = tasks
      .map((task) => {
        return `
          <div class="single-task">
            <div class="task-title">
              <span class="task-complete-icon ${task.completed ? "completed" : ""}">
                ${task.completed ? "✓" : ""}
              </span>
              <p class="name ${task.completed ? "completed" : ""}">${task.name}</p>
            </div>

            <div class="task-links">
              <a href="/edit-task.html?id=${task.id}" class="edit-link">Edit</a>
              <button type="button" class="delete-btn" data-id="${task.id}">Delete</button>
            </div>
          </div>
        `;
      })
      .join("");

    tasksDOM.innerHTML = allTasks;
  } catch (error) {
    tasksDOM.innerHTML = `<p class="empty-list">There was an error, please try later</p>`;
  }
};

showTasks();

formDOM.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = taskInputDOM.value.trim();

  if (!name) {
    showAlert("Please enter a task name");
    return;
  }

  try {
    const response = await fetch("/api/v1/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error("Error creating task");
    }

    taskInputDOM.value = "";
    showAlert("Task added successfully");
    showTasks();
  } catch (error) {
    showAlert("Error, please try again");
  }
});

tasksDOM.addEventListener("click", async (e) => {
  const el = e.target;

  if (el.classList.contains("delete-btn")) {
    const { id } = el.dataset;

    try {
      const response = await fetch(`/api/v1/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error deleting task");
      }

      showTasks();
    } catch (error) {
      showAlert("Error, please try again");
    }
  }
});
