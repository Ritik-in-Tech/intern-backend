/*
  Warnings:

  - You are about to drop the column `physicalConditionFormId` on the `TrainingHistory` table. All the data in the column will be lost.
  - You are about to drop the column `viewingHistoryId` on the `TrainingHistory` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ViewingHistory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `TrainingHistory` DROP FOREIGN KEY `TrainingHistory_physicalConditionFormId_fkey`;

-- DropForeignKey
ALTER TABLE `TrainingHistory` DROP FOREIGN KEY `TrainingHistory_viewingHistoryId_fkey`;

-- DropForeignKey
ALTER TABLE `ViewingHistory` DROP FOREIGN KEY `ViewingHistory_userId_fkey`;

-- AlterTable
ALTER TABLE `TrainingHistory` DROP COLUMN `physicalConditionFormId`,
    DROP COLUMN `viewingHistoryId`;

-- AlterTable
ALTER TABLE `ViewingHistory` DROP COLUMN `userId`;

-- CreateTable
CREATE TABLE `_PhysicalConditionFormToTrainingHistory` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PhysicalConditionFormToTrainingHistory_AB_unique`(`A`, `B`),
    INDEX `_PhysicalConditionFormToTrainingHistory_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_TrainingHistoryToViewingHistory` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_TrainingHistoryToViewingHistory_AB_unique`(`A`, `B`),
    INDEX `_TrainingHistoryToViewingHistory_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_PhysicalConditionFormToTrainingHistory` ADD CONSTRAINT `_PhysicalConditionFormToTrainingHistory_A_fkey` FOREIGN KEY (`A`) REFERENCES `PhysicalConditionForm`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PhysicalConditionFormToTrainingHistory` ADD CONSTRAINT `_PhysicalConditionFormToTrainingHistory_B_fkey` FOREIGN KEY (`B`) REFERENCES `TrainingHistory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TrainingHistoryToViewingHistory` ADD CONSTRAINT `_TrainingHistoryToViewingHistory_A_fkey` FOREIGN KEY (`A`) REFERENCES `TrainingHistory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TrainingHistoryToViewingHistory` ADD CONSTRAINT `_TrainingHistoryToViewingHistory_B_fkey` FOREIGN KEY (`B`) REFERENCES `ViewingHistory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;