// app.js - Archivo principal de Express
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { PORT } from "./config/env.js";

// Rutas
import taskRoutes from "./routes/tasks.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";

// Passport (nuevo)
import passport from "./config/passport.js";

const app = express();

// ========================================
// 1. CONFIGURACIÓN DE CORS
// ========================================
app.use(cors({
  origin: [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://localhost:3000",
    "http://localhost:5173"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


// ========================================
// 2. MIDDLEWARES BÁSICOS
// ========================================
app.use(express.json());

// ========================================
// 3. INICIALIZAR PASSPORT (COMMIT 9)
// ========================================
/**
 * Passport se inicializa una vez aquí.
 * Después lo usaremos en rutas protegidas:
 * passport.authenticate("jwt", { session: false })
 */
app.use(passport.initialize());

// ========================================
// 4. RATE LIMITING
// ========================================
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: {
    error: "Demasiados intentos de autenticación. Por favor, intenta de nuevo en 1 minuto."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const tasksLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: {
    error: "Demasiadas peticiones a tareas. Por favor, intenta de nuevo en 1 minuto."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/auth", authLimiter);
app.use("/tasks", tasksLimiter);

// ========================================
// 5. RUTAS DE LA APLICACIÓN
// ========================================
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes); 
app.use("/admin", adminRoutes);

// ========================================
// 6. HEALTH CHECK
// ========================================
app.get("/", (req, res) => {
  res.json({
    message: "API REST PAREJA - Running ✅",
    version: "1.0.0",
    endpoints: {
      auth: "/auth (register, login)",
      tasks: "/tasks (CRUD protegido con Passport)",
      admin: "/admin (solo admin)"
    }
  });
});

// ========================================
// 7. INICIAR SERVIDOR
// ========================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📋 CORS habilitado para: http://localhost:5173`);
  console.log(`🛡️  Rate limiting activo: /auth y /tasks`);
  console.log(`🔐 Passport JWT activo`);
});
