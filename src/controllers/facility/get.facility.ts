// facilityController.ts
import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const getFacilityById = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(403).json({ error: "Not authorized" });
  }

  const { id } = req.params;

  try {
    const facility = await prisma.facility.findUnique({
      where: { id: Number(id), deleted_at: null },
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

    if (!facility) {
      return res.status(404).json({ error: "Facility not found" });
    }

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

    const formattedFacility = {
      ...facilityData,
      numberOfClients: _count.clients,
      numberOfUsers: _count.users,
      numberOfTrainingHistories,
    };

    res.status(200).json(formattedFacility);
  } catch (error) {
    console.error("Error retrieving facility:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getFacilityByCompanyId = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    console.log(companyId);

    const id = parseInt(companyId, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid company ID" });
    }

    const facilities = await prisma.facility.findMany({
      where: {
        companyId: id,
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

    if (facilities.length === 0) {
      return res.status(200).json([]);
    }

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
        createdAt: facility.createdAt.toISOString(),
        updatedAt: facility.updatedAt.toISOString(),
        deleted_at: facility.deleted_at ? facility.deleted_at.toISOString() : null,
      };
    });

    res.status(200).json(formattedFacilities);
  } catch (error) {
    console.error("Error fetching facilities:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
};
