import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { getContentDuration } from "../../utils/getcontentduration";

interface UserReport {
  id: number;
  createdAt: string;
  totalUniqueUsers: {
    id: number;
    name: string;
    dateOfBirth: string;
    data: {
      physical: number | null;
      emotional: number | null;
    };
  }[];
  totalUniqueViewingHistory: {
    contentId: number;
  }[];
  totalVideoDuration: number;
}

export const GetAllTrainingHistory = async (req: Request, res: Response) => {
  const currentUser: any = req.user;

  if (!currentUser.facilityId) {
    res.status(403).json({ error: "User does not have an associated facility" });
    return;
  }
  try {
    const trainingHistories = await prisma.trainingHistory.findMany({
      where: {
        deleted_at: null,
        physicalConditionForms: {
          some: {
            user: {
              facilityId: currentUser.facilityId,
            },
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
        const totalUniqueUsers = training.physicalConditionForms.map((form) => {
          let physical: number | null = null;
          let emotional: number | null = null;

          if (form.data && typeof form.data === "object" && !Array.isArray(form.data)) {
            physical = ((form.data as Record<string, unknown>)["physical"] as number | null) ?? null;
            emotional = ((form.data as Record<string, unknown>)["emotional"] as number | null) ?? null;
          }

          return {
            id: form.userId,
            name: form.user?.name || "Unknown",
            dateOfBirth: form.user?.dateOfBirth ? form.user.dateOfBirth.toISOString() : "Unknown",
            data: {
              physical,
              emotional,
            },
          };
        });

        const totalUniqueViewingHistory = training.viewingHistories.map((view) => ({
          contentId: view.contentId,
        }));

        const totalVideoDuration = await training.viewingHistories.reduce(async (totalPromise, view) => {
          const total = await totalPromise;
          const duration = await getContentDuration(view.contentId);
          return total + duration;
        }, Promise.resolve(0));

        return {
          id: training.id,
          createdAt: training.createdAt.toISOString(),
          totalUniqueUsers,
          totalUniqueViewingHistory,
          totalVideoDuration,
        };
      }),
    );

    const sortedReports = reports.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    res.status(200).json(sortedReports);
  } catch (error) {
    console.error("Error fetching TrainingHistory:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
