import { Router } from "express";
import { GirlModel } from "../models/Girl.js";
import { MenModel } from "../models/Men.js";
import { OtherModel } from "../models/Other.js";
const router = Router();



router.route('/').get(async (req, res) => {
    try {
      // Query the database for users (example)
      const girlsData = await GirlModel.find();
      const mansData = await MenModel.find(); 
      const otherData = await OtherModel.find();
      const responseData = {
        girls: girlsData,
        men: mansData,
        other: otherData,
      };
      res.status(200).json(responseData);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


export default router;