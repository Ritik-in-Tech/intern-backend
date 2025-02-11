import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const getAdmin = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(403).json({ error: "Not authorized" });
  }

  if (!user.role.includes("ADMIN")) {
    return res.status(403).json({ error: "Access denied: Admin role required" });
  }

  try {
    const fullAdminDetails = await prisma.admin.findUnique({
      where: {
        id: user.id,
        deleted_at: null,
      },
    });

    if (!fullAdminDetails) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.status(200).json({ admin: fullAdminDetails });
  } catch (error) {
    console.error("Error fetching admin details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
