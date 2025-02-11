import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const editUser = async (req: Request, res: Response): Promise<void> => {
  const currentUser: any = req.user;

  try {
    const { id } = req.params;
    const { name, gender, dateOfBirth, medicalRecordId, functionalLevel, medicalHistory } = req.body;

    // Ensure id is a number
    const userId = parseInt(id);
    if (isNaN(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId, deleted_at: null },
    });
    if (currentUser.facilityId !== user?.facilityId) {
      res.status(401).json({ error: "no permission for this facility" });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId, deleted_at: null },
      data: {
        name,
        gender,
        medicalRecordId,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        functionalLevel,
        medicalHistory,
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: "Internal server error", details: error.message });
    } else {
      res.status(500).json({ error: "Internal server error", details: "Unknown error" });
    }
  }
};
