-- AlterTable
ALTER TABLE `PhysicalConditionForm` ADD COLUMN `trainingHistoryId` INTEGER NULL;

-- AlterTable
ALTER TABLE `ViewingHistory` ADD COLUMN `trainingHistoryId` INTEGER NULL;

-- CreateTable
CREATE TABLE `TrainingHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PhysicalConditionForm` ADD CONSTRAINT `PhysicalConditionForm_trainingHistoryId_fkey` FOREIGN KEY (`trainingHistoryId`) REFERENCES `TrainingHistory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ViewingHistory` ADD CONSTRAINT `ViewingHistory_trainingHistoryId_fkey` FOREIGN KEY (`trainingHistoryId`) REFERENCES `TrainingHistory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
