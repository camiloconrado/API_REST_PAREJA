import { Router } from "express";
import passport from "passport";
import prisma from "../prismaClient.js";
import { isAdmin } from "../middlewares/role.middleware.js";

const router = Router();

/**
 * Ruta protegida con:
 * 1. passport.authenticate("jwt") → Verifica token JWT
 * 2. isAdmin → Verifica rol desde req.user.role
 */
router.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true }
      });

      return res.json(
        users.map((u) => ({
          ...u,
          id: u.id.toString() // evitar error BigInt
        }))
      );
    } catch (error) {
      console.error("ERROR ADMIN USERS =>", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }
);

export default router;
