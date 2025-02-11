import { Request, Response } from "express";
import prisma from "../../utils/prisma";

interface UserReport {
  trainingId: number;
  createdAt: string;
  data: {
    physical: number | null;
    emotional: number | null;
  }[];
  ViewingHistory: {
    contentId: number;
    thumbnailUrl: string;
    title: string;
  }[];
}

export const GetTrainingHistoryByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const trainingHistories = await prisma.trainingHistory.findMany({
      where: {
        deleted_at: null,
        physicalConditionForms: {
          some: {
            userId: parseInt(userId),
          },
        },
      },
      include: {
        physicalConditionForms: {
          include: {
            user: true,
          },
        },
        viewingHistories: true,
      },
    });

    const reports: UserReport[] = await Promise.all(
      trainingHistories.map(async (training) => {
        const data = training.physicalConditionForms
          .filter((form) => form.userId === parseInt(userId))
          .map((form) => {
            let physical: number | null = null;
            let emotional: number | null = null;

            if (form.data && typeof form.data === "object" && !Array.isArray(form.data)) {
              physical = ((form.data as Record<string, unknown>)["physical"] as number | null) ?? null;
              emotional = ((form.data as Record<string, unknown>)["emotional"] as number | null) ?? null;
            }

            return {
              physical,
              emotional,
            };
          });

        const ViewingHistory = await Promise.all(
          training.viewingHistories.map(async (view) => {
            const video = await prisma.video.findUnique({
              where: {
                id: view.contentId,
              },
              select: {
                thumbnailUrl: true,
                title: true,
              },
            });

            return {
              contentId: view.contentId,
              thumbnailUrl: video?.thumbnailUrl || "No thumbnail available",
              title: video?.title || "No title available",
            };
          }),
        );

        return {
          trainingId: training.id,
          createdAt: training.createdAt.toISOString(),
          data,
          ViewingHistory,
        };
      }),
    );
    const sortedReports = reports.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const last20Reports = sortedReports.slice(0, 20);

    res.status(200).json(last20Reports);
  } catch (error) {
    console.error("Error fetching TrainingHistory:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
