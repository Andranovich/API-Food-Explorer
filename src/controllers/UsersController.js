const AppError = require("../utils/App.Error.js");


//uma class permite criar várias funções dentro
/*  MÈTODOS
 * index - GET para listar vários registros.
 * show - GET para exibir um registro específico.
 * create - POST para criar um registro.
 * update - PUT para atualizar um registro.
 * delete - DELETE para remover um registro.
 */
class UserController {
  create(request, response) {
    const { name, email, password } = request.body;

    if(!name) {
        throw new AppError("Nome é obrigatório");
    }

    response.status(201 ).json({ name, email, password });
  }
}

module.exports = UserController;
