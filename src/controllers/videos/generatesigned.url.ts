import { Request, Response } from "express";
import { ApiResponse } from "../../utils/apiResponse";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { s3 } from "../../config/aws";
dotenv.config();

// Controller to generate a signed URL
export const generateVideosSignedUrl = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json(new ApiResponse(400, {}, "Title and description are required"));
    }

    const VideofileKey = `${uuidv4()}.mp4`;
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: VideofileKey,
      Expires: 60 * 5,
      ContentType: "video/mp4",
    };

    const signedVideoUrl = await s3.getSignedUrlPromise("putObject", params);

    res.status(200).json(new ApiResponse(200, { signedVideoUrl, VideofileKey }, "Signed URL generated successfully"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, {}, "Error generating signed URL"));
  }
};

export const generateThumbnailSignedUrl = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json(new ApiResponse(400, {}, "Title and description are required"));
    }

    const ThumbnailfileKey = `${uuidv4()}.png`;
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: ThumbnailfileKey,
      Expires: 60 * 5,
      ContentType: "image/png",
    };

    const signedThumbnailUrl = await s3.getSignedUrlPromise("putObject", params);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { signedThumbnailUrl, ThumbnailfileKey },
          "Signed URL for thumbnail generated successfully",
        ),
      );
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, {}, "Error generating signed URL for thumbnail"));
  }
};
