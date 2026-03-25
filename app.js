import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import taskRoutes from "./routes/tasks.js";
import "./db/connect.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("./public"));

app.use("/api/v1/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.sendFile(new URL("./public/index.html", import.meta.url).pathname);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
