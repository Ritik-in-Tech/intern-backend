/*
  Warnings:

  - You are about to drop the `_physicalconditionformtotraininghistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_traininghistorytoviewinghistory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `trainingHistoryId` to the `PhysicalConditionForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trainingHistoryId` to the `ViewingHistory` table without a default value. This is not possible if the table is not empty.

*/

-- DropForeignKey
ALTER TABLE `_PhysicalConditionFormToTrainingHistory` DROP FOREIGN KEY `_PhysicalConditionFormToTrainingHistory_A_fkey`;

-- DropForeignKey
ALTER TABLE `_PhysicalConditionFormToTrainingHistory` DROP FOREIGN KEY `_PhysicalConditionFormToTrainingHistory_B_fkey`;

-- DropForeignKey
ALTER TABLE `_TrainingHistoryToViewingHistory` DROP FOREIGN KEY `_TrainingHistoryToViewingHistory_A_fkey`;

-- DropForeignKey
ALTER TABLE `_TrainingHistoryToViewingHistory` DROP FOREIGN KEY `_TrainingHistoryToViewingHistory_B_fkey`;

-- AlterTable
ALTER TABLE `PhysicalConditionForm` ADD COLUMN `TrainingHistoryId` INTEGER;

-- AlterTable
ALTER TABLE `ViewingHistory` ADD COLUMN `TrainingHistoryId` INTEGER;

-- DropTable
DROP TABLE `_PhysicalConditionFormToTrainingHistory`;

-- DropTable
DROP TABLE `_TrainingHistoryToViewingHistory`;

-- AddForeignKey
ALTER TABLE `PhysicalConditionForm` ADD CONSTRAINT `PhysicalConditionForm_TrainingHistoryId_fkey` FOREIGN KEY (`TrainingHistoryId`) REFERENCES `TrainingHistory`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ViewingHistory` ADD CONSTRAINT `ViewingHistory_TrainingHistoryId_fkey` FOREIGN KEY (`TrainingHistoryId`) REFERENCES `TrainingHistory`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
