import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const userTable = pgTable('users', {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar('name', { length: 50 }).notNull(),
    email: varchar('email', { length: 100 }).notNull().unique(),
    password: text().notNull(),
    salt: text().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
});