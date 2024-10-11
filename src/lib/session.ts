import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { cache } from 'react'

type SessionPayload = {
	userId: string
	expiresAt: Date
}

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: SessionPayload) {
	return new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('7d')
		.sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
	try {
		const { payload } = await jwtVerify(session, encodedKey, {
			algorithms: ['HS256'],
		})
		return payload
	} catch (error) {
		console.log('Failed to verify session')
	}
}

export async function createSession(userId: string) {
	const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
	const session = await encrypt({ userId, expiresAt })

	cookies().set('session', session, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		expires: expiresAt,
		sameSite: 'lax',
		path: '/',
	})
}

export function deleteSession() {
	cookies().delete('session')
}

export const verifySession = cache(async () => {
	const cookie = cookies().get('session')?.value
	const session = (await decrypt(cookie)) as SessionPayload | undefined

	if (!session?.userId) {
		redirect('/login')
	}

	return { userId: session.userId }
})
