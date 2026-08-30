/*
  Warnings:

  - Added the required column `customerEmail` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerName` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerPhone` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `order_userId_fkey`;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `customerEmail` VARCHAR(191) NOT NULL,
    ADD COLUMN `customerName` VARCHAR(191) NOT NULL,
    ADD COLUMN `customerPhone` INTEGER NOT NULL,
    MODIFY `userId` INTEGER NULL,
    MODIFY `status` ENUM('PENDING', 'CONFIRMED', 'PAID', 'CANCELLED') NOT NULL DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
