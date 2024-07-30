import { Router } from "express";

const router = Router();

import { Clothing,clothingById } from "../controllers/ClothingController.js";

router.route("/").get(Clothing)
router.route("/:id").get(clothingById)

export default router;