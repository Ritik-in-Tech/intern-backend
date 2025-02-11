import { Request, Response } from "express";
import bcrypt from "bcrypt";

import prisma from "../../../utils/prisma";

export const createManager = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(403).json({ error: "Not authorized" });
  }

  if (!user.role.includes("ADMIN")) {
    return res.status(403).json({ error: "Access denied: Admin role required" });
  }
  try {
    const { email, name, password, facilityId, role } = req.body;

    // Validate required fields
    if (!email || !name || !password || !facilityId) {
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
        facilityId,
        role,
      },
    });

    res.status(201).json(newClient);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      res.status(500).json({ error: "Internal server error", details: error.message });
    } else {
      res.status(500).json({ error: "Internal server error", details: "Unknown error" });
    }
  }
};
