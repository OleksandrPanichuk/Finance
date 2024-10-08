import { Button, Checkbox } from '@/components/ui'
import { hono } from '@/lib'
import { ColumnDef } from '@tanstack/react-table'
import { InferResponseType } from 'hono'
import { ArrowUpDown } from 'lucide-react'
import { Actions } from './actions'

export type ResponseType = InferResponseType<
	typeof hono.api.accounts.$get,
	200
>['data'][0]

export const columns: ColumnDef<ResponseType>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && 'indeterminate')
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false
	},
	{
		accessorKey: 'name',
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				Name
				<ArrowUpDown className="size-4 ml-2" />
			</Button>
		)
	},
	{
		id: 'actions',
		cell: ({ row }) => <Actions id={row.original.id} />
	}
]
