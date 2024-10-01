import { EmptyGoals } from '#src/components/empty-goals'
import { WeeklySummary } from '#src/components/weekly-summary'
import { getWeekSummary } from '#src/data/functions/get-week-summary'

export default async function Home() {
	const { summary } = await getWeekSummary()

	if (!summary.total || summary.total === 0) return <EmptyGoals />

	return <WeeklySummary summary={summary} />
}
