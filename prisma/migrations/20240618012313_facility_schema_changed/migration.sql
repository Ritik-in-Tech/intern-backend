/*
  Warnings:

  - You are about to drop the column `type` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `facility` table. All the data in the column will be lost.
  - Added the required column `facilityContactNumber` to the `Facility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facilityLocation` to the `Facility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facilityName` to the `Facility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `personInChargeEmail` to the `Facility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `personInChargeName` to the `Facility` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Client` DROP COLUMN `type`;

-- AlterTable
ALTER TABLE `Facility` DROP COLUMN `name`,
    ADD COLUMN `facilityContactNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `facilityLocation` VARCHAR(191) NOT NULL,
    ADD COLUMN `facilityName` VARCHAR(191) NOT NULL,
    ADD COLUMN `personInChargeEmail` VARCHAR(191) NOT NULL,
    ADD COLUMN `personInChargeName` VARCHAR(191) NOT NULL;
