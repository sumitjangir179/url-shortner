import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { userTable } from "./user.model.js";

export const urlTable = pgTable('urls', {
    id: uuid().primaryKey().defaultRandom(),
    shortCode: varchar('short_code', { length: 50 }).notNull().unique(),
    targetUrl: text('target_url').notNull(),
    userId: uuid('user_id').notNull().references(() => userTable.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
});
