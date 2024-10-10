'use server'
import { createGoal } from '@/data/functions/create-goal'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export async function registerGoal(state: unknown, formData: FormData) {
	const createGoalSchema = z.object({
		title: z.string().min(1),
		desiredWeeklyFrequency: z.coerce.number().min(1).max(7),
	})

	const { title, desiredWeeklyFrequency } = createGoalSchema.parse(Object.fromEntries(formData))

	await createGoal({ title, desiredWeeklyFrequency })

	revalidatePath('/')
}
