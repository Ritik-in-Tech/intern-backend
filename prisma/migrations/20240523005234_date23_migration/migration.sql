/*
  Warnings:

  - You are about to drop the `report` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Report` DROP FOREIGN KEY `Report_clientId_fkey`;

-- DropTable
DROP TABLE `Report`;
