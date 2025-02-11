import { createAdmin } from "../controllers/admin/register.admin";
import express, { Request, Response } from "express";
import { loginAdmin } from "../controllers/admin/login.admin";
import { verifyJWT } from "../middlewares/auth.middlewares";
import { getAdmin } from "../controllers/admin/get.admin";
import { deleteAdmin } from "../controllers/delete/admin_delete.controller";

const router = express.Router();
router.post("/", createAdmin);
router.post("/login", loginAdmin);
router.use(verifyJWT);
router.get("/", getAdmin);
router.delete("/:id", deleteAdmin);

export default router;
