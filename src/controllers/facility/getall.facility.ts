import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const getAllFacilities = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(403).json({ error: "Not authorized" });
  }

  if (!user.role.includes("ADMIN")) {
    return res.status(403).json({ error: "Access denied: Admin role required" });
  }

  try {
    const facilities = await prisma.facility.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        _count: {
          select: {
            clients: {
              where: { deleted_at: null },
            },
            users: {
              where: { deleted_at: null },
            },
          },
        },
        users: {
          where: { deleted_at: null },
          include: {
            physicalConditionForms: {
              where: { deleted_at: null },
              include: {
                trainingHistory: {
                  select: {
                    id: true,
                    deleted_at: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const formattedFacilities = facilities.map((facility) => {
      const { _count, users, ...facilityData } = facility;

      const trainingHistoryUuids = new Set<number>();
      users.forEach((user) => {
        user.physicalConditionForms.forEach((form) => {
          if (form.trainingHistory && form.trainingHistory.deleted_at === null) {
            trainingHistoryUuids.add(form.trainingHistory.id);
          }
        });
      });

      const numberOfTrainingHistories = trainingHistoryUuids.size;

      return {
        ...facilityData,
        numberOfClients: _count.clients,
        numberOfUsers: _count.users,
        numberOfTrainingHistories,
      };
    });

    res.status(200).json(formattedFacilities);
  } catch (error) {
    console.error("Error retrieving facilities:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
