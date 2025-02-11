import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/token";

import prisma from "../../utils/prisma";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please all required fields" });
    }

    const client = await prisma.client.findFirst({
      where: {
        email,
        deleted_at: null,
      },
    });

    if (!client) {
      return res.status(404).json({ message: "パスワードもしくはメールアドレスが間違っています" });
    }

    const isPasswordValid = await bcrypt.compare(password, client.passwordDigest);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "パスワードもしくはメールアドレスが間違っています" });
    }
    const userDetails = {
      id: client.id,
      email: client.email,
      name: client.name,
      role: [client.role],
      facilityId: client.facilityId,
    };

    const authToken = jwt.sign({ user: userDetails }, JWT_SECRET);

    res.json({ authToken, client });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "何らかの問題が発生しました" });
  }
};
