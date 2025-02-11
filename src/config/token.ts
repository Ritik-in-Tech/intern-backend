import { randomBytes as cryptoRandomBytes } from "crypto";
import { promisify } from "util";

export const JWT_SECRET: string = process.env.ACCESS_TOKEN_SECRET || "default_secret_key";

const randomBytes = promisify(cryptoRandomBytes);

export const generateToken = async (): Promise<string> => {
  const buffer = await randomBytes(20);
  return buffer.toString("hex");
};

export const verifyToken = (token: string, userToken: string, tokenExpiry: Date): boolean => {
  return token === userToken && new Date() < tokenExpiry;
};
