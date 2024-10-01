import './globals.css'

import type { Metadata } from 'next'
import { Inter_Tight } from 'next/font/google'
import { CreateGoalDialog } from '#src/components/create-goal-dialog'
import { Dialog } from '#src/components/ui/dialog'
import { registerGoal } from './actions'

const inter_tight = Inter_Tight({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-inter-tight',
})

export const metadata: Metadata = {
	title: 'in.orbit',
	description: 'Alcance seus objetivos',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="pt-BR" className={`${inter_tight.variable}`}>
			<body className="flex min-h-dvh flex-col bg-zinc-950 text-zinc-50">
				<Dialog>
					{children}
					<CreateGoalDialog action={registerGoal} />
				</Dialog>
			</body>
		</html>
	)
}
