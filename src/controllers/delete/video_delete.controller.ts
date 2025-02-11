import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const deleteVideo = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(403).json({ error: "Not authorized" });
  }

  if (!user.role.includes("ADMIN")) {
    return res.status(403).json({ error: "Access denied: Admin role required" });
  }
  const videoId = parseInt(req.params.id);

  try {
    await prisma.$transaction(async (prisma) => {
      await prisma.video.update({
        where: { id: videoId },
        data: { deleted_at: new Date() },
      });

      await prisma.viewingHistory.updateMany({
        where: { contentId: videoId },
        data: { deleted_at: new Date() },
      });
    });

    res.status(200).json({ message: "Video and associated viewing histories marked as deleted." });
  } catch (error) {
    console.error("Error deleting video: ", error);
    res.status(500).json({ error: "An error occurred while deleting the video." });
  }
};
