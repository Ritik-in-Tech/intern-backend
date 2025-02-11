import { createReport } from "../controllers/report/create_report.controller";

import Router from "express";
import { verifyJWT } from "../middlewares/auth.middlewares";

const router = Router();

router.use(verifyJWT);

router.post("/:trainingHistoryId", createReport);

export default router;
