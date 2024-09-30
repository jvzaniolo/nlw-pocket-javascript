import { Plus } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import { createGoalCompletion } from '#src/data/functions/create-goal-completion'
import { getWeekPendingGoals } from '#src/data/functions/get-week-pending-goals'
import { OutlineButton } from './ui/outline-button'

export async function PendingGoals() {
	const { pendingGoals } = await getWeekPendingGoals()

	async function completeGoal(formData: FormData) {
		'use server'
		await createGoalCompletion({ goalId: formData.get('goalId') as string })
		revalidatePath('/')
	}

	return (
		<form action={completeGoal} className="flex flex-wrap gap-3">
			{pendingGoals.map((goal) => {
				return (
					<span key={goal.id}>
						<input type="hidden" name="goalId" value={goal.id} className="sr-only" />
						<OutlineButton disabled={goal.completionCount >= goal.desiredWeeklyFrequency}>
							<Plus className="size-4 text-zinc-600" />
							{goal.title}
						</OutlineButton>
					</span>
				)
			})}
		</form>
	)
}
