// facilityController.ts
import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const updateFacility = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  if (!user) {
    return res.status(403).json({ error: "Not authorized" });
  }

  if (!user.role.includes("ADMIN")) {
    return res.status(403).json({ error: "Access denied: Admin role required" });
  }
  const { name, location, phoneNumber, companyId } = req.body;

  try {
    const existingFacility = await prisma.facility.findUnique({
      where: { id: Number(id), deleted_at: null },
    });

    if (!existingFacility) {
      return res.status(404).json({ error: "Facility not found" });
    }

    const updateData: any = {
      name: name ?? existingFacility.name,
      location: location ?? existingFacility.location,
      phoneNumber: phoneNumber ?? existingFacility.phoneNumber,
      companyId: companyId ?? existingFacility.companyId,
      updatedAt: new Date(),
    };

    const updatedFacility = await prisma.facility.update({
      where: { id: Number(id) },
      data: updateData,
    });

    res.status(200).json(updatedFacility);
  } catch (error) {
    console.error("Error updating facility:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
