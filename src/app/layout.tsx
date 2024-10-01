import './globals.css'

import { CreateGoalDialog } from '@/components/create-goal-dialog'
import { Dialog } from '@/components/ui/dialog'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { registerGoal } from './actions'

const inter = Inter({
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
		<html lang="pt-BR" className={`${inter.variable}`}>
			<body className="flex min-h-dvh flex-col bg-zinc-950 text-zinc-50">
				<Dialog>
					{children}
					<CreateGoalDialog action={registerGoal} />
				</Dialog>
			</body>
		</html>
	)
}
