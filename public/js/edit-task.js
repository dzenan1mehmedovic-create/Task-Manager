const taskIDDOM = document.querySelector(".task-edit-id");
const taskNameDOM = document.querySelector(".task-edit-name");
const taskCompletedDOM = document.querySelector(".task-edit-completed");
const editFormDOM = document.querySelector(".single-task-form");
const formAlertDOM = document.querySelector(".form-alert");

const params = window.location.search;
const id = new URLSearchParams(params).get("id");

const loadTask = async () => {
  try {
    const response = await fetch(`/api/v1/tasks/${id}`);
    const data = await response.json();

    const { task } = data;

    taskIDDOM.textContent = task.id;
    taskNameDOM.value = task.name;
    taskCompletedDOM.checked = task.completed;
  } catch (error) {
    formAlertDOM.textContent = "Error loading task";
  }
};

loadTask();

editFormDOM.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = taskNameDOM.value;
  const completed = taskCompletedDOM.checked;

  try {
    const response = await fetch(`/api/v1/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, completed }),
    });

    if (!response.ok) {
      throw new Error("Error updating task");
    }

    formAlertDOM.textContent = "Task updated successfully";

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
