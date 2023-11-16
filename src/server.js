require("dotenv/config");
require("express-async-errors");

const migrationsRun = require("./database/sqlite/migrations");
const express = require("express");
const AppError = require("./utils/App.Error");
const routes = require("./Routes");
const cors = require("cors");
const app = express();
const uploadConfig = require("./configs/upload");

app.use(cors());
app.use(express.json()); 

app.use(routes);
app.use("/image", express.static(uploadConfig.UPLOADS_FOLDER));

migrationsRun();

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  console.error(error);

  return response.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
