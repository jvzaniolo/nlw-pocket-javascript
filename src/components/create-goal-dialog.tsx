'use client'

import { X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useActionState } from 'react'
import { Button } from '#src/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from '#src/components/ui/dialog'
import { Input } from '#src/components/ui/input'
import { Label } from '#src/components/ui/label'
import { RadioGroup, RadioGroupIndicator, RadioGroupItem } from '#src/components/ui/radio-group'

export function CreateGoalDialog({
	action,
}: {
	action: (state: unknown, formData: FormData) => void
}) {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [state, formAction, isPending] = useActionState(action, null)

	const isOpen = searchParams.get('create-goal') === 'true'

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && router.back()}>
			<DialogContent>
				<form action={formAction} className="flex h-full flex-col">
					<div className="space-y-6 overflow-y-auto">
						<div className="mb-3 flex items-center justify-between">
							<DialogTitle>Cadastrar meta</DialogTitle>
							<DialogClose className="cursor-pointer rounded p-0.5 text-zinc-600 transition-colors hover:bg-zinc-100/10">
								<X className="size-5" />
							</DialogClose>
						</div>

						<DialogDescription>
							Adicione atividades que{' '}
							<span className="underline underline-offset-4">te fazem bem</span> e que você quer
							continuar praticando toda semana.
						</DialogDescription>

						<div>
							<Label htmlFor="title">Qual a atividade?</Label>
							<Input
								id="title"
								name="title"
								className="w-full"
								placeholder="Praticar exercícios, meditar, etc..."
								required
							/>
						</div>

						<div>
							<Label htmlFor="title">Quantas vezes na semana?</Label>

							<RadioGroup name="desiredWeeklyFrequency" required>
								<RadioGroupItem value="1">
									<RadioGroupIndicator />
									<span className="font-medium text-sm text-zinc-300">1x na semana</span>
									<span className="select-none">🥱</span>
								</RadioGroupItem>

								<RadioGroupItem value="2">
									<RadioGroupIndicator />
									<span className="font-medium text-sm text-zinc-300">2x na semana</span>
									<span className="select-none">🙂</span>
								</RadioGroupItem>

								<RadioGroupItem value="3">
									<RadioGroupIndicator />
									<span className="font-medium text-sm text-zinc-300">3x na semana</span>
									<span className="select-none">😎</span>
								</RadioGroupItem>

								<RadioGroupItem value="4">
									<RadioGroupIndicator />
									<span className="font-medium text-sm text-zinc-300">4x na semana</span>
									<span className="select-none">🤩</span>
								</RadioGroupItem>

								<RadioGroupItem value="5">
									<RadioGroupIndicator />
									<span className="font-medium text-sm text-zinc-300">5x na semana</span>
									<span className="select-none">🚀</span>
								</RadioGroupItem>

								<RadioGroupItem value="6">
									<RadioGroupIndicator />
									<span className="font-medium text-sm text-zinc-300">6x na semana</span>
									<span className="select-none">🔥</span>
								</RadioGroupItem>

								<RadioGroupItem value="7">
									<RadioGroupIndicator />
									<span className="font-medium text-sm text-zinc-300">Todos os dias</span>
									<span className="select-none">🌟</span>
								</RadioGroupItem>
							</RadioGroup>
						</div>
					</div>

					<div className="mt-auto flex items-center gap-3 pt-6">
						<DialogClose asChild>
							<Button variant="secondary" className="w-full" disabled={isPending}>
								Fechar
							</Button>
						</DialogClose>
						<Button className="w-full disabled:opacity-70" disabled={isPending}>
							Salvar
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
