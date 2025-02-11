import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { ApiResponse } from "../../utils/apiResponse";
import { generateToken } from "../../config/token";
import transporter from "../../config/email_transport";

export const requestPasswordReset = async (req: Request, res: Response) => {
  const { type } = req.params;

  if (!type) {
    return res.status(400).json(new ApiResponse(400, {}, "Type is not provided in params"));
  }
  let path;
  if (type == "admin") {
    path = "admin";
  } else {
    path = "clients";
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json(new ApiResponse(400, {}, "Email is not provided in the body"));
  }

  let user;

  if (type == "admin") {
    user = await prisma.admin.findFirst({ where: { email: email, deleted_at: null } });
  } else {
    user = await prisma.client.findFirst({ where: { email: email, deleted_at: null } });
  }

  if (!user) return res.status(404).json({ message: "User not found" });

  const id = user.id;

  const token = await generateToken();

  const updatedUserData = {
    passwordToken: token,
    passwordTokenExpires: new Date(Date.now() + 6 * 60 * 60 * 1000), // token expired after 6 hours
  };

  if (type == "admin") {
    await prisma.admin.update({
      where: { id: id },
      data: updatedUserData,
    });
  } else {
    await prisma.client.update({
      where: { id: id },
      data: updatedUserData,
    });
  }

  let resetUrl;

  if (process.env.NODE_ENV === "development") {
    resetUrl = `http://localhost:3000/${path}/reset-password/${token}`;
  } else {
    resetUrl = `https://app.ugo-ness.com/${path}/reset-password/${token}`;
  }

  const mailOptions = {
    from: `=?utf-8?B?${Buffer.from('うごきのクリニック').toString('base64')}?= <${process.env.EMAIL_FROM}>`,
    to: user.email,
    subject: "パスワード再設定のお知らせ",
    text: 
    "いつもご利用いただきありがとうございます。\n\n" +
    "パスワードを再設定するには以下のリンクをクリックしてください。\n" +
    `${resetUrl}\n\n` +
    "このリンクの有効期限は約6時間です。\n" +
    "このメールに覚えのない場合は、このメールを無視するか削除していただきますようお願いします。\n" +
    "--------------------\n" +
    "UgoNess | 株式会社うごきのクリニック"
  };

  //   console.log(mailOptions);

  try {
    const response = await transporter.sendMail(mailOptions);
    console.log(response);
    res.status(200).json({ message: "Password reset email sent", url: resetUrl });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to send email" });
  }
};
