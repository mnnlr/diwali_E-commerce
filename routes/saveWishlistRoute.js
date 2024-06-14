import { Router } from "express";
const router = Router();


import { savewishlist }from "../controller/savewishlistController.js";

router.route('/').put(savewishlist);
router.route('/').get(savewishlist);

export default router;  