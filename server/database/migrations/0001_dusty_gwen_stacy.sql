ALTER TABLE `inquiries` ADD `kind` text DEFAULT 'project' NOT NULL;--> statement-breakpoint
ALTER TABLE `inquiries` ADD `details` text DEFAULT '{}' NOT NULL;