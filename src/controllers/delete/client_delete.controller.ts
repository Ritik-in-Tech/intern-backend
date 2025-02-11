import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const deleteClient = async (req: Request, res: Response) => {
  const currentUser: any = req.user;

  if (!currentUser) {
    return res.status(403).json({ error: "Not authorized" });
  }

  const clientId = parseInt(req.params.id);

  try {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    if (client.role === "MANAGER" && !currentUser.role.includes("ADMIN")) {
      return res.status(403).json({ error: "Access denied: Admin role required" });
    }

    if (currentUser.role.includes("MANAGER")) {
      await prisma.client.update({
        where: { id: clientId, facilityId: currentUser.facilityId },
        data: { deleted_at: new Date() },
      });
    } else if (currentUser.role.includes("ADMIN")) {
      await prisma.client.update({
        where: { id: clientId },
        data: { deleted_at: new Date() },
      });
    }

    res.status(200).json({ message: "Client and associated activities marked as deleted." });
  } catch (error) {
    console.error("Error deleting client: ", error);
    res.status(500).json({ error: "An error occurred while deleting the client." });
  }
};
