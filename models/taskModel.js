import connection from "../db/connect.js";

const getAllTasksFromDb = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM tasks ORDER BY id DESC";

    connection.query(sql, (err, results) => {
      if (err) {
        reject(err);
      } else {
        const formattedResults = results.map((task) => ({
          ...task,
          completed: Boolean(task.completed),
        }));
        resolve(formattedResults);
      }
    });
  });
};

const createTaskInDb = (name, completed) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO tasks (name, completed) VALUES (?, ?)";

    connection.query(sql, [name, completed], (err, result) => {
      if (err) {
        reject(err);
      } else {
        const getInsertedTaskSql = "SELECT * FROM tasks WHERE id = ?";

        connection.query(
          getInsertedTaskSql,
          [result.insertId],
          (err2, rows) => {
            if (err2) {
              reject(err2);
            } else {
              resolve({
                ...rows[0],
                completed: Boolean(rows[0].completed),
              });
            }
          },
        );
      }
    });
  });
};

const getTaskById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM tasks WHERE id = ?";

    connection.query(sql, [id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        if (results.length === 0) {
          resolve(null);
        } else {
          resolve({
            ...results[0],
            completed: Boolean(results[0].completed),
          });
        }
      }
    });
  });
};

const updateTaskById = (id, name, completed) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE tasks SET name = ?, completed = ? WHERE id = ?";

    connection.query(sql, [name, completed, id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        if (result.affectedRows === 0) {
          resolve(null);
        } else {
          const getUpdatedTaskSql = "SELECT * FROM tasks WHERE id = ?";

          connection.query(getUpdatedTaskSql, [id], (err2, rows) => {
            if (err2) {
              reject(err2);
            } else {
              resolve({
                ...rows[0],
                completed: Boolean(rows[0].completed),
              });
            }
          });
        }
      }
    });
  });
};

const deleteTaskById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM tasks WHERE id = ?";

    connection.query(sql, [id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.affectedRows > 0);
      }
    });
  });
};

export {
  getAllTasksFromDb,
  createTaskInDb,
  getTaskById,
  updateTaskById,
  deleteTaskById,
};
