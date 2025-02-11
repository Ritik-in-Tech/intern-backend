import { Request, Response } from "express";
import csv from "csv-parser";
import fs from "fs";
import iconv from "iconv-lite";
import prisma from "../../utils/prisma";
import {
  convertToDate,
  formatFunctionalLevel,
  formatGender,
  validFunctionalLevels,
  validGenders,
} from "../../utils/csv";

interface CSVRow {
  name: string;
  gender: string;
  dateOfBirth: string;
  medicalRecordId?: string;
  functionalLevel?: string;
  medicalHistory?: string;
}

interface UserInput {
  name: string;
  gender: string;
  dateOfBirth: Date;
  medicalRecordId: string | null;
  functionalLevel: string | null;
  medicalHistory: string | null;
  facilityId: number | null;
}

export const uploadUsers = async (req: Request, res: Response): Promise<void> => {
  const currentUser: any = req.user;

  if (!req.file) {
    res.status(400).json({ error: "CSV file is required" });
    return;
  }

  const users: UserInput[] = [];
  const filePath: string = req.file.path;
  const errors: string[] = [];

  try {
    const headerMapping: any = {
      お名前: "name",
      性別: "gender",
      生年月日: "dateOfBirth",
      カルテID: "medicalRecordId",
      機能レベル: "functionalLevel",
      既往歴: "medicalHistory",
    };

    const fileStream = fs
      .createReadStream(filePath)
      .pipe(iconv.decodeStream("utf8"))
      .pipe(csv({ mapHeaders: ({ header }) => headerMapping[header] || header }));

    let index = 0;
    for await (const row of fileStream as AsyncIterable<CSVRow>) {
      index++;

      const name = row.name.trim();
      if (!name) {
        errors.push(`${index}行目: お名前を入力してください。`);
        continue;
      }

      const formattedGender = formatGender(row.gender.trim());
      if (!validGenders.includes(row.gender.trim())) {
        errors.push(`${index}行目: 性別を「男性」「女性」「その他」のいずれかで入力してください。`);
        continue;
      }

      const dateString = row.dateOfBirth.trim();
      const date = convertToDate(dateString);
      if (!date) {
        errors.push(
          `${index}行目: 生年月日は半角数字と半角記号で1950-01-30 (yyy-mm-dd or yyyy/mm/dd) のように入力してください。`,
        );
        continue;
      }

      const formattedFunctionalLevel = formatFunctionalLevel(row.functionalLevel?.trim() || "");
      if (formattedFunctionalLevel && !validFunctionalLevels.includes(row.functionalLevel?.trim() || "")) {
        errors.push(
          `${index}行目: 機能レベルは自立、要支援１、要支援２、要介護１、要介護２、要介護３、要介護４、要介護５のいずれかを入力してください。`,
        );
        continue;
      }

      if (Object.values(row).some((value) => value.trim() !== "")) {
        users.push({
          name,
          gender: formattedGender,
          dateOfBirth: new Date(date),
          medicalRecordId: row.medicalRecordId?.trim() || null,
          functionalLevel: formattedFunctionalLevel || null,
          medicalHistory: row.medicalHistory?.trim() || null,
          facilityId: currentUser.facilityId,
        });
      }
    }

    if (errors.length > 0) {
      res.status(400).json({ error: "Validation failed", details: errors });
      return;
    }

    await prisma.$transaction(async (prisma) => {
      await prisma.user.createMany({ data: users });
    });

    res.status(201).json({ message: "Users uploaded successfully", users });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to upload users", details: error instanceof Error ? error.message : "Unknown error" });
  } finally {
    fs.unlinkSync(filePath);
  }
};
