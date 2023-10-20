const knex = require('../database/knex');
const AppError = require('../utils/App.Error');
const DiskStorage = require('../providers/DiskStorage');

class DishesImagesController {
    async update(request, response) {
        console.log(request.params)
        const dish_id = request.params.id;
        const dishesImage = request.file.filename;

        const diskStorage = new DiskStorage

        const dish = await knex("dishes")
        .where({id:dish_id}).first();

        if(!dish) {
            throw new AppError("Refeição não encontrada.")
        }

        if (dish.image) {
            await diskStorage.deleteFile(dish.image);
        }

        const filename = await diskStorage.saveFile(dishesImage);
        dish.image = filename;
        

        await knex("dishes").update(dish).where({id: dish_id});

        return response.json(dish);
    } 
}

module.exports = DishesImagesController;