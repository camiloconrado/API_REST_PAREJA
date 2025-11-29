//archivo auth.controller.js
import prisma from "../prismaClient.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // ← NUEVO: Importar JWT

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validación de campos
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Normalizar y limpiar datos
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Verificar si ya existe usuario
    const userExists = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (userExists) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(cleanPassword, 10);

    // Crear usuario
    const newUser = await prisma.user.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    // Convertir BigInt → String
    newUser.id = newUser.id.toString();

    return res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: newUser
    });

  } catch (error) {
    console.error("ERROR in registerUser =>", error);
    return res.status(500).json({ message: "Error registrando usuario" });
  }
};

// ========== NUEVA FUNCIÓN DE LOGIN (COMMIT 6) ==========
export const loginUser = async (req, res) => {
  try {
    // PASO 1: Recibir email y password del cliente
    const { email, password } = req.body;

    // Validar que lleguen los datos
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email y contraseña son requeridos" 
      });
    }

    // Limpiar y normalizar el email
    const cleanEmail = email.trim().toLowerCase();

    // PASO 2: Buscar usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    // Si no existe el usuario
    if (!user) {
      return res.status(401).json({ 
        message: "Credenciales incorrectas" 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: "Credenciales incorrectas" 
      });
    }

    const token = jwt.sign(
      {
        sub: user.id.toString(),        // Subject (estándar JWT)
        userId: user.id.toString(),     // ID del usuario
        email: user.email,
        role: user.role               // Email del usuario
      },
      process.env.JWT_SECRET,           // Clave secreta desde .env
      {
        expiresIn: "1h"                 // Token válido por 1 hora
      }
    );

    return res.status(200).json({
      message: "Login exitoso",
      token: token,
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        role: user.role 
      }
    });

  } catch (error) {
    console.error("ERROR in loginUser =>", error);
    return res.status(500).json({ 
      message: "Error en el servidor" 
    });
  }
};