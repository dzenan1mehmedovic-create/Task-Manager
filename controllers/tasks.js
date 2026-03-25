import {
  getAllTasksFromDb,
  createTaskInDb,
  getTaskById,
  updateTaskById,
  deleteTaskById,
} from "../models/taskModel.js";

const getAllTasks = async (req, res) => {
  try {
    const tasks = await getAllTasksFromDb();
    res.status(200).json({ tasks, count: tasks.length });
  } catch (error) {
    res.status(500).json({ msg: "Error fetching tasks" });
  }
};

const createTask = async (req, res) => {
  try {
    const { name, completed } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ msg: "Name is required" });
    }

    const newTask = await createTaskInDb(name, completed ?? false);
    res.status(201).json({ task: newTask });
  } catch (error) {
    res.status(500).json({ msg: "Error creating task" });
  }
};

const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await getTaskById(id);

    if (!task) {
      return res.status(404).json({ msg: `No task with id: ${id}` });
    }

    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ msg: "Error fetching task" });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, completed } = req.body;

    const existingTask = await getTaskById(id);

    if (!existingTask) {
      return res.status(404).json({ msg: `No task with id: ${id}` });
    }

    const updatedTask = await updateTaskById(
      id,
      name ?? existingTask.name,
      completed ?? existingTask.completed,
    );

    res.status(200).json({ task: updatedTask });
  } catch (error) {
    res.status(500).json({ msg: "Error updating task" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteTaskById(id);

    if (!deleted) {
      return res.status(404).json({ msg: `No task with id: ${id}` });
    }

    res.status(200).json({ msg: "Task deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Error deleting task" });
  }
};

export { getAllTasks, createTask, getTask, updateTask, deleteTask };
