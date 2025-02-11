import { Request, Response } from "express";
import prisma from "../../../utils/prisma";

export const getAllManger = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(403).json({ error: "Not authorized" });
  }

  if (!user.role.includes("ADMIN")) {
    return res.status(403).json({ error: "Access denied: Admin role required" });
  }
  try {
    const clients = await prisma.client.findMany({
      where: {
        role: "MANAGER",
        deleted_at: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        facility: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
    res.status(200).json(clients);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: "Internal server error", details: error.message });
    } else {
      res.status(500).json({ error: "Internal server error", details: "Unknown error" });
    }
  }
};
