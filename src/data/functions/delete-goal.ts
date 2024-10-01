import { db } from '@/db/drizzle'
import { goals } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function deleteGoal({ goalId }: { goalId: string }) {
	await db.delete(goals).where(eq(goals.id, goalId))
}
