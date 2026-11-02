ALTER TABLE `services` ADD `meta_title` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `services` ADD `meta_description` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `services` ADD `faqs` text DEFAULT '[]' NOT NULL;