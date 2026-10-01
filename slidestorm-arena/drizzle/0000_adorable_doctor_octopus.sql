CREATE TABLE `players` (
	`id` text PRIMARY KEY NOT NULL,
	`room` text NOT NULL,
	`seat` integer NOT NULL,
	`name` text NOT NULL,
	`token_hash` text NOT NULL,
	`score` integer,
	`won` integer,
	`elapsed` integer,
	`submitted` integer,
	FOREIGN KEY (`room`) REFERENCES `rooms`(`code`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `players_room_seat` ON `players` (`room`,`seat`);--> statement-breakpoint
CREATE INDEX `players_token_hash` ON `players` (`token_hash`);--> statement-breakpoint
CREATE INDEX `players_score` ON `players` (`score`);--> statement-breakpoint
CREATE TABLE `rooms` (
	`code` text PRIMARY KEY NOT NULL,
	`sport` text NOT NULL,
	`level` integer NOT NULL,
	`seed` integer NOT NULL,
	`created` integer NOT NULL,
	`expires` integer NOT NULL
);
