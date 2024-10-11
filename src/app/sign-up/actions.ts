'use server'

import { createUser } from '@/data/functions/create-user'
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

export async function signUp(state: FormState, formData: FormData) {
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

	const user = await createUser(verifiedData.data)

	if (!user) {
		return {
			message: 'Algo deu errado ao criar sua conta. Tente novamente.',
		}
	}

	await createSession(user.id)

	redirect('/')
}
