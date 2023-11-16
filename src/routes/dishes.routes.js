const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const DishesController = require("../controllers/DishesController");
const DishesImagesController = require("../controllers/DishesImagesController");

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const ensureIsAdmin = require("../middlewares/ensureAuthenticatedAdmin");

const router = Router();
const upload = multer(uploadConfig.MULTER);

const dishesController = new DishesController();
const dishesImagesController = new DishesImagesController();


router.use(ensureAuthenticated);

router.post("/", upload.single("image"),dishesController.create);
router.get("/", dishesController.index);
router.get("/:id", dishesController.show);
router.delete("/:id", ensureIsAdmin, dishesController.delete);
router.put("/:id", ensureIsAdmin, upload.single("image"), dishesController.update);
router.patch("/images/:id", upload.single("image"), dishesImagesController.update);


module.exports = router;
