// import { Request, Response } from "express";
// import prisma from "../../utils/prisma";

// export const getViewingHistoryById = async (req: Request, res: Response) => {
//   const user = req.user;
//   if (!user) {
//     return res.status(403).json({ error: "Not authorized" });
//   }
//   const { id } = req.params;
//   if (!id) {
//     return res.status(400).json({ error: "Id not found in params" });
//   }
//   try {
//     const viewingHistory = await prisma.viewingHistory.findUnique({
//       where: { id: parseInt(id, 10), user: { id: user.id }, deleted_at: null },
//       include: {
//         user: true,
//         video: true,
//       },
//     });

//     if (!viewingHistory) {
//       return res.status(404).json({ error: "Viewing history not found" });
//     }

//     res.status(200).json(viewingHistory);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to retrieve viewing history", details: error });
//   }
// };
