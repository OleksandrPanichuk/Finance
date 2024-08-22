'use client'

import { Edit, MoreHorizontal, Trash } from 'lucide-react'

import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui'
import {
	useDeleteTransaction,
	useOpenTransaction
} from '@/features/transactions'
import { useConfirm } from '@/hooks'

type ActionsProps = {
	id: string
}

export const Actions = ({ id }: ActionsProps) => {
	const deleteMutation = useDeleteTransaction(id)
	const { onOpen } = useOpenTransaction()

	const [ConfirmDialog, confirm] = useConfirm(
		'Are you sure?',
		'You are about to delete this transaction.'
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
