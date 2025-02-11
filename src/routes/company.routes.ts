import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares";
import { createCompany } from "../controllers/company/create.controller";
import { getACompany, getCompanies } from "../controllers/company/get.controller";
import { editCompany } from "../controllers/company/edit.controller";
import { deleteCompany } from "../controllers/delete/company_delete.controller";

const router = Router();

router.use(verifyJWT);

router.post("/", createCompany);
router.get("/", getCompanies);
router.get("/:id", getACompany);
router.put("/:id/edit", editCompany);
router.delete("/:id", deleteCompany);
export default router;
