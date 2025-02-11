import { Request, Response } from "express";
import bcrypt from "bcrypt";

import prisma from "../../../utils/prisma";

export const updateTrainer = async (req: Request, res: Response) => {
  const currentUser: any = req.user;
  const user = req.user;

  if (!user) {
    return res.status(403).json({ error: "Not authorized" });
  }

  if (!user.role.includes("MANAGER")) {
    return res.status(403).json({ error: "Access denied: Admin role required" });
  }
  try {
    const { id } = req.params;
    const { email, name, password } = req.body;

    // Find the client
    const existingClient = await prisma.client.findUnique({
      where: { id: parseInt(id, 10), deleted_at: null },
    });

    if (!existingClient) {
      return res.status(404).json({ error: "Client not found" });
    }

    if (currentUser.facilityId !== existingClient.facilityId) {
      res.status(401).json({ error: "No permission for this facility" });
      return;
    }

    // Update fields
    let updatedData: any = {};
    if (email) updatedData.email = email;
    if (name) updatedData.name = name;
    if (password) {
      const saltRounds = 10;
      updatedData.passwordDigest = await bcrypt.hash(password, saltRounds);
    }

    // Update the client
    const updatedClient = await prisma.client.update({
      where: { id: parseInt(id, 10) },
      data: updatedData,
    });

    res.status(200).json(updatedClient);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: "Internal server error", details: error.message });
    } else {
      res.status(500).json({ error: "Internal server error", details: "Unknown error" });
    }
  }
};
