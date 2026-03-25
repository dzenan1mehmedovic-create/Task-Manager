const tasksDOM = document.querySelector(".tasks");
const formDOM = document.querySelector(".task-form");
const taskInputDOM = document.querySelector(".task-input");
const formAlertDOM = document.querySelector(".form-alert");

const showTasks = async () => {
  try {
    const response = await fetch("/api/v1/tasks");
    const data = await response.json();

    const { tasks } = data;

    if (tasks.length < 1) {
      tasksDOM.innerHTML = "<h5>No tasks in your list</h5>";
      return;
    }

    const allTasks = tasks
      .map((task) => {
        return `
          <div class="single-task">
            <div class="task-title">
              <input type="checkbox" ${task.completed ? "checked" : ""} disabled />
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
    tasksDOM.innerHTML = "<h5>There was an error, please try later...</h5>";
  }
};

showTasks();

formDOM.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = taskInputDOM.value;

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
    formAlertDOM.textContent = "Task added successfully";
    showTasks();

    setTimeout(() => {
      formAlertDOM.textContent = "";
    }, 2000);
  } catch (error) {
    formAlertDOM.textContent = "Error, please try again";
    setTimeout(() => {
      formAlertDOM.textContent = "";
    }, 2000);
  }
});

tasksDOM.addEventListener("click", async (e) => {
  const el = e.target;

  if (el.classList.contains("delete-btn")) {
    const id = el.dataset.id;

    try {
      const response = await fetch(`/api/v1/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error deleting task");
      }

      showTasks();
    } catch (error) {
      formAlertDOM.textContent = "Error, please try again";
      setTimeout(() => {
        formAlertDOM.textContent = "";
      }, 2000);
    }
  }
});
