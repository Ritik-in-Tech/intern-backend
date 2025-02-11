import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const getAllVideos = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(403).json({ error: "Not authorized" });
  }

  // if (!user.role.includes("admin")) {
  //   return res.status(403).json({ error: "Access denied: Admin role required" });
  // }
  try {
    const videos = await prisma.video.findMany({
      where: {
        deleted_at: null,
      },
    });
    res.status(200).json(videos);
  } catch (error) {
    console.error("Error retrieving videos:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getVideoById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  if (!user) {
    return res.status(403).json({ error: "Not authorized" });
  }

  // if (!user.role.includes("admin")) {
  //   return res.status(403).json({ error: "Access denied: Admin role required" });
  // }
  try {
    const video = await prisma.video.findUnique({
      where: { id: Number(id), deleted_at: null },
    });
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.status(200).json(video);
  } catch (error) {
    console.error("Error retrieving video:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
