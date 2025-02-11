import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const UpdateTrainingHistory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { physicalConditionFormIds, viewingHistoryIds } = req.body;

    if (!id) {
      return res.status(400).json({ error: "TrainingHistory ID must be provided" });
    }

    const updateData: any = {};

    if (physicalConditionFormIds?.length) {
      updateData.physicalConditionForms = {
        connect: physicalConditionFormIds.map((formId: number) => ({ id: formId })),
      };
    }

    if (viewingHistoryIds?.length) {
      updateData.viewingHistories = {
        connect: viewingHistoryIds.map((historyId: number) => ({ id: historyId })),
      };
    }

    const updatedTrainingHistory = await prisma.trainingHistory.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        physicalConditionForms: true,
        viewingHistories: true,
      },
    });

    res.status(200).json(updatedTrainingHistory);
  } catch (error) {
    console.error("Error updating TrainingHistory:", error);
    res.status(500).json({ error: "An error occurred while updating the TrainingHistory" });
  } finally {
    await prisma.$disconnect();
  }
};
