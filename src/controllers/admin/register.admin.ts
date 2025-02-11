import bcrypt from "bcrypt";
import { Request, Response } from "express";

import prisma from "../../utils/prisma";

export const createAdmin = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  try {
    const existingAdmin = await prisma.admin.findFirst({
      where: {
        email,
        deleted_at: null,
      },
    });

    if (existingAdmin) {
      return res.status(400).json({ error: "Admin already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.admin.create({
      data: {
        email,
        name,
        passwordDigest: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return res.status(201).json({ admin: newAdmin, message: "Admin created successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};
