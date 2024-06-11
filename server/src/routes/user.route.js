import { userController } from "#controllers";
import { isAuthenticated } from "#middlewares";
export const userRoutes = async (fastify) => {
  fastify.get("/my_channels", { preHandler: isAuthenticated }, userController.getMyChannels);
  fastify.get("/search", userController.search);
};
