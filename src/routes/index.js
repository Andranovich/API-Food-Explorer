const { Router } = require("express");
const usersRouter = require("./users.routes");
const dishes = require("./dishes.routes");
const sessionsRouter = require("./sessions.routes");

const routes = Router();

routes.use("/dishes", dishes);
routes.use("/sessions", sessionsRouter);
routes.use("/users", usersRouter); // toda vez que alguém for acessar o /users vai ser redirecionado para o usersRouter

module.exports = routes;
