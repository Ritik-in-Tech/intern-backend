/*
  Warnings:

  - You are about to drop the column `faxNumber` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `nameKana` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `personInChargeName` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `personInChargeNameKana` on the `company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Company` DROP COLUMN `faxNumber`,
    DROP COLUMN `nameKana`,
    DROP COLUMN `personInChargeName`,
    DROP COLUMN `personInChargeNameKana`;
