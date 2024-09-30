import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

if (!process.env.POSTGRES_URL) {
	throw new Error('POSTGRES_URL is not set')
}

export default defineConfig({
	schema: './src/db/schema.ts',
	out: './.migrations',
	dialect: 'postgresql',
	dbCredentials: { url: process.env.POSTGRES_URL },
})
