import { requestPasswordReset } from "../controllers/passwordreset/getpassword_url.controller";
import express from "express";
import { resetPassword } from "../controllers/passwordreset/resetpassword_controller";

const router = express.Router();

router.post("/:type", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);

export default router;
