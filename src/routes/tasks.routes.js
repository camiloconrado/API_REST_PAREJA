import { Router } from "express";
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/tasks.controller.js";

import passport from "passport";

const router = Router();

/**
 * Protección con Passport JWT
 * 
 * passport.authenticate("jwt", { session: false })
 * 
 * - Valida el token enviado en el header Authorization.
 * - Si el token es válido → req.user tendrá los datos del usuario.
 * - Si es inválido → responde con 401 automáticamente.
 */
router.use(passport.authenticate("jwt", { session: false }));

// Rutas protegidas
router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
