'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function SingUp() {
	// TODO: track action state

	return (
		<div className="mx-auto grid w-full max-w-md grow place-items-center px-4 py-8">
			{/* TODO: login action */}
			<form action="" className="w-full space-y-4">
				<h1 className="mb-2 text-2xl">Gerencie suas metas!</h1>
				<p className="mb-8 text-sm text-zinc-400">
					Crie sua conta para continuar
				</p>

				<div>
					<Label htmlFor="email">E-mail</Label>
					<Input
						type="email"
						name="email"
						id="email"
						placeholder="exemplo@email.com"
						className="w-full"
						required
					/>
					{/* TODO: Display error message */}
				</div>

				<div>
					<Label htmlFor="password">Senha</Label>
					<Input
						type="password"
						name="password"
						id="password"
						placeholder="*******"
						className="w-full"
						required
						minLength={6}
					/>
					{/* TODO: Display error message */}
				</div>

				{/* TODO: Display error message */}

				{/* TODO: Disable the button if is submitting form */}
				<Button className="mt-8 w-full">Entrar</Button>

				<p className="flex justify-center">
					<Link href="/sign-up" className=" text-violet-400">
						Ainda não tem uma conta? Crie uma agora!
					</Link>
				</p>
			</form>
		</div>
	)
}
