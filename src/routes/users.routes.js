const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const UsersController = require("../controllers/UsersController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const usersRoutes = Router();
const upload = multer(uploadConfig.MULTER);

const usersController = new UsersController();

usersRoutes.post("/", usersController.create);
usersRoutes.post("/login", usersController.login);
usersRoutes.put("/", ensureAuthenticated, usersController.update);


module.exports = usersRoutes; // exporta a rota para o server.js poder usar
