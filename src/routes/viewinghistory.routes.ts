import { createViewingHistory } from "../controllers/videohistory/create_viewinghistory_controller";
// import { getViewingHistoryById } from "../controllers/videohistory/get_viewinghistorybyid_controller";
// import { getAllViewingHistories } from "../controllers/videohistory/getall_controller";
import Router from "express";
import { verifyJWT } from "../middlewares/auth.middlewares";

const router = Router();

router.use(verifyJWT);

router.post("/:trainingHistoryId", createViewingHistory);
// router.get("/", getAllViewingHistories);

// router.get("/:id", getViewingHistoryById);

export default router;
