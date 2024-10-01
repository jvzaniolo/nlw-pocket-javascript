import { Loader, Plus } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import { createGoalCompletion } from '#src/data/functions/create-goal-completion'
import { getWeekPendingGoals } from '#src/data/functions/get-week-pending-goals'
import { OutlineButton } from './ui/outline-button'

export async function PendingGoals() {
	const { pendingGoals } = await getWeekPendingGoals()

	return (
		<div className="flex flex-wrap gap-3">
			{pendingGoals.map((goal) => (
				<form
					key={goal.id}
					action={async () => {
						'use server'
						await createGoalCompletion({ goalId: goal.id })
						revalidatePath('/')
					}}
				>
					<OutlineButton
						className="group"
						disabled={goal.completionCount >= goal.desiredWeeklyFrequency}
					>
						<Plus className="size-4 text-zinc-600 group-aria-busy:hidden" />
						<Loader className="hidden size-4 animate-spin text-zinc-600 group-aria-busy:inline" />
						{goal.title}
					</OutlineButton>
				</form>
			))}
		</div>
	)
}
