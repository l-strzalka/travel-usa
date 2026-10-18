-- CreateTable
CREATE TABLE `newsletter` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `confirmationToken` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `confirmedAt` DATETIME(3) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `status` ENUM('PENDING', 'CONFIRMED', 'UNSUBSCRIBED') NOT NULL DEFAULT 'PENDING',
    `marketingConsent` BOOLEAN NOT NULL DEFAULT false,
    `consentIP` VARCHAR(191) NULL,
    `externalContactId` VARCHAR(191) NULL,

    UNIQUE INDEX `newsletter_email_key`(`email`),
    UNIQUE INDEX `newsletter_confirmationToken_key`(`confirmationToken`),
    INDEX `newsletter_email_idx`(`email`),
    INDEX `newsletter_confirmationToken_idx`(`confirmationToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
