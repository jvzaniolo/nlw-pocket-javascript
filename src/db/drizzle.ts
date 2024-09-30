import { createPool } from '@vercel/postgres'
import { drizzle } from 'drizzle-orm/vercel-postgres'
import * as schema from './schema'

export const sql = createPool({
	connectionString: process.env.POSTGRES_URL,
})

export const db = drizzle(sql, { schema, logger: process.env.NODE_ENV === 'development' })
