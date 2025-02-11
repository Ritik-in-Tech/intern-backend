import { getManagerById } from "../controllers/clients/manager/get_manager.controller";
import { createTrainer } from "../controllers/clients/trainer/create_trainer.controller";
import { updateTrainer } from "../controllers/clients/trainer/edit_trainer.controller";
import { getAllTrainer } from "../controllers/clients/trainer/getall_trainer.controller";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares";

const router = Router();
router.use(verifyJWT);
router.post("/", createTrainer);
router.get("/", getAllTrainer);
router.get("/:id", getManagerById); // this is same because there is no required of specifci role
router.put("/:id/edit", updateTrainer);

export default router;
