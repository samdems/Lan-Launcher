import { serial, mysqlTable, text } from "drizzle-orm/mysql-core";
import { z } from 'zod';
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from 'drizzle-zod';

export const gamesTable = mysqlTable("games", {
  id: serial().primaryKey(),
  name: text().notNull(),
});

export const gamesSelectSchema = createSelectSchema(gamesTable);
export const gamesInsertSchema = createInsertSchema(gamesTable, {
  name: gamesSelectSchema.shape.name,
});
export const gamesUpdateSchema = createUpdateSchema(gamesTable, {
  id: gamesSelectSchema.shape.id,
  name: gamesInsertSchema.shape.name,
});

