import { addUser } from "../controllers/users/adduser.controller";
import { editUser } from "../controllers/users/edituser.controller";
import { getAllUsers } from "../controllers/users/getallusers.controller";
import { getAUser } from "../controllers/users/getuser.controller";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares";
import { deleteUser } from "../controllers/delete/user_delete.controller";
import multer from "multer";
import { uploadUsers } from "../controllers/users/adduser_csv.controller";

const upload = multer({ dest: "uploads/" });

const router = Router();

router.use(verifyJWT);
router.post("/", addUser);
router.get("/", getAllUsers);
router.put("/:id/edit", editUser);
router.get("/:id", getAUser);
router.delete("/:id", deleteUser);
router.post("/user-csv", upload.single("file"), uploadUsers);

export default router;
