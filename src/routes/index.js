const { Router } = require("express");

const usersRouter = require("./users.routes");

const routes = Router();

routes.use("/users", usersRouter); // toda vez que alguém for acessar o /users vai ser redirecionado para o usersRouter

module.exports = routes;