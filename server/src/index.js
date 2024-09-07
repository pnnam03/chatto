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
  const users = {};

  fastify.io.on("connection", (socket) => {
    socket.on("add-online-user", async (data) => {
      onlineUsers[socket.id] = data.user;
    });

    socket.on("join-channel", (channel) => {
      console.log(`Socket ${socket.id} has joined channel ${channel.id}`);
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

    socket.on("add-channel-member", (data) => {});

    socket.on("disconnect", async () => {
      console.log(`Socket ${socket.id} has disconnected`);
    });

    socket.on("join-call", async ({ userId, channelId }) => {
      console.log(`User ${userId} has joined channel ${channelId}`);
      const sockets = await fastify.io.in(channelId).fetchSockets();
      console.log(
        sockets.map((s) => {
          return s.id;
        }),
      );
      socket.join(channelId);
      socket.to(channelId).emit("user-joined", { userId, channelId });
      socket.emit("list-of-users", {
        users: sockets.map((s) => {
          return s.id;
        }),
      });
    });

    socket.on("leave-call", ({ userId, channelId }) => {
      console.log(`User ${userId} has left channel ${channelId}`);
      socket.to(channelId).emit("user-left", { userId, channelId });
    });

    socket.on("signal", ({ from, to, signal }) => {
      socket.to(to).emit("signal", { from, to, signal });
    });

    socket.on("initiator-signal", ({ initiator, receiver, channelId, signal }) => {
      console.log("initiator-signal", { initiator, receiver, channelId });
      socket.to(receiver).emit("initiator-signal", { initiator, receiver, channelId, signal });
    });

    socket.on("receiver-signal", ({ initiator, receiver, channelId, signal }) => {
      socket.to(initiator).emit("receiver-signal", { initiator, receiver, signal });
    });
    // socket.
  });
});
