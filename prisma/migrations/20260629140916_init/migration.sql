-- CreateTable
CREATE TABLE `posts` (
    `id` VARCHAR(600) NOT NULL,
    `title` VARCHAR(600) NOT NULL,
    `company` VARCHAR(300) NOT NULL,
    `publishDate` BIGINT NOT NULL,
    `viewCount` INTEGER NOT NULL DEFAULT 0,
    `isShow` BOOLEAN NOT NULL DEFAULT true,

    INDEX `posts_isShow_publishDate_id_idx`(`isShow`, `publishDate`, `id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blogs` (
    `id` VARCHAR(600) NOT NULL,
    `title` VARCHAR(300) NOT NULL,
    `rssURL` VARCHAR(600) NOT NULL,
    `cron` BOOLEAN NOT NULL DEFAULT true,
    `lastUpdated` BIGINT NOT NULL DEFAULT 0,
    `lastUpdatedDate` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bookmarks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uid` VARCHAR(150) NOT NULL,
    `parent` VARCHAR(600) NOT NULL,
    `publishDate` BIGINT NOT NULL,

    UNIQUE INDEX `bookmarks_uid_parent_key`(`uid`, `parent`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bookmarks` ADD CONSTRAINT `bookmarks_parent_fkey` FOREIGN KEY (`parent`) REFERENCES `posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
