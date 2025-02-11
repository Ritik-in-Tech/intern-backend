/*
  Warnings:

  - Added the required column `functionalLevel` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `functionalLevel` VARCHAR(191) NOT NULL,
    ADD COLUMN `medicalHistory` VARCHAR(191) NULL;
