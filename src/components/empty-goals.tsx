import { Plus } from 'lucide-react'
import { Button } from '#src/components/ui/button'
import { DialogTrigger } from '#src/components/ui/dialog'

export function EmptyGoals() {
	return (
		<div className="mx-auto flex max-w-xs grow flex-col items-center justify-center">
			<p className="mb-5 text-center text-zinc-300">
				Você ainda não cadastrou nenhuma meta, que tal cadastrar uma agora mesmo?
			</p>

			<DialogTrigger asChild>
				<Button>
					<Plus className="size-4" />
					Cadastrar meta
				</Button>
			</DialogTrigger>
		</div>
	)
}
