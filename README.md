# API REST - Sistema de Gestión de Tareas con Autenticación

API RESTful desarrollada con Node.js, Express y Prisma que implementa un sistema completo de autenticación JWT y gestión de tareas personales con múltiples capas de seguridad.

## 📋 Descripción del Proyecto

Este proyecto es una API REST que permite a los usuarios:
- ✅ Registrarse en el sistema con contraseñas encriptadas
- ✅ Iniciar sesión y recibir tokens JWT
- ✅ Gestionar sus tareas personales (crear, leer, actualizar, eliminar)
- ✅ Acceder de forma segura con autenticación basada en tokens

### Características de Seguridad Implementadas
- 🔐 **Autenticación JWT**: Tokens seguros con expiración de 1 hora
- 🔒 **Encriptación bcrypt**: Contraseñas hasheadas con 10 rondas de salt
- 🛡️ **Rate Limiting**: Protección contra ataques de fuerza bruta
  - `/auth`: Máximo 5 peticiones por minuto
  - `/tasks`: Máximo 20 peticiones por minuto
- 🌐 **CORS configurado**: Control de acceso desde `http://localhost:5173`
- ✋ **Middleware de Autenticación**: Rutas protegidas que requieren token válido
- 🗄️ **Base de datos**: PostgreSQL con Supabase

---

## 🚀 Inicio Rápido

### Prerequisitos
- Node.js v18 o superior
- PostgreSQL (Supabase recomendado)
- npm
- Git

### 1. Clonar el Repositorio
```bash
git clone https://github.com/camiloconrado/API_REST_PAREJA.git
cd API_REST_PAREJA
```

### 2. Instalar Dependencias
```bash
npm install
```

Esto instalará todas las dependencias necesarias:
- express v5.1.0
- @prisma/client v6.18.0
- jsonwebtoken v9.0.2
- bcryptjs v3.0.3
- cors v2.8.5
- express-rate-limit v8.2.1
- dotenv v17.2.3

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Puerto del servidor (opcional, por defecto 3000)
PORT=3000

# URL de conexión a PostgreSQL (Connection Pooling)
DATABASE_URL="postgresql://usuario:password@host:puerto/database?pgbouncer=true"

# URL directa para migraciones
DIRECT_URL="postgresql://usuario:password@host:puerto/database"

# Clave secreta para firmar JWT (IMPORTANTE: usa una clave aleatoria y segura)
# Puedes generarla en: https://randomkeygen.com/
JWT_SECRET="tu_clave_super_secreta_aleatoria_cambiame"
```

**⚠️ IMPORTANTE:** 
- Nunca subas el archivo `.env` a GitHub (ya está en `.gitignore`)
- Usa claves diferentes para desarrollo y producción
- Para Supabase, obtén las URLs en: Dashboard → Settings → Database

**Ejemplo con Supabase:**
```env
DATABASE_URL="postgresql://postgres.[tu-proyecto]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[tu-proyecto]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
JWT_SECRET="H'l?5&27`l!,4Q]fK(M~>MI'evsd!E"
```

### 4. Configurar la Base de Datos con Prisma

#### Generar el cliente de Prisma:
```bash
npx prisma generate
```

#### Sincronizar el schema con la base de datos:
```bash
npx prisma db push
```

O si prefieres usar migraciones:
```bash
npx prisma migrate dev --name init
```

#### (Opcional) Abrir Prisma Studio para ver la base de datos:
```bash
npx prisma studio
```
Esto abrirá una interfaz web en `http://localhost:5555`

### 5. Iniciar el Servidor

#### Modo desarrollo (con auto-reload):
```bash
npm run dev
```

#### Modo producción:
```bash
npm start
```

**Salida esperada:**
```
🚀 Servidor corriendo en http://localhost:3000
📋 CORS habilitado para: http://localhost:5173
🛡️  Rate limiting activo:
   - /auth: Máximo 5 peticiones por minuto
   - /tasks: Máximo 20 peticiones por minuto
```

