Documentación 

1.	¿Qué es rate-limit?
Es un limitador de peticiones que puede hacer el usuario o una IP a la API, en un tiempo determinado y sirve para evitar peticiones masivas que lo puede hacer un bot y puede llegar a tumbar el servidor, también ayuda a mejorar la estabilidad y disponibilidad el servicio.

2.	¿Qué es CORS?
es un mecanismo de seguridad que permite peticiones https legitimas de diferentes orígenes, es decir mantiene la seguridad del navegador mientras se habilita la comunicación del Frontend y el backend de diferentes dominios, CORS es como una tarjeta de permisos donde puedo indicar que dominios autorizo para que se comuniquen con mi dominio y cuales no, para evitar ataques desde sitios maliciosos.

3.	 ¿Qué es JWT?
es como un ticket digital que permite una autenticación más ágil a la hora que el usuario ingresa, anteriormente cada requerimiento que se hacia todo se consultaba en una base de datos saturando la memoria, ahora con el JWT solo se verifica la firma digital y no hace consulta en la BD, por lo tanto, es más rápido.

	¿ qué es un token?
Es un código especial que sirve para iniciar sesión sin necesidad de ingresar contraseña

	¿ qué lleva dentro?
Un token (específicamente JWT) lleva 3 cosas:
	Información sobre cómo está hecho (Header)
	Información del usuario (Payload)
	Una firma de seguridad (Signature)

	¿ para qué se usa?
Uso principal: Autenticación y Autorización
1.	Login (primera vez):
Tú → Envías: usuario y contraseña
Servidor → Verifica que son correctos
Servidor → Te da un TOKEN
Tú → Guardas el token

2.	Peticiones posteriores:
Tú → "Quiero ver mi perfil" + TOKEN
Servidor → "Déjame verificar tu token..."
Servidor → "OK, tu token es válido, aquí está tu perfil"

•	Ejemplo práctico JWT:
JWT es un token de seguridad que nos permite ingresar una vez ya sea en la página web y/o Aplicación móvil.
Un ejemplo real donde se aplica seria tu aplicación bancaria quien te permite realizar transacciones iniciando sesión una única vez, después de cierto tiempo se cierra automáticamente por inactivad y nuevamente inicias sesión, mientras esta activa te permite hacer uso de ella como recargas de trasporte público, pagos, trasferencias.

•	Ejemplo práctico CORS:
CORS es un autorizador que permite la conexión con sitios externos o de distinto dominio 
Un ejemplo claro es cuando estas en una página o aplicación móvil de compras, al momento de que vas a realizar el pago la página te redirige a la plataforma de pago, sea PSE, la app de tu banco, si la página de origen tiene las plataformas de pago configuradas en su CORS el pago se efectuará correctamente, si no es así, la misma bloquear el pago ya que este no está autorizado para conectarse entre sí.

•	Ejemplo práctico de RATE-LIMIT
RATE-LIMIT es un limitador de intentos que te permite acceder a una página ya sea del banco, de tu correo y redes sociales
Un ejemplo claro seria las aplicaciones bancarias que te permiten un máximo de 3 intentos para acceder a tus cuentas bancarias esto se implementa para cuidar tu dinero, funciona igual en tus redes sociales y correos evitando que terceros tengan más oportunidades de descifrar tus claves y perder tu dinero o información personal


Cómo implementamos JWT en este proyecto
¿Qué es JWT?
JSON Web Token (JWT) es un estándar para transmitir información de forma segura entre el cliente y el servidor. Es como un "pase digital" que identifica al usuario sin necesidad de verificar sus credenciales en cada petición.
Flujo de Autenticación
1.	Registro de Usuario
Cliente → POST /auth/register
         { name, email, password }
                ↓
         Validar datos
                ↓
         Encriptar password con bcrypt
                ↓
         Guardar en Base de Datos
                ↓
Cliente ← Usuario creado
2.	 Login y Generación de JWT
Cliente → POST /auth/login
         { email, password }
                ↓
         Buscar usuario en BD
                ↓
         Comparar password con bcrypt.compare()
                ↓
         Si es correcto → Generar JWT
                ↓
