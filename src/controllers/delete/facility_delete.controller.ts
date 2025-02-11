import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const deleteFacility = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(403).json({ error: "Not authorized" });
  }

  if (!user.role.includes("ADMIN")) {
    return res.status(403).json({ error: "Access denied: Admin role required" });
  }

  const facilityId = parseInt(req.params.id);

  try {
    await prisma.$transaction(async (prisma) => {
      // Mark the facility as deleted
      await prisma.facility.update({
        where: { id: facilityId },
        data: { deleted_at: new Date() },
      });

      // Find and mark all clients associated with the facility as deleted
      await prisma.client.updateMany({
        where: { facilityId: facilityId },
        data: { deleted_at: new Date() },
      });

      // Find and mark all users associated with the facility as deleted
      const users = await prisma.user.findMany({
        where: { facilityId: facilityId },
        select: { id: true },
      });

      const userIds = users.map((user) => user.id);

      await prisma.user.updateMany({
        where: { id: { in: userIds } },
        data: { deleted_at: new Date() },
      });

      // Mark all physicalConditionForms related to the users as deleted
      await prisma.physicalConditionForm.updateMany({
        where: { userId: { in: userIds } },
        data: { deleted_at: new Date() },
      });

      // Find and mark all viewingHistories related to the users as deleted
      const viewingHistories = await prisma.viewingHistory.findMany({
        where: {
          trainingHistory: {
            physicalConditionForms: {
              some: {
                userId: { in: userIds },
              },
            },
          },
        },
        select: { id: true },
      });

      const viewingHistoryIds = viewingHistories.map((vh) => vh.id);

      await prisma.viewingHistory.updateMany({
        where: { id: { in: viewingHistoryIds } },
        data: { deleted_at: new Date() },
      });

      // Mark all trainingHistories related to the viewingHistories and physicalConditionForms as deleted
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

    res.status(200).json({ message: "Facility and associated activities marked as deleted." });
  } catch (error) {
    console.error("Error deleting facility: ", error);
    res.status(500).json({ error: "An error occurred while deleting the facility." });
  }
};
