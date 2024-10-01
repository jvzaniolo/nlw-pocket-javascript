import { createGoalCompletion } from '@/data/functions/create-goal-completion'
import { deleteGoal } from '@/data/functions/delete-goal'
import { getWeekPendingGoals } from '@/data/functions/get-week-pending-goals'
import { Loader, Plus, Trash2 } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import { PendingButton } from './ui/pending-button'

export async function PendingGoals() {
	const { pendingGoals } = await getWeekPendingGoals()

	return (
		<div className="flex flex-wrap gap-3">
			{pendingGoals.map((goal) => {
				const isDisabled = goal.completionCount >= goal.desiredWeeklyFrequency

				return (
					<form key={goal.id} className="relative">
						<PendingButton
							type="submit"
							disabled={isDisabled}
							formAction={async () => {
								'use server'
								await createGoalCompletion({ goalId: goal.id })
								revalidatePath('/')
							}}
							className="group flex items-center gap-2 rounded-full border border-zinc-800 border-dashed px-3 py-2 text-sm text-zinc-300 leading-none outline-none ring-pink-500/10 hover:border-zinc-700 focus-visible:border-pink-500 focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50 aria-busy:pointer-events-none"
						>
							<Plus className="size-4 text-zinc-600 group-aria-busy:hidden" />
							<Loader className="hidden size-4 animate-spin text-zinc-600 group-aria-busy:inline" />
							{goal.title}
						</PendingButton>

						{isDisabled && (
							<PendingButton
								type="submit"
								formAction={async () => {
									'use server'
									await deleteGoal({ goalId: goal.id })
									revalidatePath('/')
								}}
								className="group absolute inset-0 z-10 flex cursor-pointer items-center justify-center gap-2 rounded-full border border-pink-700 bg-pink-700 px-3 py-2 text-sm opacity-0 transition-all duration-300 hover:opacity-100"
								title="Excluir meta"
								aria-label="Excluir meta"
							>
								<Trash2 className="size-4 shrink-0 group-aria-disabled:hidden" />
								<Loader className="hidden size-4 shrink-0 animate-spin group-aria-disabled:inline" />
							</PendingButton>
						)}
					</form>
				)
			})}
		</div>
	)
}
