import express from "express";
import { PORT } from "./config/env.js";
import taskRoutes from "./routes/tasks.routes.js";


const app = express();
app.use(express.json());

app.use("/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("API running");
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
