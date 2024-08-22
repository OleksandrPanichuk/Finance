'use client'

import { Edit, MoreHorizontal, Trash } from 'lucide-react'

import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui'
import { useDeleteAccount, useOpenAccount } from '@/features/accounts'
import { useConfirm } from '@/hooks'

type ActionsProps = {
	id: string
}

export const Actions = ({ id }: ActionsProps) => {
	const deleteMutation = useDeleteAccount(id)
	const { onOpen } = useOpenAccount()

	const [ConfirmDialog, confirm] = useConfirm(
		'Are you sure?',
		'You are about to delete this account.'
	)

	const handleDelete = async () => {
		const ok = await confirm()

		if (ok) {
			deleteMutation.mutate()
		}
	}

	return (
		<>
			<ConfirmDialog />
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="size-8 p-0">
						<MoreHorizontal className="size-4" />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end">
					<DropdownMenuItem
						disabled={deleteMutation.isPending}
						onClick={() => onOpen(id)}
					>
						<Edit className="mr-2 size-4" />
						Edit
					</DropdownMenuItem>

					<DropdownMenuItem
						disabled={deleteMutation.isPending}
						onClick={handleDelete}
					>
						<Trash className="mr-2 size-4" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	)
}
