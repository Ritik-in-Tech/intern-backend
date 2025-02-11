import { verifyJWT } from "../middlewares/auth.middlewares";
import { createFacility } from "../controllers/facility/create.facility";
import { updateFacility } from "../controllers/facility/edit.facility";
import { getFacilityByCompanyId, getFacilityById } from "../controllers/facility/get.facility";
import { getAllFacilities } from "../controllers/facility/getall.facility";
import { Router } from "express";
import { deleteFacility } from "../controllers/delete/facility_delete.controller";

const router = Router();

router.use(verifyJWT);

router.post("/", createFacility);
router.get("/", getAllFacilities);
router.get("/:id", getFacilityById);
router.put("/:id/edit", updateFacility);
router.delete("/:id", deleteFacility);
router.get("/company/:companyId", getFacilityByCompanyId);

export default router;
