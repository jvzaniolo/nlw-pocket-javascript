import { db } from '#src/db/drizzle'
import { goals } from '#src/db/schema'

interface CreateGoalRequest {
	title: string
	desiredWeeklyFrequency: number
}

export async function createGoal({ title, desiredWeeklyFrequency }: CreateGoalRequest) {
	const result = await db
		.insert(goals)
		.values({
			title,
			desiredWeeklyFrequency,
		})
		.returning()

	const goal = result[0]

	return {
		goal,
	}
}
