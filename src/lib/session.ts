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
		.setIssuedAt()
		.setExpirationTime('7d')
		.sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
	try {
		const { payload } = await jwtVerify(session, encodedKey)
		return payload
	} catch (error) {
		console.log('Failed to verify session')
	}
}

export async function createSession(userId: string) {
	const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
	const session = await encrypt({ userId, expiresAt })

	// TODO: Create a secure cookie with the session token
}

export async function verifySession() {
	// TODO: Get the session token from the cookie and return the userId
}
