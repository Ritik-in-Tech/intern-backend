import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const deleteCompany = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(403).json({ error: "Not authorized" });
  }

  if (!user.role.includes("ADMIN")) {
    return res.status(403).json({ error: "Access denied: Admin role required" });
  }

  const companyId = parseInt(req.params.id);

  try {
    await prisma.$transaction(async (prisma) => {
      await prisma.company.update({
        where: { id: companyId },
        data: { deleted_at: new Date() },
      });

      const facilities = await prisma.facility.findMany({
        where: { companyId: companyId },
      });

      const facilityIds = facilities.map((facility) => facility.id);

      await prisma.facility.updateMany({
        where: { id: { in: facilityIds } },
        data: { deleted_at: new Date() },
      });

      await prisma.client.updateMany({
        where: { facilityId: { in: facilityIds } },
        data: { deleted_at: new Date() },
      });

      await prisma.user.updateMany({
        where: { facilityId: { in: facilityIds } },
        data: { deleted_at: new Date() },
      });

      const users = await prisma.user.findMany({
        where: { facilityId: { in: facilityIds } },
      });

      const userIds = users.map((user) => user.id);
      await prisma.user.updateMany({
        where: { id: { in: userIds } },
        data: { deleted_at: new Date() },
      });

      await prisma.physicalConditionForm.updateMany({
        where: { userId: { in: userIds } },
        data: { deleted_at: new Date() },
      });

      const viewingHistories = await prisma.viewingHistory.findMany({
        where: {
          trainingHistory: {
            physicalConditionForms: {
              some: { userId: { in: userIds } },
            },
          },
        },
      });

      const viewingHistoryIds = viewingHistories.map((vh) => vh.id);
      await prisma.viewingHistory.updateMany({
        where: { id: { in: viewingHistoryIds } },
        data: { deleted_at: new Date() },
      });

      await prisma.trainingHistory.updateMany({
        where: {
          OR: [
            { physicalConditionForms: { some: { userId: { in: userIds } } } },
            { viewingHistories: { some: { id: { in: viewingHistoryIds } } } },
          ],
        },
        data: { deleted_at: new Date() },
      });
    });

    res.status(200).json({ message: "Company and associated data marked as deleted." });
  } catch (error) {
    console.error("Error deleting company: ", error);
    res.status(500).json({ error: "An error occurred while deleting the company." });
  }
};
