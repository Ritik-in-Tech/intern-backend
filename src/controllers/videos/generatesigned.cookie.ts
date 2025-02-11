// import { Request, Response } from "express";
// import crypto from "crypto";
// import fs from "fs";
// import path from "path";
// import dotenv from "dotenv";
// dotenv.config();

// const keyPairId = process.env.CLOUDFRONT_KEY_PAIR_ID!;
// // const privateKeyPath = path.resolve(__dirname, "../", process.env.CLOUDFRONT_PRIVATE_KEY!);
// const privateKey = process.env.CLOUDFRONT_PRIVATE_KEY!

// export const getSignedCookie = async (req: Request, res: Response) => {
//   try {
//     const policy = {
//       Statement: [
//         {
//           Resource: "https://" + process.env.CLOUDFRONT_DISTRIBUTION_ID + ".cloudfront.net/*",
//           Condition: {
//             DateLessThan: {
//               "AWS:EpochTime": Math.floor((Date.now() + 60000) / 1000), // 1 minute expiry
//             },
//           },
//         },
//       ],
//     };
//     const policyString = JSON.stringify(policy);
//     const policyBase64 = Buffer.from(policyString).toString("base64");
//     const signature = crypto.createSign("RSA-SHA1").update(policyBase64).sign(privateKey, "base64");

//     const signedCookie = {
//       "CloudFront-Policy": policyBase64,
//       "CloudFront-Signature": signature,
//       "CloudFront-Key-Pair-Id": keyPairId,
//     };
//     res.cookie("CloudFront-Policy", signedCookie["CloudFront-Policy"], { httpOnly: true });
//     res.cookie("CloudFront-Signature", signedCookie["CloudFront-Signature"], { httpOnly: true });
//     res.cookie("CloudFront-Key-Pair-Id", signedCookie["CloudFront-Key-Pair-Id"], { httpOnly: true });

//     res.json({ message: "Signed cookies set successfully" });
//   } catch (error) {
//     console.log(error);
//     res.send(500).json({ message: "Internal sever error" });
//   }
// };
