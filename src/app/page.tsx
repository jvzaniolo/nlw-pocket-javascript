import { Plus } from 'lucide-react'
import Link from 'next/link'
import { button } from '#src/components/ui/button'
import { WeeklySummary } from '#src/components/weekly-summary'
import { getWeekSummary } from '#src/data/functions/get-week-summary'

export default async function Home() {
	const { summary } = await getWeekSummary()

	return summary.total > 0 ? <WeeklySummary summary={summary} /> : <EmptyGoals />
}

function EmptyGoals() {
	return (
		<div className="mx-auto flex max-w-xs grow flex-col items-center justify-center">
			<p className="mb-5 text-center text-zinc-300">
				Você ainda não cadastrou nenhuma meta, que tal cadastrar uma agora mesmo?
			</p>

			<Link href="/?create-goal=true" className={button()}>
				<Plus size={16} />
				Cadastrar meta
			</Link>
		</div>
	)
}
