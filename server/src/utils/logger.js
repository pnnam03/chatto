import pino from "pino";

export const pinoLogger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "HH:MM:ss Z",
      ignore: "pid,hostname",
    },
  },
  serializers: {
    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
    req(req) {
      return {
        method: req.method,
        url: req.url,
        headers: req.headers,
      };
    },
  },
});
