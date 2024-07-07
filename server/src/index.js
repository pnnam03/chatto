import { APP } from "#configs";
import { authRoutes, channelRoutes, mediaRoutes, messageRoutes, userRoutes } from "#routes";
import { pinoLogger } from "#utils";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import fastifyIO from "fastify-socket.io";
import { fastify } from "./app.js";

fastify.register(fastifyIO, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});
fastify.register(cors, {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
});

fastify.register(multipart);

fastify.register(authRoutes, { prefix: "/api/v1/auth" });
fastify.register(channelRoutes, { prefix: "/api/v1/channels" });
fastify.register(userRoutes, { prefix: "/api/v1/users" });
fastify.register(messageRoutes, { prefix: "/api/v1" });
fastify.register(mediaRoutes, { prefix: "/api/v1/media" });

fastify.get("/health_check", (req, rep) => {
  rep.send({ status: "OK" });
});

fastify.listen({ port: APP.PORT }, (err, addr) => {
  if (err) {
    pinoLogger.error(err);
  }
});

fastify.ready().then(() => {
  let onlineUsers = {};

  fastify.io.on("connection", (socket) => {
    socket.on("add-online-user", async (data) => {
      onlineUsers[socket.id] = data.user;
    });

    socket.on("join-channel", (channel) => {
      console.log(`Socket ${socket.id} has joined channel ${channel.id}`);
      // console.log(channel);
      socket.join(channel.id);
    });

    socket.on("leave-channel", (channel) => {
      console.log(`Socket ${socket.id} has leaved channel ${channel.id}`);
      socket.leave(channel.id);
    });

    socket.on("msg-sent", async (data) => {
      console.log(data);
      socket.to(data.channelId).emit("msg-received", data);
    });

    socket.on("add-channel-member", (data) => {

    })

    socket.on("disconnect", async () => {
      // console.log(`Socket ${socket.id} has disconnected`);
    });
  });
});
