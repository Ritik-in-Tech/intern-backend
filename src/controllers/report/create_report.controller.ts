import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const createReport = async (req: Request, res: Response) => {
  const currentUser: any = req.user;
  if (!currentUser) {
    return res.status(403).json({ error: "Not authorized" });
  }
  if (currentUser.role === "MANAGER") {
    return res.status(403).json({ error: "Access denied: Manager is not supposed to create report" });
  }

  const { userId, data } = req.body;
  const { trainingHistoryId } = req.params;

  if (!userId || !data || !trainingHistoryId) {
    return res.status(400).json({ error: "UserId, data, and trainingHistoryId are required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId, deleted_at: null },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (currentUser.facilityId !== user.facilityId) {
      return res.status(401).json({ error: "No permission for this facility" });
    }

    const trainingHistory = await prisma.trainingHistory.findUnique({
      where: { id: parseInt(trainingHistoryId), deleted_at: null },
    });

    if (!trainingHistory) {
      return res.status(404).json({ error: "Training history not found" });
    }

    const newReport = await prisma.physicalConditionForm.create({
      data: {
        userId,
        data,
        trainingHistoryId: parseInt(trainingHistoryId),
      },
    });

    res.status(201).json(newReport);
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({ error: "Failed to create report", details: error });
  }
};
