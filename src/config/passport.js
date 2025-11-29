import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import prisma from "../prismaClient.js";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

passport.use(
  new JwtStrategy(options, async (jwtPayload, done) => {
    try {
      // Buscar usuario
      const user = await prisma.user.findUnique({
        where: { id: BigInt(jwtPayload.userId) }
      });

      if (!user) {
        return done(null, false);
      }

      // Usuario encontrado → retornar datos útiles
      return done(null, {
        id: user.id.toString(),
        email: user.email,
        role: user.role
      });

    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;
