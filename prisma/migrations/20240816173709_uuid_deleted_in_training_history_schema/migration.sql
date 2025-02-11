/*
  Warnings:

  - You are about to drop the column `TrainingHistoryId` on the `PhysicalConditionForm` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `TrainingHistory` table. All the data in the column will be lost.
  - You are about to drop the column `TrainingHistoryId` on the `ViewingHistory` table. All the data in the column will be lost.
  - Added the required column `trainingHistoryId` to the `PhysicalConditionForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trainingHistoryId` to the `ViewingHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `PhysicalConditionForm` DROP FOREIGN KEY `PhysicalConditionForm_TrainingHistoryId_fkey`;

-- DropForeignKey
ALTER TABLE `ViewingHistory` DROP FOREIGN KEY `ViewingHistory_TrainingHistoryId_fkey`;

-- AlterTable
ALTER TABLE `PhysicalConditionForm` DROP COLUMN `TrainingHistoryId`,
    ADD COLUMN `trainingHistoryId` INTEGER;

-- AlterTable
ALTER TABLE `TrainingHistory` DROP COLUMN `uuid`;

-- AlterTable
ALTER TABLE `ViewingHistory` DROP COLUMN `TrainingHistoryId`,
    ADD COLUMN `trainingHistoryId` INTEGER;

-- AddForeignKey
ALTER TABLE `PhysicalConditionForm` ADD CONSTRAINT `PhysicalConditionForm_trainingHistoryId_fkey` FOREIGN KEY (`trainingHistoryId`) REFERENCES `TrainingHistory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ViewingHistory` ADD CONSTRAINT `ViewingHistory_trainingHistoryId_fkey` FOREIGN KEY (`trainingHistoryId`) REFERENCES `TrainingHistory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
