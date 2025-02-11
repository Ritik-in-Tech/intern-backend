/*
  Warnings:

  - Added the required column `facilityId` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Admin` ADD COLUMN `facilityId` INTEGER NOT NULL,
    ADD COLUMN `passwordTokenExpires` DATETIME(3) NULL,
    ADD COLUMN `password_token` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Client` ADD COLUMN `passwordTokenExpires` DATETIME(3) NULL,
    ADD COLUMN `password_token` VARCHAR(191) NULL;
