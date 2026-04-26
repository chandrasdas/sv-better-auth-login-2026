-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`role` text DEFAULT 'teacher' NOT NULL,
	`failed_otp_attempts` integer DEFAULT 0 NOT NULL,
	`locked_until` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `allowed_staff` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`role` text DEFAULT 'teacher' NOT NULL,
	`is_allowed` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `allowed_staff_email_unique` ON `allowed_staff` (`email`);--> statement-breakpoint
CREATE TABLE `staff` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`emp_id` text NOT NULL,
	`name` text NOT NULL,
	`status` text NOT NULL,
	`designation` text NOT NULL,
	`email` text,
	`phone_no` text,
	`date_of_birth` integer,
	`date_of_joining` integer,
	`qualification` text,
	`primary_subject` text,
	`user_id` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `staff_email_unique` ON `staff` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `staff_emp_id_unique` ON `staff` (`emp_id`);--> statement-breakpoint
CREATE TABLE `stud_classes` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `stud_exam_terms` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `stud_info` (
	`sid` integer PRIMARY KEY NOT NULL,
	`portal_id` text(14) NOT NULL,
	`name` text(100) NOT NULL,
	`fname` text(100) NOT NULL,
	`dob` text NOT NULL,
	`transfer_date` text,
	`message_no` integer NOT NULL,
	`guardian_no` integer NOT NULL,
	`pen_no` integer,
	`caste` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE INDEX `idx_student_search_name` ON `stud_info` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `stud_info_pen_no_unique` ON `stud_info` (`pen_no`);--> statement-breakpoint
CREATE UNIQUE INDEX `stud_info_portal_id_unique` ON `stud_info` (`portal_id`);--> statement-breakpoint
CREATE TABLE `stud_marks_entries` (
	`mid` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_enroll_id` integer NOT NULL,
	`exam_setup_id` integer NOT NULL,
	`marks_obtained` integer DEFAULT 0 NOT NULL,
	`is_present` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`exam_setup_id`) REFERENCES `stud_exam_setups`(`setup_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`session_enroll_id`) REFERENCES `stud_session_enrollments`(`seid`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_marks_student_setup` ON `stud_marks_entries` (`session_enroll_id`,`exam_setup_id`);--> statement-breakpoint
CREATE INDEX `idx_marks_setup` ON `stud_marks_entries` (`exam_setup_id`);--> statement-breakpoint
CREATE TABLE `stud_sections` (
	`id` integer PRIMARY KEY NOT NULL,
	`class_id` integer NOT NULL,
	`letter` text(1) NOT NULL,
	`full_name` text(30) NOT NULL,
	`medium` text(15) DEFAULT 'Bengali' NOT NULL,
	FOREIGN KEY (`class_id`) REFERENCES `stud_classes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `stud_session_enrollments` (
	`seid` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`student_id` integer NOT NULL,
	`session_id` integer NOT NULL,
	`section_id` integer NOT NULL,
	`roll_no` integer NOT NULL,
	FOREIGN KEY (`section_id`) REFERENCES `stud_sections`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`session_id`) REFERENCES `stud_sessions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_id`) REFERENCES `stud_info`(`sid`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_class_roll` ON `stud_session_enrollments` (`session_id`,`section_id`,`roll_no`);--> statement-breakpoint
CREATE UNIQUE INDEX `uq_student_session` ON `stud_session_enrollments` (`student_id`,`session_id`);--> statement-breakpoint
CREATE TABLE `stud_sessions` (
	`id` integer PRIMARY KEY NOT NULL,
	`year` integer NOT NULL,
	`name` text(9) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `stud_subjects` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text(20) NOT NULL,
	`code` text(4) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `stud_subjects_code_unique` ON `stud_subjects` (`code`);--> statement-breakpoint
CREATE UNIQUE INDEX `stud_subjects_name_unique` ON `stud_subjects` (`name`);--> statement-breakpoint
CREATE TABLE `stud_exam_setups` (
	`setup_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`class_id` integer NOT NULL,
	`session_id` integer NOT NULL,
	`exam_term_id` integer NOT NULL,
	`subject_id` integer NOT NULL,
	`full_mark` integer NOT NULL,
	`pass_mark` integer DEFAULT 0 NOT NULL,
	`sort_index` integer DEFAULT 0 NOT NULL,
	`include_in_total` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`subject_id`) REFERENCES `stud_subjects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`exam_term_id`) REFERENCES `stud_exam_terms`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`session_id`) REFERENCES `stud_sessions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`class_id`) REFERENCES `stud_classes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_exam_config` ON `stud_exam_setups` (`session_id`,`class_id`,`exam_term_id`,`subject_id`);
*/