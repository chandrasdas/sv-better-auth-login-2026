-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `account` (
	`id` varchar(36) NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`access_token` text DEFAULT 'NULL',
	`refresh_token` text DEFAULT 'NULL',
	`id_token` text DEFAULT 'NULL',
	`access_token_expires_at` timestamp(3) NOT NULL DEFAULT 'current_timestamp(3)',
	`refresh_token_expires_at` timestamp(3) NOT NULL DEFAULT '''0000-00-00 00:00:00.000''',
	`scope` text DEFAULT 'NULL',
	`password` text DEFAULT 'NULL',
	`created_at` timestamp(3) NOT NULL DEFAULT 'current_timestamp(3)',
	`updated_at` timestamp(3) NOT NULL DEFAULT 'current_timestamp(3)'
);
--> statement-breakpoint
CREATE TABLE `allowed_staff` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`name` varchar(255) DEFAULT 'NULL',
	`role` enum('admin','teacher','staff') NOT NULL DEFAULT '''teacher''',
	`is_allowed` tinyint(1) NOT NULL DEFAULT 1,
	CONSTRAINT `allowed_staff_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(36) NOT NULL,
	`expires_at` timestamp(3) NOT NULL DEFAULT 'current_timestamp(3)',
	`token` varchar(255) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT 'current_timestamp(3)',
	`updated_at` timestamp(3) NOT NULL DEFAULT 'current_timestamp(3)',
	`ip_address` text DEFAULT 'NULL',
	`user_agent` text DEFAULT 'NULL',
	`user_id` varchar(36) NOT NULL,
	CONSTRAINT `session_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `staff` (
	`emp_id` varchar(8) NOT NULL,
	`name` varchar(255) NOT NULL,
	`status` enum('Permanent','Contractual') NOT NULL,
	`designation` enum('Headmaster','Assistant Teacher','Librarian','Clerk','Group-D') NOT NULL,
	`email` varchar(255) DEFAULT 'NULL',
	`phone_no` varchar(15) DEFAULT 'NULL',
	`date_of_birth` date DEFAULT 'NULL',
	`date_of_joining` date DEFAULT 'NULL',
	`qualification` varchar(255) DEFAULT 'NULL',
	`primary_subject` varchar(100) DEFAULT 'NULL',
	`user_id` varchar(36) DEFAULT 'NULL',
	`is_active` tinyint(1) NOT NULL DEFAULT 1,
	`created_at` timestamp(3) NOT NULL DEFAULT 'current_timestamp(3)',
	`updated_at` timestamp(3) NOT NULL DEFAULT 'current_timestamp(3)',
	CONSTRAINT `staff_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `task` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`title` text NOT NULL,
	`priority` int(11) NOT NULL DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified` tinyint(1) NOT NULL DEFAULT 0,
	`image` text DEFAULT 'NULL',
	`created_at` timestamp(3) NOT NULL DEFAULT 'current_timestamp(3)',
	`updated_at` timestamp(3) NOT NULL DEFAULT 'current_timestamp(3)',
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` varchar(36) NOT NULL,
	`identifier` varchar(255) NOT NULL,
	`value` text NOT NULL,
	`expires_at` timestamp(3) NOT NULL DEFAULT 'current_timestamp(3)',
	`created_at` timestamp(3) NOT NULL DEFAULT 'current_timestamp(3)',
	`updated_at` timestamp(3) NOT NULL DEFAULT 'current_timestamp(3)'
);
--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff` ADD CONSTRAINT `staff_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE INDEX `staff_userId_idx` ON `staff` (`user_id`);--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);
*/