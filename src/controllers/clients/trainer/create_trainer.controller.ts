import { Request, Response } from "express";
import bcrypt from "bcrypt";

import prisma from "../../../utils/prisma";

export const createTrainer = async (req: Request, res: Response) => {
  const currentUser: any = req.user;
  // console.log(currentUser);
  const user = req.user;

  if (!user) {
    return res.status(403).json({ error: "Not authorized" });
  }

  if (!user.role.includes("MANAGER")) {
    return res.status(403).json({ error: "Access denied: Manager role required" });
  }
  try {
    const { email, name, password, role } = req.body;

    // Validate required fields
    if (!email || !name || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if the email is already in use
    const existingClient = await prisma.client.findFirst({
      where: { email, deleted_at: null },
    });

    if (existingClient) {
      return res.status(409).json({ error: "Email already in use" });
    }

    // Hash the password
    const saltRounds = 10;
    const passwordDigest = await bcrypt.hash(password, saltRounds);

    // Create the new client
    const newClient = await prisma.client.create({
      data: {
        email,
        name,
        passwordDigest,
        facilityId: currentUser.facilityId,
        role,
      },
    });

    res.status(201).json(newClient);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: "Internal server error", details: error.message });
    } else {
      res.status(500).json({ error: "Internal server error", details: "Unknown error" });
    }
  }
};
