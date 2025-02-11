/*
  Warnings:

  - You are about to drop the column `deleted` on the `admin` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `facility` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `physicalconditionform` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `video` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `viewinghistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Admin` DROP COLUMN `deleted`,
    ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Client` DROP COLUMN `deleted`,
    ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Facility` DROP COLUMN `deleted`,
    ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `PhysicalConditionForm` DROP COLUMN `deleted`,
    ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `TrainingHistory` ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `deleted`,
    ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Video` DROP COLUMN `deleted`,
    ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `ViewingHistory` DROP COLUMN `deleted`,
    ADD COLUMN `deleted_at` DATETIME(3) NULL;
