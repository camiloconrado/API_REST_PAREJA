import prisma from "../prismaClient.js";
import bcrypt from "bcryptjs";

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
