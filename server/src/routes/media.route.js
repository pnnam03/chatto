import { mediaController } from "#controllers";
import { isAuthenticated } from "#middlewares";
export const mediaRoutes = async (fastify, options) => {
  fastify.post("/", {preHandler: isAuthenticated}, mediaController.upload);
  fastify.get("/:id",  mediaController.get);
}