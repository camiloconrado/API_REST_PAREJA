import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Formato: Bearer token
    const token = header.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adjuntar información del usuario al request
    req.user = {
      id: decoded.userId,
      email: decoded.email
    };

    next();

  } catch (error) {
    console.error("JWT ERROR =>", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
