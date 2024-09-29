import dayjs from 'dayjs'
import { and, count, eq, gte, lte, sql } from 'drizzle-orm'
import { db } from '#src/db/drizzle'
import { goalCompletions, goals } from '#src/db/schema'

export async function getWeekPendingGoals() {
	const firstDayOfWeek = dayjs().startOf('week').toDate()
	const lastDayOfWeek = dayjs().endOf('week').toDate()

	const goalsCreatedUpToCurrentWeek = db.$with('goals_created_up_to_current_week').as(
		db
			.select({
				id: goals.id,
				title: goals.title,
				desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
				createdAt: goals.createdAt,
			})
			.from(goals)
			.where(lte(goals.createdAt, lastDayOfWeek))
	)

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
					lte(goalCompletions.createdAt, lastDayOfWeek)
				)
			)
			.groupBy(goalCompletions.id)
	)

	const pendingGoals = await db
		.with(goalsCreatedUpToCurrentWeek, goalsCompletionCount)
		.select({
			id: goalsCreatedUpToCurrentWeek.id,
			title: goalsCreatedUpToCurrentWeek.title,
			desiredWeeklyFrequency: goalsCreatedUpToCurrentWeek.desiredWeeklyFrequency,
			completionCount: sql`coalesce(${goalsCompletionCount.completionCount}, 0)`.mapWith(Number),
		})
		.from(goalsCreatedUpToCurrentWeek)
		.leftJoin(goalsCompletionCount, eq(goalsCompletionCount.goalId, goalsCreatedUpToCurrentWeek.id))

	return { pendingGoals }
}
