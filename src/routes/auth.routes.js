//archivo auth.routes.js
import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js"; // ← NUEVO: Importar loginUser

const router = Router();

// Ruta existente de registro
router.post("/register", registerUser);

// Nueva ruta de login (COMMIT 6)
router.post("/login", loginUser);

export default router;