import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../../utils/prisma";
import { ApiResponse } from "../../utils/apiResponse";
import { verifyToken } from "../../config/token";

export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  if (!token) {
    return res.status(400).json(new ApiResponse(400, {}, "token is not found in params"));
  }
  const { password, type } = req.body;

  if (!password || !type) {
    return res.status(400).json(new ApiResponse(400, {}, "Password or type is missing from the body"));
  }

  let user;

  if (type === "admin") {
    user = await prisma.admin.findFirst({
      where: { passwordToken: token, passwordTokenExpires: { gt: new Date() }, deleted_at: null },
    });
  } else {
    user = await prisma.client.findFirst({
      where: { passwordToken: token, passwordTokenExpires: { gt: new Date() }, deleted_at: null },
    });
  }

  if (!user) return res.status(400).json({ message: "Invalid or expired token" });

  const isTokenValid = verifyToken(token, user.passwordToken!, user.passwordTokenExpires!);
  if (!isTokenValid) return res.status(400).json({ message: "Invalid or expired token" });

  const hashedPassword = await bcrypt.hash(password, 10);
//   console.log(hashedPassword);

  if (type === "admin") {
    await prisma.admin.update({
      where: { id: user.id },
      data: {
        passwordDigest: hashedPassword,
        passwordToken: null,
        passwordTokenExpires: null,
      },
    });
  } else {
    await prisma.client.update({
      where: { id: user.id },
      data: {
        passwordDigest: hashedPassword,
        passwordToken: null,
        passwordTokenExpires: null,
      },
    });
  }

  res.status(200).json({ message: "Password has been reset successfully!" });
};
