import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const editCompany = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(403).json({ error: "Not authorized" });
  }

  if (!user.role.includes("ADMIN")) {
    return res.status(403).json({ error: "Access denied: Admin role required" });
  }
  try {
    const { id } = req.params;
    const { name, location, phoneNumber } = req.body;

    const updatedCompany = await prisma.company.update({
      where: { id: parseInt(id), deleted_at: null },
      data: {
        name,
        // nameKana,
        location,
        phoneNumber,
        // faxNumber,
        // personInChargeName,
        // personInChargeNameKana,
      },
    });

    res.status(200).json(updatedCompany);
  } catch (error) {
    res.status(500).json({ error: "Failed to update company" });
  }
};
