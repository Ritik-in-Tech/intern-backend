import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  const currentUser: any = req.user;
  try {
    const users = await prisma.user.findMany({ where: { deleted_at: null, facilityId: currentUser?.facilityId } });
    res.status(200).json(users);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: "Internal server error", details: error.message });
    } else {
      res.status(500).json({ error: "Internal server error", details: "Unknown error" });
    }
  }
};
