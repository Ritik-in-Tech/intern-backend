import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const CreateTrainingHistory = async (req: Request, res: Response) => {
  try {
    const { physicalConditionFormIds, viewingHistoryIds } = req.body;

    const trainingHistoryData: any = {};

    if (physicalConditionFormIds?.length) {
      trainingHistoryData.physicalConditionForms = {
        connect: physicalConditionFormIds.map((id: number) => ({ id })),
      };
    }

    if (viewingHistoryIds?.length) {
      trainingHistoryData.viewingHistories = {
        connect: viewingHistoryIds.map((id: number) => ({ id })),
      };
    }

    const trainingHistory = await prisma.trainingHistory.create({
      data: trainingHistoryData,
      include: {
        physicalConditionForms: true,
        viewingHistories: true,
      },
    });

    res.status(201).json(trainingHistory);
  } catch (error) {
    console.error("Error creating TrainingHistory:", error);
    res.status(500).json({ error: "An error occurred while creating the TrainingHistory" });
  } finally {
    await prisma.$disconnect();
  }
};
