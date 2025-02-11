import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/apiResponse";
import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../config/token";

declare module "express" {
  export interface Request {
    user?: {
      id: number;
      name: string;
      email: string;
      role: string[];
    };
  }
}

interface DecodedToken {
  user: {
    id: number;
    name: string;
    email: string;
    role: string[];
  };
}

export const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the token from cookies or Authorization header
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    console.log(token);
    if (!token) {
      return res.status(401).json(new ApiResponse(401, {}, "Unauthorized request"));
    }

    const decodedToken = jwt.verify(token, JWT_SECRET) as DecodedToken;
    console.log(decodedToken);

    if (
      !decodedToken ||
      !decodedToken.user ||
      !decodedToken.user.id ||
      !decodedToken.user.name ||
      !decodedToken.user.email ||
      !Array.isArray(decodedToken.user.role) ||
      decodedToken.user.role.length === 0
    ) {
      return res.status(401).json(new ApiResponse(401, {}, "The token is invalid!"));
    }

    req.user = decodedToken.user;

    next();
  } catch (error) {
    console.error("Error verifying JWT:", error);
    return res.status(401).json(new ApiResponse(401, { error }, "Invalid access token"));
  }
};
