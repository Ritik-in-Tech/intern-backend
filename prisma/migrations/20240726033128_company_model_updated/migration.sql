/*
  Warnings:

  - You are about to drop the column `email` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `personInChargeEmail` on the `company` table. All the data in the column will be lost.
  - Added the required column `nameKana` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `personInChargeNameKana` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Company` DROP COLUMN `email`,
    DROP COLUMN `personInChargeEmail`,
    ADD COLUMN `nameKana` VARCHAR(191) NOT NULL,
    ADD COLUMN `personInChargeNameKana` VARCHAR(191) NOT NULL;
