/*
  Warnings:

  - A unique constraint covering the columns `[email,deleted_at]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,deleted_at]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Admin_email_key` ON `Admin`;

-- DropIndex
DROP INDEX `Client_email_key` ON `Client`;

-- CreateIndex
CREATE UNIQUE INDEX `Admin_email_deleted_at_key` ON `Admin`(`email`, `deleted_at`);

-- CreateIndex
CREATE UNIQUE INDEX `Client_email_deleted_at_key` ON `Client`(`email`, `deleted_at`);
