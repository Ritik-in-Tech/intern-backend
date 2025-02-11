import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const createTag = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(403).json({ error: "Not authorized" });
  }

  if (!user.role.includes("ADMIN")) {
    return res.status(403).json({ error: "Access denied: Admin role required" });
  }
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Tag name is not provided in the body" });
    }
    const newTag = await prisma.videoTag.create({
      data: {
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    res.status(201).json(newTag);
  } catch (error) {
    res.status(500).json({ error: "Failed to create tag" });
  }
};

export const editTag = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(403).json({ error: "Not authorized" });
  }

  if (!user.role.includes("ADMIN")) {
    return res.status(403).json({ error: "Access denied: Admin role required" });
  }
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedTag = await prisma.videoTag.update({
      where: { id: parseInt(id) },
      data: {
        name,
        updatedAt: new Date(),
      },
    });
    res.status(200).json(updatedTag);
  } catch (error) {
    res.status(500).json({ error: "Failed to update tag" });
  }
};

export const getTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tag = await prisma.videoTag.findUnique({
      where: { id: parseInt(id) },
    });
    if (tag) {
      res.status(200).json(tag);
    } else {
      res.status(404).json({ error: "Tag not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get tag" });
  }
};

export const getAllTags = async (req: Request, res: Response) => {
  try {
    const tags = await prisma.videoTag.findMany();
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ error: "Failed to get tags" });
  }
};

export const deleteTag = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(403).json({ error: "Not authorized" });
  }

  if (!user.role.includes("ADMIN")) {
    return res.status(403).json({ error: "Access denied: Admin role required" });
  }
  try {
    const { id } = req.params;
    const updatedTag = await prisma.videoTag.update({
      where: { id: parseInt(id) },
      data: {
        deletedAt: new Date(),
      },
    });
    res.status(200).json({ message: "Tag deleted successfully", tag: updatedTag });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete tag" });
  }
};

export const getTagByName = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    if (!name) {
      return res.status(400).json({ error: "Tag name is not provided in params" });
    }
    const tag = await prisma.videoTag.findFirst({
      where: { name: name },
    });
    if (tag) {
      res.status(200).json(tag);
    } else {
      res.status(404).json({ error: "Tag not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get tag" });
  }
};
