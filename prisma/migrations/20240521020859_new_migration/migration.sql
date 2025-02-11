/*
  Warnings:

  - You are about to drop the column `assignedAt` on the `clientuser` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `facility` table. All the data in the column will be lost.
  - You are about to drop the column `submittedAt` on the `form` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `report` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `ClientUser` DROP COLUMN `assignedAt`;

-- AlterTable
ALTER TABLE `Facility` DROP COLUMN `location`;

-- AlterTable
ALTER TABLE `Form` DROP COLUMN `submittedAt`;

-- AlterTable
ALTER TABLE `Report` DROP COLUMN `createdAt`;
