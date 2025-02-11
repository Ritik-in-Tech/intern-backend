import {
  createTag,
  deleteTag,
  editTag,
  getAllTags,
  getTag,
  getTagByName,
} from "../controllers/videotag/videotag_controller";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares";

const router = Router();

router.use(verifyJWT);

router.get("/", getAllTags);
router.post("/", createTag);
router.put("/:id", editTag);
router.get("/:id", getTag);
router.delete("/:id", deleteTag);
router.get("/:name", getTagByName);
export default router;