El servidor estará disponible en: `http://localhost:3000`

---

## 📁 Estructura del Proyecto

```
API_REST_PAREJA/
├── src/
│   ├── config/
│   │   └── env.js              # Configuración de variables de entorno
│   ├── controllers/
│   │   ├── auth.controller.js  # Lógica de registro y login
│   │   └── tasks.controller.js # Lógica CRUD de tareas
│   ├── middlewares/
│   │   └── authMiddleware.js   # Verificación de JWT en rutas protegidas
│   ├── routes/
│   │   ├── auth.routes.js      # Rutas de autenticación
│   │   └── tasks.routes.js     # Rutas de tareas (protegidas)
│   ├── prisma/
│   │   └── schema.prisma       # Modelo de datos (User, Task)
│   ├── prismaClient.js         # Cliente de Prisma configurado
│   └── app.js                  # ⭐ Configuración principal (CORS, Rate Limit, Express)
├── docs/
│   └── security-concepts.md    # Documentación detallada de seguridad
├── .env                        # Variables de entorno (NO subir a Git)
├── .env.example                # Ejemplo de variables (SÍ subir a Git)
├── .gitignore                  # Archivos ignorados por Git
├── package.json                # Dependencias y scripts
└── README.md                   # Este archivo
```

---

## 🔐 Seguridad: Cómo Funciona

### Flujo Completo: Registro → Login → Uso de Token en /tasks

```
┌──────────────────────────────────────────────────────────────────┐
│ 1. REGISTRO DE USUARIO (POST /auth/register)                     │
└──────────────────────────────────────────────────────────────────┘
   Cliente envía → { name, email, password }
         ↓
   Archivo: src/controllers/auth.controller.js
         ↓
   • Validar que todos los campos estén presentes
   • Normalizar email (lowercase, trim)
   • Verificar que el email no exista en BD
   • Encriptar password con bcrypt (10 rondas)
   • Guardar usuario en BD con Prisma
         ↓
   Respuesta → { message: "Usuario registrado exitosamente", user: {...} }

┌──────────────────────────────────────────────────────────────────┐
│ 2. LOGIN Y GENERACIÓN DE JWT (POST /auth/login)                  │
└──────────────────────────────────────────────────────────────────┘
   Cliente envía → { email, password }
         ↓
   Archivo: src/controllers/auth.controller.js
         ↓
   • Buscar usuario en BD por email
   • Comparar password con bcrypt.compare()
   • Si es correcto → Generar JWT con:
     - Payload: { sub, userId, email }
     - Secret: process.env.JWT_SECRET
     - Expiración: 1 hora
         ↓
   Respuesta → { message: "Login exitoso", token: "eyJ...", user: {...} }
         ↓
   Cliente guarda el token (localStorage, cookies, etc.)

┌──────────────────────────────────────────────────────────────────┐
│ 3. ACCESO A RUTAS PROTEGIDAS (GET /tasks)                        │
└──────────────────────────────────────────────────────────────────┘
   Cliente envía → GET /tasks
   Header → Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         ↓
   Archivo: src/middlewares/authMiddleware.js
         ↓
   • Extraer token del header Authorization
   • Verificar token con jwt.verify(token, JWT_SECRET)
   • Si es válido → Adjuntar usuario al req.user
   • Si es inválido o expiró → 401 Unauthorized
         ↓
   Si pasa el middleware → Accede al controlador
         ↓
   Archivo: src/controllers/tasks.controller.js
         ↓
   • getTasks usa req.user.id para filtrar tareas del usuario
   • Solo devuelve las tareas que pertenecen a ese usuario
         ↓
   Respuesta → [{ id, title, description, userId, ... }]
```

### 📍 Dónde Está Configurado Rate Limiting

**Archivo:** `src/app.js` (líneas 78-112)

