import { authController } from "#controllers";
import { isAuthenticated } from "#middlewares";
export const authRoutes = async (fastify) => {
  fastify.post("/sign_in", authController.signIn);
  fastify.post("/sign_up", authController.signUp);
  fastify.post("/change_password", { preHandler: isAuthenticated }, authController.changePassword);
  fastify.post("/verify_email", { preHandler: isAuthenticated }, authController.verifyEmail);
};
