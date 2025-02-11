import { verifyJWT } from "../middlewares/auth.middlewares";
import {
  createVideoTagMapping,
  deleteVideoMapping,
  editVideoTagMapping,
  getAllVideoMappings,
  getVideoMapping,
} from "../controllers/videotag/videotagmapping_controller";
import { Router } from "express";

const router = Router();

router.use(verifyJWT);

router.get("/", getAllVideoMappings);
router.post("/", createVideoTagMapping);
router.put("/:id", editVideoTagMapping);
router.get("/:id", getVideoMapping);
router.delete("/:video_id/:video_tag_id", deleteVideoMapping);
export default router;
