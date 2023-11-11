const knex = require("../database/knex");
const AppError = require("../utils/App.Error");
const DiskStorage = require("../providers/DiskStorage");
const diskStorage = new DiskStorage();

class DishesController {
  async create(request, response) {
    const { 
      title, 
      description, 
      category, 
      price, 
      ingredients, 
      image } =
      request.body;
    const filename = request.file? await diskStorage.saveFile(request.file?.filename) : "" ;
    console.log(request.body);

    // const checkDishAlreadyExists = await knex("dishes")
    //   .where({ title })
    //   .first();

    // if (checkDishAlreadyExists) {
    //   throw new AppError("O prato já existe.");
    // }

    // const imageFileName = request.file.filename;
    // const diskStorage = new DiskStorage();
    // const filename = await diskStorage.saveFile(imageFileName);
    const dish_id = await knex("dishes")
      .insert({
        image:  filename ? filename: "",
        title,
        description,
        price,
        category,
      })
      .returning("id");

    console.log(dish_id[0].id);
    const ingredientsData = JSON.parse(ingredients).map((ingredient) => {
      return {
        name: ingredient,
        dish_id: dish_id[0].id,
      };
    });

    const result = await knex("ingredients").insert(ingredientsData);
    // const hasOnlyOneIngredient = typeof ingredients === "string";

    // let ingredientsInsert;

    // if (hasOnlyOneIngredient) {
    //   ingredientsInsert = {
    //     name: ingredients,
    //     dish_id,
    //   };
    // } else if (ingredients.length > 1) {
    //   ingredientsInsert = ingredients.map((name) => {
    //     return {
    //       name,
    //       dish_id,
    //     };
    //   });
    // }

    // await knex("ingredients").insert(ingredientsInsert);

    return response.status(201).json();
  }

  async update(request, response) {
    const { title, description, category, price } = request.body;
    const { id } = request.params;

    const data = await knex("dishes").where({ id }).first();

    data.title = title ?? data.title;
    data.description = description ?? data.description;
    data.category = category ?? data.category;
    data.price = price ?? data.price;

    await knex("dishes").where({ id }).update(data);

    // let ingredientsInsert;

    // if (hasOnlyOneIngredient) {
    //   ingredientsInsert = {
    //     name: ingredients,
    //     dish_id: dish.id,
    //   };
    // } else if (ingredients.length > 1) {
    //   ingredientsInsert = ingredients.map((ingredient) => {
    //     return {
    //       dish_id: dish.id,
    //       name: ingredient,
    //     };
    //   });
    // }

    // await knex("ingredients").where({ dish_id: id }).delete();
    // await knex("ingredients").where({ dish_id: id }).insert(ingredientsInsert);

    return response.status(201).json("Prato atualizado com sucesso");
  }

  async show(request, response) {
    // Capturing ID Parameters
    const { id } = request.params;

    // Getting the dish and ingredients data through the informed ID
    const dish = await knex("dishes").where({ id }).first();
    const ingredients = await knex("ingredients");
    dish.ingredients = ingredients.filter(
      (ingredient) => ingredient.dish_id === dish.id
    );

    return response.status(201).json(dish);
  }

  async delete(request, response) {
    // Capturing ID Parameters
    const { id } = request.params;

    // Deleting dish through the informed ID
    await knex("dishes").where({ id }).delete();

    return response.status(200).json();
  }

  async index(request, response) {
    // Capturing Query Parameters
    const { category } = request.query;
    const data = await knex("dishes");
    const ingredients = await knex("ingredients");
    if (category) {
      const dishesData = data
        .filter((item) => {
          return item.category === category;
        })
        .map((item) => {
          return {
            ...item,
            ingredients: ingredients.filter(
              (ingredient) => ingredient.dish_id === item.id
            ),
          };
        });
      return response.status(200).json(dishesData);
    }

    const dishesData = data.map((item) => {
      return {
        ...item,
        ingredients: ingredients.filter(
          (ingredient) => ingredient.dish_id === item.id
        ),
      };
    });
    return response.status(200).json(dishesData);
  }
}

module.exports = DishesController;
