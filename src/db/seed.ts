import dayjs from 'dayjs'
import postgres from 'postgres'
import { db } from './drizzle'
import { goalCompletions, goals } from './schema'

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not set')
}

const client = postgres(process.env.DATABASE_URL)

async function seed() {
	await db.delete(goalCompletions)
	await db.delete(goals)

	const result = await db
		.insert(goals)
		.values([
			{ title: 'Reed book', desiredWeeklyFrequency: 5 },
			{ title: 'Exercise', desiredWeeklyFrequency: 3 },
			{ title: 'Meditate', desiredWeeklyFrequency: 7 },
		])
		.returning()

	const startOfWeek = dayjs().startOf('week')

	await db.insert(goalCompletions).values([
		{ goalId: result[0].id, createdAt: startOfWeek.toDate() },
		{ goalId: result[1].id, createdAt: startOfWeek.add(1, 'day').toDate() },
	])
}

seed().finally(() => client.end())