```javascript
// Rate Limiter para /auth (login, register)
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,  // 1 minuto
  max: 5,                    // Máximo 5 intentos por IP
  message: {
    error: "Demasiados intentos de autenticación. Por favor, intenta de nuevo en 1 minuto."
  }
});
app.use("/auth", authLimiter);

// Rate Limiter para /tasks (CRUD)
const tasksLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,  // 1 minuto
  max: 20,                   // Máximo 20 peticiones por IP
  message: {
    error: "Demasiadas peticiones a tareas. Por favor, intenta de nuevo en 1 minuto."
  }
});
app.use("/tasks", tasksLimiter);
```

**¿Qué hace?**
- Si alguien intenta login 6 veces en 1 minuto → Error 429 "Too Many Requests"
- Si alguien hace 21 peticiones a /tasks en 1 minuto → Error 429
- El límite se resetea automáticamente cada minuto

**¿Por qué es importante?**
- ❌ Previene ataques de fuerza bruta (probar miles de contraseñas)
- ❌ Protege contra abuso de la API
- ❌ Evita sobrecarga del servidor

### 📍 Dónde Está Configurado CORS

**Archivo:** `src/app.js` (líneas 43-55)

```javascript
const corsOptions = {
  origin: "http://localhost:5173",  // Solo este origen puede acceder
  credentials: true,                // Permite envío de cookies/JWT
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
```

**¿Qué hace?**
- Solo permite peticiones desde `http://localhost:5173` (tu frontend)
- Cualquier otro dominio será bloqueado por el navegador
- Habilita el envío de credenciales (tokens JWT, cookies)

**¿Por qué es importante?**
- ❌ Evita que sitios maliciosos accedan a tu API
- ❌ Previene robo de información mediante CSRF
- ✅ Solo tu frontend autorizado puede hacer peticiones

**En producción:**
Cambiar `origin` a la URL de tu frontend desplegado:
```javascript
origin: "https://mi-app-frontend.com"
```

### 📍 Sobre Passport.js

**Nota importante:** Este proyecto **NO utiliza Passport.js**. 

En su lugar, implementamos autenticación JWT manual con:
- **jsonwebtoken**: Para generar y verificar tokens
- **bcryptjs**: Para encriptar y comparar contraseñas  
- **authMiddleware personalizado**: Para proteger rutas

Esta implementación es más liviana, nos da control total sobre el flujo de autenticación, y es perfecta para APIs REST modernas. Passport.js es excelente, pero para este proyecto específico optamos por una solución más directa y minimalista.

---

## 🛠️ API Endpoints

### Base URL
```
http://localhost:3000
```

### Autenticación (No Protegidas)

#### 1. Registrar Usuario
```http
POST /auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

**Respuesta exitosa (201):**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": "1",
    "name": "Juan Pérez",
    "email": "juan@example.com"
  }
}
```

**Errores posibles:**
- 400: Campos faltantes
- 400: Email ya registrado

#### 2. Iniciar Sesión
```http
POST /auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Respuesta exitosa (200):**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwidXNlcklkIjoiMSIsImVtYWlsIjoianVhbkBleGFtcGxlLmNvbSIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDAzNjAwfQ.signature",
  "user": {
    "id": "1",
    "name": "Juan Pérez",
    "email": "juan@example.com"
  }
}
```

**Errores posibles:**
- 400: Campos faltantes
- 401: Credenciales incorrectas
- 429: Demasiados intentos (Rate Limit)

---

### Tareas (Protegidas - Requieren Token)

**⚠️ IMPORTANTE:** Todas las rutas de tareas requieren el header:
```http
Authorization: Bearer <tu_token_jwt>
```

