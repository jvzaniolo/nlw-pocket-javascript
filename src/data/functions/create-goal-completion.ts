import dayjs from 'dayjs'
import { and, count, eq, gte, lte, sql } from 'drizzle-orm'
import { db } from '#src/db/drizzle'
import { goalCompletions, goals } from '#src/db/schema'

interface CreateGoalCompletionRequest {
	goalId: string
}

export async function createGoalCompletion({ goalId }: CreateGoalCompletionRequest) {
	const firstDayOfWeek = dayjs().startOf('week').toDate()
	const lastDayOfWeek = dayjs().endOf('week').toDate()

	const goalsCompletionCount = db.$with('goals_completion_count').as(
		db
			.select({
				goalId: goalCompletions.goalId,
				completionCount: count(goalCompletions.id).as('completionCount'),
			})
			.from(goalCompletions)
			.where(
				and(
					gte(goalCompletions.createdAt, firstDayOfWeek),
					lte(goalCompletions.createdAt, lastDayOfWeek),
					eq(goalCompletions.id, goalId)
				)
			)
			.groupBy(goalCompletions.id)
	)

	const [goal] = await db
		.with(goalsCompletionCount)
		.select({
			desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
			completionCount: sql`coalesce(${goalsCompletionCount.completionCount}, 0)`.mapWith(Number),
		})
		.from(goals)
		.leftJoin(goalsCompletionCount, eq(goalsCompletionCount.goalId, goals.id))
		.where(eq(goals.id, goalId))

	if (goal.completionCount >= goal.desiredWeeklyFrequency) {
		throw new Error('Goal already completed for the week')
	}

	const [goalCompletion] = await db.insert(goalCompletions).values({ goalId }).returning()

	return { goalCompletion }
}
