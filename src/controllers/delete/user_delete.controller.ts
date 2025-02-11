import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const deleteUser = async (req: Request, res: Response) => {
  const currentUser: any = req.user;
  const userId = parseInt(req.params.id);

  if (!currentUser) {
    return res.status(403).json({ error: "Not authorized" });
  }

  if (!currentUser.role.includes("ADMIN") && !currentUser.role.includes("MANAGER")) {
    return res.status(403).json({ error: "Access denied: Only Admin and Manager are allowed to delete users" });
  }

  try {
    await prisma.$transaction(async (prisma) => {
      await prisma.user.update({
        where: { id: userId, deleted_at: null, facilityId: currentUser.facilityId },
        data: { deleted_at: new Date() },
      });

      await prisma.physicalConditionForm.updateMany({
        where: { userId: userId, deleted_at: null },
        data: { deleted_at: new Date() },
      });

      const viewingHistories = await prisma.viewingHistory.findMany({
        where: {
          trainingHistory: {
            physicalConditionForms: {
              some: {
                userId: userId,
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

      await prisma.trainingHistory.updateMany({
        where: {
          OR: [
            { physicalConditionForms: { some: { userId: userId } } },
            { viewingHistories: { some: { id: { in: viewingHistoryIds } } } },
          ],
        },
        data: { deleted_at: new Date() },
      });
    });

    res.status(200).json({ message: "User and associated data marked as deleted." });
  } catch (error) {
    console.error("Error deleting user: ", error);
    res.status(500).json({ error: "An error occurred while deleting the user." });
  }
};
