CREATE TABLE `clicks` (
	`id` text PRIMARY KEY NOT NULL,
	`short_url` text NOT NULL,
	`clicked_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`referer` text,
	`user_agent` text,
	`country` text,
	`region` text,
	`hashed_ip` text,
	`browser` text,
	`os` text,
	`is_mobile` integer
);