Cliente ← Token JWT + Datos del usuario


3.	Uso del Token (Futuro)
Cliente → Petición a ruta protegida
         Header: Authorization: Bearer <token>
                ↓
         Middleware verifica el token
                ↓
         Si es válido → Permite acceso
                ↓
Cliente ← Respuesta
	Estructura del JWT
Payload (información que contiene nuestro token):
{
  "sub": "1",                    // Subject: ID del usuario
  "userId": "1",                 // ID del usuario (explícito)
  "email": "usuario@example.com",
  "iat": 1700000000,            // Issued At: cuándo se creó
  "exp": 1700003600             // Expiration: cuándo expira (1 hora)
}
Configuración de Seguridad
Variables de Entorno
JWT_SECRET=clave_secreta_super_segura_12345

⚠️ Importante:
- Esta clave NUNCA se sube a GitHub
- Debe ser diferente en desarrollo y producción
- Genera una clave aleatoria segura



Parámetros de Seguridad
- **Algoritmo:** HS256 (HMAC con SHA-256)
- **Tiempo de expiración:** 1 hora
- **Factor de costo bcrypt:** 10 rondas
Implementación Técnica
Encriptación de Contraseñas
// Al registrar usuario
const hashedPassword = await bcrypt.hash(password, 10);

// Al hacer login
const isValid = await bcrypt.compare(password, hashedPassword);
Generación del Token
```javascript
const token = jwt.sign(
  { 
    sub: user.id.toString(),
    userId: user.id.toString(),
    email: user.email 
  },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);
Verificación del Token (Middleware futuro)
jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
  if (err) {
    // Token inválido o expirado
  } else {	
	

    // Token válido
  }
});
Buenas Prácticas Implementadas
✅ **Contraseñas encriptadas** - Usamos bcrypt con 10 rondas  
✅ **JWT_SECRET en .env** - No está en el código fuente  
✅ **Tokens con expiración** - Expiran en 1 hora  
✅ **No devolver passwords** - Solo enviamos datos seguros  
✅ **Mensajes genéricos** - "Credenciales incorrectas" (no especificamos qué está mal)  
✅ **Validación de datos** - Verificamos campos requeridos  
✅ **Normalización** - Limpiamos y normalizamos emails  

Rutas de Autenticación
| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|---------------|
| POST | `/auth/register` | Registrar usuario | No |
| POST | `/auth/login` | Iniciar sesión | No |

Ejemplos de Uso
Registrar un usuario
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "MiPassword123"
}
Hacer login
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "MiPassword123"
}
Respuesta exitosa:
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "name": "Juan Pérez",
    "email": "juan@example.com"
  }
}
CORS (Cross-Origin Resource Sharing)

¿Qué es CORS?

CORS es un mecanismo de seguridad que controla qué dominios (orígenes) pueden acceder a nuestra API desde un navegador web.

Sin CORS, el navegador bloquea automáticamente las peticiones entre diferentes dominios por seguridad (política Same-Origin)

Con CORS configurado, le dices al servidor "Solo deja entrar peticiones desde http://localhost:5173".

¿Por qué lo implementamos?

•	Problema sin CORS:
Frontend (localhost:5173) → API (localhost:3000)
❌ BLOQUEADO por el navegador
•	Solución con CORS:
Frontend (localhost:5173) → API (localhost:3000)
✅ PERMITIDO porque está en la lista

•	Nuestra configuración
const corsOptions = {
origin: "http://localhost:5173",  // Solo este dominio puede acceder
credentials: true,                // Permite envío de cookies y JWT
optionsSuccessStatus: 200
};

•	¿Por qué permitimos solo http://localhost:5173?

Seguridad: Evita que sitios maliciosos accedan a nuestra API
Control: Solo nuestro frontend autorizado puede hacer peticiones
Producción: En producción cambiaremos a la URL real del frontend desplegado

Ejemplo real: Si un hacker crea un sitio http://sitio-malicioso.com e intenta acceder a nuestra API, el navegador lo bloqueará porque no está en nuestra lista de orígenes permitidos.

Rate Limiting

¿Qué es Rate Limiting?

Rate Limiting limita cuántas peticiones puede hacer un cliente (identificado por IP) en un período de tiempo.

¿Por qué lo implementamos?
1.	Prevenir ataques de fuerza bruta
Un atacante intenta miles de contraseñas para entrar a una cuenta:
	Sin Rate Limiting:
Atacante intenta:
- password1 ❌
- password2 ❌
- password3 ❌
... 10,000 intentos más en 1 minuto ❌
- password10000 ✅ ¡Entró!

	Con Rate Limiting (5 intentos/minuto):
Atacante intenta:
- password1 ❌
- password2 ❌
- password3 ❌
- password4 ❌
- password5 ❌
- password6 🚫 BLOQUEADO: "Demasiados intentos, espera 1 minuto"

2.	Proteger el servidor de sobrecarga
Evita que alguien (malicioso o no) haga miles de peticiones y tumbe el servidor.
3.	Ahorrar recursos
Menos peticiones = menos uso de CPU, memoria y base de datos.
Nuestra configuración
Rate Limiter para /auth (Login/Register)
javascriptconst authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,  // 1 minuto
  max: 5,                    // Máximo 5 intentos
  message: "Demasiados intentos de autenticación"
});

¿Por qué 5 intentos?

Es suficiente para un usuario legítimo que olvidó su contraseña
Es muy restrictivo para un atacante automatizado
Similar a los sistemas bancarios

Escenario real:

Usuario intenta login con contraseña incorrecta: Intento 1/5 ❌
Vuelve a intentar: Intento 2/5 ❌
Vuelve a intentar: Intento 3/5 ❌
Vuelve a intentar: Intento 4/5 ❌
Vuelve a intentar: Intento 5/5 ❌
Sexto intento: 🚫 Error 429 "Demasiados intentos, espera 1 minuto"

Rate Limiter para /tasks (CRUD de Tareas)
javascriptconst tasksLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,  // 1 minuto
  max: 20,                   // Máximo 20 peticiones
  message: "Demasiadas peticiones a tareas"
});

¿Por qué 20 intentos?

Es más permisivo porque son operaciones normales de uso
Un usuario legítimo podría crear/editar varias tareas seguidas
Aún protege contra abuso (alguien creando 1000 tareas/minuto)

Códigos de estado HTTP relacionados

200 OK: Petición exitosa
401 Unauthorized: Token inválido o no enviado
429 Too Many Requests: Se excedió el límite de peticiones

Headers de Rate Limit
Cuando haces una petición, el servidor devuelve headers con información:
RateLimit-Limit: 5          → Límite total
RateLimit-Remaining: 3      → Peticiones restantes
RateLimit-Reset: 1638360000 → Timestamp cuando se resetea

Ejemplo de flujo completo con todas las seguridades
1. Usuario abre el frontend (localhost:5173)
   ↓
2. Frontend hace petición a API (localhost:3000)
   ↓
3. CORS verifica: ¿Es localhost:5173? ✅ Sí → Continúa
   ↓
4. Rate Limiter verifica: ¿Ha hecho menos de 5 peticiones? ✅ Sí → Continúa
   ↓
5. Usuario envía { email, password }
   ↓
6. bcrypt compara contraseñas ✅ Correcta
   ↓
7. Se genera JWT firmado
   ↓
8. Frontend recibe token y lo guarda
   ↓
9. Usuario quiere ver sus tareas → Envía token
   ↓
10. authMiddleware verifica JWT ✅ Válido
   ↓
11. Usuario recibe sus tareas ✅

Configuración para diferentes ambientes
Desarrollo (local)
origin: "http://localhost:5173"
max: 5 intentos/minuto (auth)

Producción (desplegado)
origin: "https://mi-app-frontend.com"
max: 3 intentos/minuto (auth) // Más restrictivo

Recursos Útiles
[JWT.io](https://jwt.io) - Decodificar tokens
[jsonwebtoken npm](https://www.npmjs.com/package/jsonwebtoken)
[bcryptjs npm](https://www.npmjs.com/package/bcryptjs)
CORS MDN
express-rate-limit npm
OWASP Rate Limiting
