/*
  Warnings:

  - You are about to drop the column `facilityContactNumber` on the `facility` table. All the data in the column will be lost.
  - You are about to drop the column `facilityLocation` on the `facility` table. All the data in the column will be lost.
  - You are about to drop the column `facilityName` on the `facility` table. All the data in the column will be lost.
  - Added the required column `location` to the `Facility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Facility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Facility` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Facility` DROP COLUMN `facilityContactNumber`,
    DROP COLUMN `facilityLocation`,
    DROP COLUMN `facilityName`,
    ADD COLUMN `location` VARCHAR(191) NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NOT NULL;
