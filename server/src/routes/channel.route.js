import { channelController, messageController } from "#controllers";
import { isAuthenticated } from "#middlewares";
export const channelRoutes = async (fastify) => {
  fastify.post("/", { preHandler: isAuthenticated }, channelController.create);
  // fastify.get("/", {preHandler: isAuthenticated}, channelController.getList);
  fastify.get("/:channelId", { preHandler: isAuthenticated }, channelController.getInfo);
  fastify.put("/:channelId", { preHandler: isAuthenticated }, channelController.update);
  fastify.post("/:channelId/add_members", {preHandler: isAuthenticated}, channelController.addMembers)
  fastify.post("/:channelId/messages", {preHandler: isAuthenticated}, messageController.create);
  fastify.get("/:channelId/messages", {preHandler: isAuthenticated}, messageController.getList);
  fastify.put("/:channelId/messages/:messageId", {preHandler: isAuthenticated}, messageController.update);
};
