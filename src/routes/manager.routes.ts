import { createManager } from "../controllers/clients/manager/create_manager.controller";
import { updateManager } from "../controllers/clients/manager/edit_manager.controller";
import { getManagerByFacilityId, getManagerById } from "../controllers/clients/manager/get_manager.controller";
import { getAllManger } from "../controllers/clients/manager/getall_manager.controller";
import { Router } from "express";
import { login } from "../controllers/clients/login.controller";
import { verifyJWT } from "../middlewares/auth.middlewares";
import { deleteClient } from "../controllers/delete/client_delete.controller";

const router = Router();
router.post("/login", login);
router.use(verifyJWT);
router.post("/", createManager);
router.get("/", getAllManger);
router.get("/:id", getManagerById);
router.put("/:id/edit", updateManager);
router.delete("/:id", deleteClient);
router.get("/facility/:facilityId", getManagerByFacilityId);
export default router;
