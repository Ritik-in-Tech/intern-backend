/*
  Warnings:

  - You are about to drop the column `trainingHistoryId` on the `physicalconditionform` table. All the data in the column will be lost.
  - You are about to drop the column `trainingHistoryId` on the `viewinghistory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `PhysicalConditionForm` DROP FOREIGN KEY `PhysicalConditionForm_trainingHistoryId_fkey`;

-- DropForeignKey
ALTER TABLE `ViewingHistory` DROP FOREIGN KEY `ViewingHistory_trainingHistoryId_fkey`;

-- AlterTable
ALTER TABLE `PhysicalConditionForm` DROP COLUMN `trainingHistoryId`;

-- AlterTable
ALTER TABLE `TrainingHistory` ADD COLUMN `physicalConditionFormId` INTEGER NULL,
    ADD COLUMN `viewingHistoryId` INTEGER NULL;

-- AlterTable
ALTER TABLE `ViewingHistory` DROP COLUMN `trainingHistoryId`;

-- AddForeignKey
ALTER TABLE `TrainingHistory` ADD CONSTRAINT `TrainingHistory_physicalConditionFormId_fkey` FOREIGN KEY (`physicalConditionFormId`) REFERENCES `PhysicalConditionForm`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrainingHistory` ADD CONSTRAINT `TrainingHistory_viewingHistoryId_fkey` FOREIGN KEY (`viewingHistoryId`) REFERENCES `ViewingHistory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
