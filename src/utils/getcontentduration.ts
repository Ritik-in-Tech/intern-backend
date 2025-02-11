import prisma from "../utils/prisma";

export async function getContentDuration(contentId: number): Promise<number> {
  const content = await prisma.video.findUnique({
    where: { id: contentId },
    select: { duration: true },
  });
  return content?.duration || 0;
}
