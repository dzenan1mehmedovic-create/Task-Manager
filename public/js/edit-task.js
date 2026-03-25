const taskIDDOM = document.querySelector(".task-edit-id");
const taskNameDOM = document.querySelector(".task-edit-name");
const taskCompletedDOM = document.querySelector(".task-edit-completed");
const editFormDOM = document.querySelector(".single-task-form");
const formAlertDOM = document.querySelector(".form-alert");
const editBtnDOM = document.querySelector(".edit-task-btn");

const params = window.location.search;
const id = new URLSearchParams(params).get("id");

const showAlert = (text) => {
  formAlertDOM.textContent = text;

  setTimeout(() => {
    formAlertDOM.textContent = "";
  }, 2000);
};

const setLoading = (loading) => {
  editBtnDOM.disabled = loading;
  editBtnDOM.textContent = loading ? "Saving..." : "Edit";
  editBtnDOM.style.opacity = loading ? "0.7" : "1";
  editBtnDOM.style.cursor = loading ? "not-allowed" : "pointer";
};

const loadTask = async () => {
  try {
    const response = await fetch(`/api/v1/tasks/${id}`);
    const data = await response.json();

    const { task } = data;

    taskIDDOM.textContent = task.id;
    taskNameDOM.value = task.name;
    taskCompletedDOM.checked = task.completed;
  } catch (error) {
    showAlert("Error loading task");
  }
};

loadTask();

editFormDOM.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = taskNameDOM.value.trim();
  const completed = taskCompletedDOM.checked;

  if (!name) {
    showAlert("Name is required");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(`/api/v1/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, completed }),
    });

    if (!response.ok) {
      throw new Error();
    }

    formAlertDOM.textContent = "Task updated successfully";

    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  } catch (error) {
    showAlert("Error, please try again");
  } finally {
    setLoading(false);
  }
});
