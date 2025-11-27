import { Router } from "express";
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/tasks.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

// Proteger todas las rutas
router.use(authMiddleware);

router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
