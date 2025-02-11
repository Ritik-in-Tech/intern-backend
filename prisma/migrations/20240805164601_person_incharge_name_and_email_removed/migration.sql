/*
  Warnings:

  - You are about to drop the column `personInChargeEmail` on the `facility` table. All the data in the column will be lost.
  - You are about to drop the column `personInChargeName` on the `facility` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Facility` DROP COLUMN `personInChargeEmail`,
    DROP COLUMN `personInChargeName`;
