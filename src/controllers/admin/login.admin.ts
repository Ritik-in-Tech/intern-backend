import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/token";
import { Request, Response } from "express";

import prisma from "../../utils/prisma";

export const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const admin = await prisma.admin.findFirst({
      where: {
        email: email,
        deleted_at: null,
      },
    });

    // console.log(admin);

    if (!admin) {
      return res.status(400).json({ error: "パスワードもしくはメールアドレスが間違っています" });
    }

    const passwordMatch = await bcrypt.compare(password, admin.passwordDigest);
    // console.log(passwordMatch);

    if (!passwordMatch) {
      return res.status(400).json({ error: "パスワードもしくはメールアドレスが間違っています" });
    }

    const userDetails = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: ["ADMIN"],
    };

    const authToken = jwt.sign({ user: userDetails }, JWT_SECRET);
    return res.status(200).json({ user: admin, authToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "何らかの問題が発生しました" });
  }
};