#### 1. Obtener Todas las Tareas del Usuario
```http
GET /tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta exitosa (200):**
```json
[
  {
    "id": "1",
    "title": "Comprar leche",
    "description": "Leche descremada",
    "userId": "1",
    "createdAt": "2025-01-01T00:00:00.000Z"
  },
  {
    "id": "2",
    "title": "Hacer ejercicio",
    "description": "Gym a las 6am",
    "userId": "1",
    "createdAt": "2025-01-02T00:00:00.000Z"
  }
]
```

#### 2. Crear Nueva Tarea
```http
POST /tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Estudiar Node.js",
  "description": "Repasar Express y Prisma"
}
```

**Respuesta exitosa (201):**
```json
{
  "id": "3",
  "title": "Estudiar Node.js",
  "description": "Repasar Express y Prisma",
  "userId": "1",
  "createdAt": "2025-01-03T00:00:00.000Z"
}
```

#### 3. Actualizar Tarea
```http
PUT /tasks/:id
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Estudiar Node.js y React",
  "description": "Completar curso full stack"
}
```

**Respuesta exitosa (200):**
```json
{
  "id": "3",
  "title": "Estudiar Node.js y React",
  "description": "Completar curso full stack",
  "userId": "1",
  "updatedAt": "2025-01-04T00:00:00.000Z"
}
```

**Errores posibles:**
- 403: La tarea no pertenece al usuario autenticado

#### 4. Eliminar Tarea
```http
DELETE /tasks/:id
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta exitosa (200):**
```json
{
  "message": "Task deleted"
}
```

**Errores posibles:**
- 403: La tarea no pertenece al usuario autenticado

---

## 🧪 Pruebas con Insomnia/Postman

### Flujo completo de prueba:

#### 1. Registrar un usuario
```
POST http://localhost:3000/auth/register
Body: {
  "name": "Test User",
  "email": "test@example.com",
  "password": "1234"
}
```

#### 2. Hacer login
```
POST http://localhost:3000/auth/login
Body: {
  "email": "test@example.com",
  "password": "1234"
}
```

#### 3. Copiar el token de la respuesta
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 4. Crear una tarea
```
POST http://localhost:3000/tasks
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Body: {
  "title": "Mi primera tarea",
  "description": "Descripción"
}
```

#### 5. Obtener todas las tareas
```
GET http://localhost:3000/tasks
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 6. Probar Rate Limiting
Haz 6 peticiones de login seguidas (con credenciales incorrectas):
- Intentos 1-5: 401 Unauthorized
- Intento 6: 429 Too Many Requests

---

## 🔍 Códigos de Estado HTTP

| Código | Significado | Cuándo Aparece |
|--------|-------------|----------------|
| 200 | OK | Petición exitosa |
| 201 | Created | Recurso creado exitosamente |
| 400 | Bad Request | Datos faltantes o inválidos |
| 401 | Unauthorized | Token inválido, expirado o no enviado |
| 403 | Forbidden | Token válido pero sin permisos (tarea de otro usuario) |
| 429 | Too Many Requests | Se excedió el rate limit |
| 500 | Internal Server Error | Error del servidor |

---

## 🐛 Solución de Problemas Comunes

### Error: "Cannot connect to database"
**Solución:** 
1. Verifica que tu `DATABASE_URL` en `.env` sea correcta
2. Verifica que Supabase esté activo
3. Ejecuta `npx prisma db push` para sincronizar el schema

### Error: "JWT_SECRET is not defined"
**Solución:** 
1. Asegúrate de tener `JWT_SECRET` en tu archivo `.env`
2. Reinicia el servidor: `npm run dev`

### Error: "Cannot find module"
**Solución:** 
1. Ejecuta `npm install` para instalar todas las dependencias
2. Si persiste, elimina `node_modules` y `package-lock.json`
3. Vuelve a ejecutar `npm install`

### Error: 401 Unauthorized en rutas de tasks
**Solución:** 
1. Verifica que estés enviando el header: `Authorization: Bearer <token>`
2. Verifica que el token no haya expirado (expira en 1 hora)
3. Haz login de nuevo para obtener un token nuevo

### Error: 429 Too Many Requests
**Solución:** 
- Has excedido el límite de peticiones
- Espera 1 minuto y vuelve a intentar
- El límite se resetea automáticamente

### Error: "Prisma Client is unable to run in this browser environment"
**Solución:**
- Este error aparece si intentas ejecutar Prisma en el navegador
- Prisma solo funciona en Node.js (backend)
- Verifica que estés ejecutando el código desde Node.js

### El servidor no inicia
**Solución:**
1. Verifica que el puerto 3000 no esté ocupado:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   # Linux/Mac
   lsof -i :3000
   ```
