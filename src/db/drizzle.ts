import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not set')
}

export const client = postgres(process.env.DATABASE_URL)

export const db = drizzle(client, { schema, logger: process.env.NODE_ENV === 'development' })
