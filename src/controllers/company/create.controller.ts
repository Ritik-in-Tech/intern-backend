import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const createCompany = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(403).json({ error: "Not authorized" });
  }

  if (!user.role.includes("ADMIN")) {
    return res.status(403).json({ error: "Access denied: Admin role required" });
  }
  try {
    const { name, location, phoneNumber, adminId } = req.body;

    const newCompany = await prisma.company.create({
      data: {
        name,
        // nameKana,
        location,
        phoneNumber,
        // faxNumber,
        // personInChargeName,
        // personInChargeNameKana,
        adminId,
      },
    });

    res.status(201).json(newCompany);
  } catch (error) {
    res.status(500).json({ error: "Failed to create company" });
  }
};
