import dayjs from 'dayjs'
import { and, desc, eq, gte, lte, sql } from 'drizzle-orm'
import { cache } from 'react'
import { db } from '#src/db/drizzle'
import { goalCompletions, goals } from '#src/db/schema'

type GoalsPerDay = Record<
	string,
	{
		id: string
		title: string
		completedAt: string
	}[]
>

export const getWeekSummary = cache(async () => {
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

	const goalsCompletedThisWeek = db.$with('goals_completed_this_week').as(
		db
			.select({
				id: goalCompletions.id,
				title: goals.title,
				completedAt: goalCompletions.createdAt,
				completedAtDate: sql /*sql*/`
          DATE(${goalCompletions.createdAt})
        `.as('completedAtDate'),
			})
			.from(goalCompletions)
			.innerJoin(goals, eq(goals.id, goalCompletions.goalId))
			.where(
				and(
					gte(goalCompletions.createdAt, firstDayOfWeek),
					lte(goalCompletions.createdAt, lastDayOfWeek)
				)
			)
			.orderBy(desc(goalCompletions.createdAt))
	)

	const goalsCompletedByDay = db.$with('goals_completed_by_day').as(
		db
			.select({
				completedAtDate: goalsCompletedThisWeek.completedAtDate,
				completions: sql /*sql*/`
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', ${goalsCompletedThisWeek.id},
              'title', ${goalsCompletedThisWeek.title},
              'completedAt', ${goalsCompletedThisWeek.completedAt}
            )
          )
        `.as('completions'),
			})
			.from(goalsCompletedThisWeek)
			.groupBy(goalsCompletedThisWeek.completedAtDate)
			.orderBy(desc(goalsCompletedThisWeek.completedAtDate))
	)

	const [summary] = await db
		.with(goalsCreatedUpToCurrentWeek, goalsCompletedThisWeek, goalsCompletedByDay)
		.select({
			completed: sql /*sql*/`(SELECT COUNT(*) FROM ${goalsCompletedThisWeek})`.mapWith(Number),
			total:
				sql /*sql*/`(SELECT SUM(${goalsCreatedUpToCurrentWeek.desiredWeeklyFrequency}) FROM ${goalsCreatedUpToCurrentWeek})`.mapWith(
					Number
				),
			goalsPerDay: sql /*sql*/<GoalsPerDay>`
			JSON_OBJECT_AGG(
				${goalsCompletedByDay.completedAtDate},
				${goalsCompletedByDay.completions}
			)
		`,
		})
		.from(goalsCompletedByDay)

	return { summary }
})