2. Cambia el puerto en `.env`: `PORT=3001`
3. Revisa los logs de error en la consola

---

## 📚 Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Node.js | v18+ | Runtime de JavaScript |
| Express | v5.1.0 | Framework web |
| Prisma | v6.18.0 | ORM para PostgreSQL |
| PostgreSQL | - | Base de datos relacional |
| Supabase | - | PostgreSQL como servicio |
| jsonwebtoken | v9.0.2 | Generación y verificación de JWT |
| bcryptjs | v3.0.3 | Encriptación de contraseñas |
| cors | v2.8.5 | Configuración de CORS |
| express-rate-limit | v8.2.1 | Rate limiting |
| dotenv | v17.2.3 | Manejo de variables de entorno |

---

## 📖 Documentación Adicional

Para información más detallada sobre la implementación de seguridad:
- **[`docs/security-concepts.md`](./docs/security-concepts.md)** - Explicación profunda de JWT, CORS y Rate Limiting con analogías y ejemplos

---

## ✅ Checklist de Verificación Pre-Producción

Antes de desplegar, verifica:

- [ ] ✅ El archivo `.env` NO está en el repositorio
- [ ] ✅ `.env` está incluido en `.gitignore`
- [ ] ✅ Todas las variables de entorno están configuradas
- [ ] ✅ Las migraciones de Prisma se ejecutaron correctamente
- [ ] ✅ El servidor inicia sin errores en la consola
- [ ] ✅ Los endpoints de autenticación funcionan
- [ ] ✅ Los endpoints de tareas requieren token
- [ ] ✅ Rate limiting está activo en /auth y /tasks
- [ ] ✅ CORS está configurado para el dominio correcto
- [ ] ✅ Las contraseñas se almacenan encriptadas (bcrypt)
- [ ] ✅ Los tokens JWT expiran correctamente (1 hora)
- [ ] ✅ El authMiddleware protege las rutas correctamente
- [ ] ✅ Las tareas solo son accesibles por su dueño

---

## 👥 Contribuidores

- **Integrante A (Andrés)**: Implementación de autenticación, middleware y CRUD de tareas
- **Integrante B (Camilo)**: Configuración de seguridad (JWT, CORS, Rate Limiting) y documentación completa

---

## 📝 Licencia

Este proyecto es parte de un ejercicio académico.

---

## 🚀 Próximos Pasos / Mejoras Futuras

Ideas para expandir el proyecto:

- [ ] Implementar refresh tokens (tokens de renovación)
- [ ] Agregar sistema de roles (admin, user)
- [ ] Implementar paginación en las tareas
- [ ] Agregar filtros y búsqueda de tareas por título
- [ ] Implementar recuperación de contraseña por email
- [ ] Agregar tests automatizados (Jest, Supertest)
- [ ] Implementar logging con Winston
- [ ] Agregar documentación Swagger/OpenAPI
- [ ] Desplegar en producción (Railway, Render, Vercel)
- [ ] Implementar CI/CD con GitHub Actions

---

## 📞 Soporte

¿Tienes preguntas o encontraste un bug?

1. Revisa la documentación en `/docs`
2. Consulta la sección de "Solución de Problemas"
3. Abre un issue en GitHub: https://github.com/camiloconrado/API_REST_PAREJA/issues

---

**Desarrollado con ❤️ para el curso de Desarrollo de APIs REST**