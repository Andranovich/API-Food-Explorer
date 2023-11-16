const knex = require("../database/knex");
const DiskStorage = require("../providers/DiskStorage");
const diskStorage = new DiskStorage();

class DishesController {
  async create(request, response) {
    const { title, description, category, price, ingredients, image } =
      request.body;
    const filename = request.file
      ? await diskStorage.saveFile(request.file?.filename)
      : "";
    console.log(request.body);

   
    const dish_id = await knex("dishes")
      .insert({
        image: filename ? filename : "",
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
    

    return response.status(201).json();
  }

  async update(request, response) {
    const { title, description, category, price } = request.body;
    const { id } = request.params;
    const filename = request.file
      ? await diskStorage.saveFile(request.file?.filename)
      : "";
    const ingredients = JSON.parse(request.body.ingredients);
    const data = await knex("dishes").where({ id }).first();

    const ingredientList = await knex("ingredients").where({ dish_id: id });

    const ingredientsToRemoved = ingredientList.filter((ingredient) => {
      return !ingredients.some((item) => item.id === ingredient.id);
    });

    console.log(request.body);

    const newIngredients = ingredients
      .filter((ingredient) => {
        return !ingredient.id;
      })
      .map((ingredient) => {
        return {
          name: ingredient.name,
          dish_id: id,
        };
      });

    await knex("ingredients")
      .whereIn(
        "id",
        ingredientsToRemoved.map((i) => i.id)
      )
      .del();

    if (newIngredients.length > 0) {
      const result = await knex("ingredients").insert(newIngredients);
    }

    if (filename) {
      data.image = filename;
    }
    data.title = title ?? data.title;
    data.description = description ?? data.description;
    data.category = category ?? data.category;
    data.price = price ?? data.price;

    await knex("dishes").where({ id }).update(data);

    

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
    const { id } = request.params;

    await knex("dishes").where({ id }).delete();

    return response.status(200).json();
  }

  async index(request, response) {
    // Capturing Query Parameters
    const { search } = request.query;
    let data = await knex("dishes");

    const ingredients = await knex("ingredients");

    data = data.map((item) => {
      return {
        ...item,
        ingredients: ingredients.filter(
          (ingredient) => ingredient.dish_id === item.id
        ),
      };
    });

    if (search) {
      data = data.filter((dish) => {
        console.log(dish);
        const title = dish.title.toLowerCase().includes(search.toLowerCase());
        const ingredients = dish.ingredients.find((item) => {
          return item.name.toLowerCase().includes(search.toLowerCase());
        });

        return title || ingredients;
      });
    }
    return response.status(200).json(data);
  }
}

module.exports = DishesController;
