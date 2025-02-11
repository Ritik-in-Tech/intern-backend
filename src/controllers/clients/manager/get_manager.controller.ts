import { Request, Response } from "express";
import prisma from "../../../utils/prisma";

export const getManagerById = async (req: Request, res: Response) => {
  const user = req.user;
  console.log(user);

  if (!user) {
    return res.status(403).json({ error: "Not authorized" });
  }

  // if (!user.role.includes("admin")) {
  //   return res.status(403).json({ error: "Access denied: Admin role required" });
  // }
  try {
    const { id } = req.params;
    const client = await prisma.client.findUnique({
      where: { id: parseInt(id, 10), deleted_at: null },
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

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.status(200).json(client);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: "Internal server error", details: error.message });
    } else {
      res.status(500).json({ error: "Internal server error", details: "Unknown error" });
    }
  }
};

export const getManagerByFacilityId = async (req: Request, res: Response) => {
  const facilityId = parseInt(req.params.facilityId, 10);

  if (isNaN(facilityId)) {
    return res.status(400).json({ error: "Invalid facility ID" });
  }

  try {
    const manager = await prisma.client.findMany({
      where: {
        facilityId: facilityId,
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
        facilityId: true,
        facility: {
          select: {
            name: true,
            location: true,
          },
        },
      },
    });

    if (!manager) {
      return res.status(200).json([]);
    }

    res.status(200).json(manager);
  } catch (error) {
    console.error("Error retrieving manager:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
