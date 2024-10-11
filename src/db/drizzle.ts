import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

if (!process.env.POSTGRES_URL) {
	throw new Error('Please set the POSTGRES_URL environment variable')
}

export const client = postgres(process.env.POSTGRES_URL)
export const db = drizzle(client, { schema })
