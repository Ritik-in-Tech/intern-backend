import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const getCompanies = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(403).json({ error: "Not authorized" });
  }

  if (!user.role.includes("ADMIN")) {
    return res.status(403).json({ error: "Access denied: Admin role required" });
  }

  try {
    const companies = await prisma.company.findMany({
      where: { deleted_at: null },
      include: {
        _count: {
          select: {
            facilities: {
              where: { deleted_at: null },
            },
          },
        },
        facilities: {
          where: { deleted_at: null },
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
        },
      },
    });

    const result = companies.map((company) => {
      const { _count, facilities, ...companyData } = company;

      const numberOfClients = facilities.reduce((sum, facility) => sum + facility._count.clients, 0);
      const numberOfUsers = facilities.reduce((sum, facility) => sum + facility._count.users, 0);

      const trainingHistoryUuids = new Set<number>();
      facilities.forEach((facility) => {
        facility.users.forEach((user) => {
          user.physicalConditionForms.forEach((form) => {
            if (form.trainingHistory && form.trainingHistory.deleted_at === null) {
              trainingHistoryUuids.add(form.trainingHistory.id);
            }
          });
        });
      });

      const numberOfTrainingHistories = trainingHistoryUuids.size;

      return {
        ...companyData,
        numberOfFacilities: _count.facilities,
        numberOfClients,
        numberOfUsers,
        numberOfTrainingHistories,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error retrieving companies:", error);
    res.status(500).json({ error: "Failed to retrieve companies" });
  }
};

export const getACompany = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(403).json({ error: "Not authorized" });
  }

  try {
    const { id } = req.params;

    const company = await prisma.company.findUnique({
      where: { id: parseInt(id), deleted_at: null },
      include: {
        _count: {
          select: {
            facilities: {
              where: { deleted_at: null },
            },
          },
        },
        facilities: {
          where: { deleted_at: null },
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
        },
      },
    });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    const { _count, facilities, ...companyData } = company;

    const numberOfClients = facilities.reduce((sum, facility) => sum + facility._count.clients, 0);
    const numberOfUsers = facilities.reduce((sum, facility) => sum + facility._count.users, 0);

    const trainingHistoryUuids = new Set<number>();
    facilities.forEach((facility) => {
      facility.users.forEach((user) => {
        user.physicalConditionForms.forEach((form) => {
          if (form.trainingHistory && form.trainingHistory.deleted_at === null) {
            trainingHistoryUuids.add(form.trainingHistory.id);
          }
        });
      });
    });

    const numberOfTrainingHistories = trainingHistoryUuids.size;

    const result = {
      ...companyData,
      numberOfFacilities: _count.facilities,
      numberOfClients,
      numberOfUsers,
      numberOfTrainingHistories,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Error retrieving company:", error);
    res.status(500).json({ error: "Failed to retrieve company" });
  }
};
