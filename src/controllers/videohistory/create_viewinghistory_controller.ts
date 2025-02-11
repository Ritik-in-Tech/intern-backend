import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const createViewingHistory = async (req: Request, res: Response) => {
  const user = req.user;
  // const currentUser: any = req.user;

  if (!user) {
    return res.status(403).json({ error: "Not authorized" });
  }

  if (user.role.includes("ADMIN")) {
    return res.status(403).json({ error: "Access denied: Admin is not supposed to submit Viewing History" });
  }

  try {
    const { contentId } = req.body;
    const { trainingHistoryId } = req.params;

    if (!contentId || !trainingHistoryId) {
      return res.status(400).json({ error: "ContentId and TrainingHistoryId are required" });
    }

    // Check if the video exists
    const video = await prisma.video.findUnique({
      where: { id: contentId, deleted_at: null },
    });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    // Check if the training history exists
    const trainingHistory = await prisma.trainingHistory.findUnique({
      where: { id: parseInt(trainingHistoryId), deleted_at: null },
    });

    if (!trainingHistory) {
      return res.status(404).json({ error: "Training history not found" });
    }

    const newViewingHistory = await prisma.viewingHistory.create({
      data: {
        contentId,
        trainingHistoryId: parseInt(trainingHistoryId),
      },
    });

    res.status(201).json(newViewingHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create viewing history", details: error });
  }
};
