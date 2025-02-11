// import { Request, Response } from "express";
// import prisma from "../../utils/prisma";

// export const getAllViewingHistories = async (req: Request, res: Response) => {
//   const user = req.user;
//   if (!user) {
//     return res.status(403).json({ error: "Not authorized" });
//   }
//   try {
//     const viewingHistories = await prisma.viewingHistory.findMany({
//       where: {
//         user: { id: user.id },
//         deleted_at: null,
//       },
//       include: {
//         user: true,
//         video: true,
//       },
//     });
//     res.status(200).json(viewingHistories);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to retrieve viewing histories", details: error });
//   }
// };
