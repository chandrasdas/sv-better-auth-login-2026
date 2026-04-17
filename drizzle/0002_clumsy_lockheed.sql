CREATE TABLE `class_sections` (
	`id` integer PRIMARY KEY NOT NULL,
	`class_id` integer NOT NULL,
	`letter` text(1) NOT NULL,
	`full_name` text(30) NOT NULL,
	`medium` text(15) DEFAULT 'Bengali' NOT NULL,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `classes` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `exam_setups` (
	`setup_id` integer PRIMARY KEY NOT NULL,
	`class_id` integer NOT NULL,
	`session_id` integer NOT NULL,
	`exam_term_id` integer NOT NULL,
	`subject_id` integer NOT NULL,
	`full_mark` integer NOT NULL,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`exam_term_id`) REFERENCES `exam_terms`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_exam_config` ON `exam_setups` (`class_id`,`session_id`,`exam_term_id`,`subject_id`);--> statement-breakpoint
CREATE TABLE `exam_terms` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `marks_entries` (
	`mid` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_enroll_id` integer NOT NULL,
	`exam_setup_id` integer NOT NULL,
	`marks_obtained` integer DEFAULT 0 NOT NULL,
	`is_present` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`session_enroll_id`) REFERENCES `session_enrollments`(`seid`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`exam_setup_id`) REFERENCES `exam_setups`(`setup_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_marks_enrollment` ON `marks_entries` (`session_enroll_id`);--> statement-breakpoint
CREATE INDEX `idx_marks_setup` ON `marks_entries` (`exam_setup_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `uq_marks_student_setup` ON `marks_entries` (`session_enroll_id`,`exam_setup_id`);--> statement-breakpoint
CREATE TABLE `session_enrollments` (
	`seid` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`student_id` integer NOT NULL,
	`session_id` integer NOT NULL,
	`class_sec_id` integer NOT NULL,
	`roll_no` integer NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`sid`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`class_sec_id`) REFERENCES `class_sections`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_enroll_student` ON `session_enrollments` (`student_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `uq_student_session` ON `session_enrollments` (`student_id`,`session_id`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` integer PRIMARY KEY NOT NULL,
	`year` integer NOT NULL,
	`name` text(9) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `students` (
	`sid` integer PRIMARY KEY NOT NULL,
	`portal_id` integer NOT NULL,
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
CREATE UNIQUE INDEX `students_portal_id_unique` ON `students` (`portal_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `students_pen_no_unique` ON `students` (`pen_no`);--> statement-breakpoint
CREATE INDEX `idx_student_search_name` ON `students` (`name`);--> statement-breakpoint
CREATE TABLE `subjects` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text(20) NOT NULL,
	`code` text(4) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `subjects_name_unique` ON `subjects` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `subjects_code_unique` ON `subjects` (`code`);