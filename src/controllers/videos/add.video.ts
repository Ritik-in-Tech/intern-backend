import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const createVideo = async (req: Request, res: Response) => {
  const { title, description, videoUrl, thumbnailUrl, adminId, fileKey, duration } = req.body;

  const user = req.user;

  if (!user) {
    return res.status(403).json({ error: "Not authorized" });
  }

  if (!user.role.includes("ADMIN")) {
    return res.status(403).json({ error: "Access denied: Admin role required" });
  }

  try {
    if (!title || !videoUrl || !description || !thumbnailUrl || !adminId || !fileKey) {
      return res
        .status(400)
        .json({ error: "Title, videoUrl, description,thumbnailUrl,  adminId and fileKey are required" });
    }

    const newVideo = await prisma.video.create({
      data: {
        title,
        videoUrl,
        description,
        thumbnailUrl,
        adminId,
        fileKey,
        duration: duration ?? null,
      },
    });
    res.status(201).json(newVideo);
  } catch (error) {
    console.error("Error creating video:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
