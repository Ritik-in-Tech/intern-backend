import express from "express";
import { verifyJWT } from "../middlewares/auth.middlewares";
import { CreateTrainingHistory } from "../controllers/traininghistory/create_controller";
import { GetAllTrainingHistory } from "../controllers/traininghistory/getAll_controller";
import { UpdateTrainingHistory } from "../controllers/traininghistory/edit_controller";
import { GetTrainingHistoryByUserId } from "../controllers/traininghistory/get.controller";

const router = express.Router();

router.use(verifyJWT);

router.post("/", CreateTrainingHistory);
router.get("/", GetAllTrainingHistory);
router.put("/:id", UpdateTrainingHistory);
router.get("/:userId", GetTrainingHistoryByUserId);
export default router;
