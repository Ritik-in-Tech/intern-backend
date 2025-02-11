import prisma from "../../utils/prisma";
import { Request, Response } from "express";

export const updateVideo = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { title, description, videoUrl, thumbnailUrl, duration } = req.body;
  try {
    const exisitingVideo = await prisma.video.findUnique({ where: { id: Number(id), deleted_at: null } });

    if (!exisitingVideo) {
      return res.status(404).json({ error: "Video not found" });
    }

    const updateData: any = {
      title: title ?? exisitingVideo.title,
      description: description ?? exisitingVideo.description,
      videoUrl: videoUrl ?? exisitingVideo.videoUrl,
      thumbnailUrl: thumbnailUrl ?? exisitingVideo.thumbnailUrl,
      duration: duration ?? exisitingVideo.duration,
      updatedAt: new Date(),
    };
    const updatedVideo = await prisma.video.update({
      where: { id: Number(id) },
      data: updateData,
    });

    res.status(200).json(updatedVideo);
  } catch (error) {
    console.error("Error updating video:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
