// app.js - Archivo principal de Express
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { PORT } from "./config/env.js";
import taskRoutes from "./routes/tasks.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// ========================================
// 1. CONFIGURACIÓN DE CORS
// ========================================
/**
 * CORS (Cross-Origin Resource Sharing)
 * Permite que aplicaciones frontend de otros dominios accedan a esta API.
 * 
 * ¿Por qué lo usamos?
 * - Por defecto, los navegadores bloquean peticiones entre diferentes orígenes
 *   por seguridad (política Same-Origin).
 * - Si nuestro frontend está en http://localhost:5173 (React/Vite) y nuestra
 *   API en http://localhost:3000, necesitamos CORS para permitir la comunicación.
 * 
 * Configuración actual:
 * - origin: Solo permite peticiones desde http://localhost:5173
 * - credentials: true → Permite envío de cookies y headers de autenticación
 * - optionsSuccessStatus: 200 → Para compatibilidad con navegadores antiguos
 */
const corsOptions = {
  origin: "http://localhost:5173", // URL del frontend (React, Vue, Angular, etc.)
  credentials: true,                // Permitir cookies y headers de autorización
  optionsSuccessStatus: 200        // Para compatibilidad con navegadores legacy
};

app.use(cors(corsOptions));

// NOTA: Si aún no tienes frontend, puedes usar esta configuración temporal para desarrollo:
// app.use(cors({ origin: "*" })); // ⚠️ Solo para desarrollo, NO usar en producción


// ========================================
// 2. MIDDLEWARES BÁSICOS DE EXPRESS
// ========================================
app.use(express.json()); // Para parsear JSON en el body


// ========================================
// 3. RATE LIMITING - LIMITADOR GENERAL PARA /auth
// ========================================
/**
 * Rate Limiting para rutas de autenticación (/auth/*)
 * 
 * ¿Por qué lo usamos?
 * - Previene ataques de fuerza bruta: Un atacante no puede intentar
 *   miles de contraseñas en poco tiempo.
 * - Protege el servidor: Evita sobrecarga por peticiones masivas.
 * - Mejora la seguridad: Similar a cuando un cajero bloquea tu tarjeta
 *   después de 3 intentos fallidos.
 * 
 * Configuración actual:
 * - windowMs: 1 minuto (60,000 ms)
 * - max: 5 peticiones máximo por IP en ese minuto
 * - message: Mensaje que se envía cuando se excede el límite
 * - standardHeaders: true → Incluye info del límite en headers (RateLimit-*)
 * - legacyHeaders: false → No usa headers antiguos (X-RateLimit-*)
 * 
 * Ejemplo práctico:
 * - Si alguien intenta hacer login 6 veces en 1 minuto, la 6ta petición
 *   será rechazada con error 429 (Too Many Requests).
 */
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,  // 1 minuto
  max: 5,                    // Máximo 5 peticiones por IP
  message: {
    error: "Demasiados intentos de autenticación. Por favor, intenta de nuevo en 1 minuto."
  },
  standardHeaders: true,     // Retorna info del rate limit en headers `RateLimit-*`
  legacyHeaders: false,      // Deshabilita headers antiguos `X-RateLimit-*`
});


// ========================================
// 4. RATE LIMITING - LIMITADOR PARA /tasks (Opcional)
// ========================================
/**
 * Rate Limiting para rutas de tareas (/tasks/*)
 * 
 * ¿Por qué lo usamos?
 * - Evita que un usuario abuse de la API creando/actualizando
 *   miles de tareas en poco tiempo.
 * - Protege la base de datos de operaciones excesivas.
 * - Mejora el rendimiento general de la aplicación.
 * 
 * Configuración actual:
 * - windowMs: 1 minuto
 * - max: 20 peticiones por IP (más permisivo que auth porque son operaciones normales)
 */
const tasksLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,   // 1 minuto
  max: 20,                    // Máximo 20 peticiones por IP
  message: {
    error: "Demasiadas peticiones a tareas. Por favor, intenta de nuevo en 1 minuto."
  },
  standardHeaders: true,
  legacyHeaders: false,
});


// ========================================
// 5. APLICAR RATE LIMITERS ANTES DE LAS RUTAS
// ========================================
// Importante: Los limitadores deben aplicarse ANTES de registrar las rutas

app.use("/auth", authLimiter);   // Aplicar limitador a /auth
app.use("/tasks", tasksLimiter); // Aplicar limitador a /tasks


// ========================================
// 6. RUTAS DE LA APLICACIÓN
// ========================================
app.use("/tasks", taskRoutes);   // Rutas de tareas (CRUD protegido)
app.use("/auth", authRoutes);    // Rutas de autenticación (register, login)


// ========================================
// 7. RUTA DE HEALTH CHECK
// ========================================
/**
 * Endpoint simple para verificar que el servidor está funcionando.
 * Útil para monitoreo y testing.
 */
app.get("/", (req, res) => {
  res.json({
    message: "API REST PAREJA - Running ✅",
    version: "1.0.0",
    endpoints: {
      auth: "/auth (register, login)",
      tasks: "/tasks (CRUD protegido)"
    }
  });
});


// ========================================
// 8. INICIAR SERVIDOR
// ========================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📋 CORS habilitado para: http://localhost:5173`);
  console.log(`🛡️  Rate limiting activo:`);
  console.log(`   - /auth: Máximo 5 peticiones por minuto`);
  console.log(`   - /tasks: Máximo 20 peticiones por minuto`);
});