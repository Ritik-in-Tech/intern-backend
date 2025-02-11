import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const createVideoTagMapping = async (req: Request, res: Response) => {
  try {
    const { video_id, video_tag_id } = req.body;
    if (!video_id || !video_tag_id) {
      return res.status(400).json({ error: "Video Id and Tag Id is not provided in the body" });
    }
    const newMapping = await prisma.videoTagMapping.create({
      data: {
        video_id,
        video_tag_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    res.status(201).json(newMapping);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create video tag mapping" });
  }
};

export const editVideoTagMapping = async (req: Request, res: Response) => {
  try {
    const { video_id, video_tag_id } = req.params;
    const { new_video_id, new_video_tag_id } = req.body;
    const updatedMapping = await prisma.videoTagMapping.update({
      where: { video_id_video_tag_id: { video_id: parseInt(video_id), video_tag_id: parseInt(video_tag_id) } },
      data: {
        video_id: new_video_id ?? parseInt(video_id),
        video_tag_id: new_video_tag_id ?? parseInt(video_tag_id),
        updatedAt: new Date(),
      },
    });
    res.status(200).json(updatedMapping);
  } catch (error) {
    res.status(500).json({ error: "Failed to update video tag mapping" });
  }
};

export const getVideoMapping = async (req: Request, res: Response) => {
  try {
    const { video_id, video_tag_id } = req.params;
    const mapping = await prisma.videoTagMapping.findUnique({
      where: { video_id_video_tag_id: { video_id: parseInt(video_id), video_tag_id: parseInt(video_tag_id) } },
    });
    if (mapping) {
      res.status(200).json(mapping);
    } else {
      res.status(404).json({ error: "Video tag mapping not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get video tag mapping" });
  }
};

export const deleteVideoMapping = async (req: Request, res: Response) => {
  try {
    const { video_id, video_tag_id } = req.params;
    await prisma.videoTagMapping.delete({
      where: { video_id_video_tag_id: { video_id: parseInt(video_id), video_tag_id: parseInt(video_tag_id) } },
    });
    res.status(200).json({ message: "Video tag mapping deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete video tag mapping" });
  }
};

export const getAllVideoMappings = async (req: Request, res: Response) => {
  try {
    const mappings = await prisma.videoTagMapping.findMany();
    res.status(200).json(mappings);
  } catch (error) {
    res.status(500).json({ error: "Failed to get video tag mappings" });
  }
};
