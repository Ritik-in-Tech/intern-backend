import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const addUser = async (req: Request, res: Response): Promise<void> => {
  const currentUser: any = req.user;

  try {
    const { name, gender, dateOfBirth, medicalRecordId, functionalLevel, medicalHistory } = req.body;

    if (!name || !gender || !dateOfBirth) {
      res.status(400).json({
        error: "Name, gender and dateOfBirth are required fields",
      });
      return;
    }

    // Create a new user in the database
    const user = await prisma.user.create({
      data: {
        name,
        gender,
        dateOfBirth: new Date(dateOfBirth),
        facilityId: currentUser.facilityId,
        medicalRecordId,
        functionalLevel,
        medicalHistory,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: "Internal server error", details: error.message });
    } else {
      res.status(500).json({ error: "Internal server error", details: "Unknown error" });
    }
  }
};
