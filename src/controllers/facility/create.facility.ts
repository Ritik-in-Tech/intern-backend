import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const createFacility = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(403).json({ error: "Not authorized" });
  }

  if (!user.role.includes("ADMIN")) {
    return res.status(403).json({ error: "Access denied: Admin role required" });
  }
  const { name, location, phoneNumber, companyId } = req.body;

  try {
    if (!name || !location || !phoneNumber || !companyId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newFacility = await prisma.facility.create({
      data: {
        name,
        location,
        phoneNumber,
        companyId,
      },
    });

    res.status(201).json(newFacility);
  } catch (error) {
    console.error("Error creating facility:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
