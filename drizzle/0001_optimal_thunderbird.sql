DROP TABLE `task`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_staff` (
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
INSERT INTO `__new_staff`("emp_id", "name", "status", "designation", "email", "phone_no", "date_of_birth", "date_of_joining", "qualification", "primary_subject", "user_id", "is_active", "created_at", "updated_at") SELECT "emp_id", "name", "status", "designation", "email", "phone_no", "date_of_birth", "date_of_joining", "qualification", "primary_subject", "user_id", "is_active", "created_at", "updated_at" FROM `staff`;--> statement-breakpoint
DROP TABLE `staff`;--> statement-breakpoint
ALTER TABLE `__new_staff` RENAME TO `staff`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `staff_emp_id_unique` ON `staff` (`emp_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `staff_email_unique` ON `staff` (`email`);