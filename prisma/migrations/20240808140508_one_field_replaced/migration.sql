/*
  Warnings:

  - You are about to drop the column `password_token` on the `admin` table. All the data in the column will be lost.
  - You are about to drop the column `password_token` on the `client` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Admin` DROP COLUMN `password_token`,
    ADD COLUMN `passwordToken` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Client` DROP COLUMN `password_token`,
    ADD COLUMN `passwordToken` VARCHAR(191) NULL;
