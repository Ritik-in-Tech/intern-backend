import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const deleteAdmin = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(403).json({ error: "Not authorized" });
  }

  if (!user.role.includes("ADMIN")) {
    return res.status(403).json({ error: "Access denied: Admin role required" });
  }

  const adminId = parseInt(req.params.id);

  try {
    await prisma.$transaction(async (prisma) => {
      await prisma.admin.update({
        where: { id: adminId },
        data: { deleted_at: new Date() },
      });

      await prisma.company.updateMany({
        where: { adminId: adminId },
        data: { deleted_at: new Date() },
      });

      await prisma.facility.updateMany({
        where: { company: { adminId: adminId } },
        data: { deleted_at: new Date() },
      });

      await prisma.client.updateMany({
        where: { facility: { company: { adminId: adminId } } },
        data: { deleted_at: new Date() },
      });

      await prisma.user.updateMany({
        where: { facility: { company: { adminId: adminId } } },
        data: { deleted_at: new Date() },
      });

      await prisma.physicalConditionForm.updateMany({
        where: { user: { facility: { company: { adminId: adminId } } } },
        data: { deleted_at: new Date() },
      });

      await prisma.video.updateMany({
        where: { adminId: adminId },
        data: { deleted_at: new Date() },
      });

      await prisma.viewingHistory.updateMany({
        where: {
          trainingHistory: {
            physicalConditionForms: {
              some: { user: { facility: { company: { adminId: adminId } } } },
            },
          },
        },
        data: { deleted_at: new Date() },
      });

      await prisma.trainingHistory.updateMany({
        where: {
          OR: [
            {
              physicalConditionForms: {
                some: { user: { facility: { company: { adminId: adminId } } } },
              },
            },
            {
              viewingHistories: {
                some: {
                  trainingHistory: {
                    physicalConditionForms: {
                      some: { user: { facility: { company: { adminId: adminId } } } },
                    },
                  },
                },
              },
            },
          ],
        },
        data: { deleted_at: new Date() },
      });
    });

    res.status(200).json({ message: "Admin and associated data marked as deleted." });
  } catch (error) {
    console.error("Error deleting admin: ", error);
    res.status(500).json({ error: "An error occurred while deleting the admin." });
  }
};
