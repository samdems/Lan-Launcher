import { Request, Response } from 'express';
import { gamesTable } from '../db/schema.js';
import { db } from '../db.js';
import { createSelectSchema } from 'drizzle-zod';

export default {

  create: async (req: Request, res: Response) => {
    await db.insert(gamesTable).values({ name: 'Hello World!' });
    res.send('Hello World!')
  },

  read: async (req: Request, res: Response) => {
    const gamesSelectSchema = createSelectSchema(gamesTable);
    const parsed: { id: number; } = gamesSelectSchema.parse(req.params.id);

    const results = await db.query.gamesTable.findFirst({
      where: (fields, { eq }) => eq(fields.id, parsed.id)
    });

    res.send(results)
  },

  update: (req: Request, res: Response) => {
    const id = req.params.id;

    res.send(id)
  },

  delete: (req: Request, res: Response) => {
    const id = req.params.id;

    res.send(id)
  },

  list: async (req: Request, res: Response) => {
    console.log('Fetching games from the database...');
    const games = await db.select().from(gamesTable);
    console.log('Games fetched:', games);
    res.json(games);
  },
}

