'use server'

import { authUser } from '@/data/functions/auth-user'
import { createSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export type FormState =
	| {
			errors?: {
				email?: string[]
				password?: string[]
			}
			message?: string
	  }
	| undefined

export async function login(state: FormState, formData: FormData) {
	const signUpSchema = z.object({
		email: z.string().email(),
		password: z.string().min(6),
	})

	const verifiedData = signUpSchema.safeParse(
		Object.fromEntries(formData.entries())
	)

	if (!verifiedData.success) {
		return {
			errors: verifiedData.error.flatten().fieldErrors,
		}
	}

	const result = await authUser(verifiedData.data)

	if ('message' in result) {
		return {
			message: result.message,
		}
	}

	await createSession(result.id)

	redirect('/')
}
