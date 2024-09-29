'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createGoal } from '#src/data/functions/create-goal'

export async function registerGoal(state: unknown, formData: FormData) {
	const createGoalSchema = z.object({
		title: z.string().min(1),
		desiredWeeklyFrequency: z.coerce.number().min(1).max(7),
	})

	const { title, desiredWeeklyFrequency } = createGoalSchema.parse(Object.fromEntries(formData))

	await createGoal({
		title,
		desiredWeeklyFrequency,
	})

	redirect('/')
}
