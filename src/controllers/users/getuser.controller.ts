import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const getAUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const currentUser: any = req.user;

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

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: "Internal server error", details: error.message });
    } else {
      res.status(500).json({ error: "Internal server error", details: "Unknown error" });
    }
  }
};
