import { messageController } from "#controllers";
import { isAuthenticated } from "#middlewares";
export const messageRoutes = async (fastify) => {
  fastify.post("/:channelId/messages", { preHandler: isAuthenticated }, messageController.create);
  fastify.get("/:channelId/messages", { preHandler: isAuthenticated }, messageController.getList);
  fastify.put("/:channelId/messages", { preHandler: isAuthenticated }, messageController.update);
};
