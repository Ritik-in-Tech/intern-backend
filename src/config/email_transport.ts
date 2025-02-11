import nodemailer from "nodemailer";
import aws from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

let transporter: nodemailer.Transporter;

if (process.env.NODE_ENV === "development") {
  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: process.env.ETHEREAL_USER,
      pass: process.env.ETHEREAL_PASS,
    },
  });
} else {
  aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
  });

  transporter = nodemailer.createTransport({
    SES: new aws.SES({ apiVersion: "2010-12-01" }),
  });
}

export default transporter;
