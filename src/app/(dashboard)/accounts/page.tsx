'use client'
import { DataTable } from '@/components/common'
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Skeleton
} from '@/components/ui'
import {
	useBulkDeleteAccounts,
	useGetAccounts,
	useNewAccount
} from '@/features/accounts'
import { PlaidLink } from '@/features/plaid'
import { Loader2, Plus } from 'lucide-react'
import { columns } from './columns'

const AccountsPage = () => {
	const { onOpen } = useNewAccount()
	const { data, isLoading } = useGetAccounts()
	const { isPending, mutate: deleteAccounts } = useBulkDeleteAccounts()

	const isDisabled = isLoading || isPending

	if (isLoading) {
		return (
			<div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
				<Card className="border-none drop-shadow-sm">
					<CardHeader>
						<Skeleton className="h-8 w-48" />
					</CardHeader>
					<CardContent>
						<div className="h-[500px] w-full flex items-center justify-center">
							<Loader2 className="size-6 text-slay-300 animate-spin" />
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
			<Card className="border-none drop-shadow-sm">
				<CardHeader className="gap-y-2 md:flex-row md:items-center md:justify-between">
					<CardTitle className="text-xl line-clamp-1">Accounts</CardTitle>
					<div className="flex flex-col items-center gap-x-2 gap-y-2 lg:flex-row">
						<PlaidLink />
						<Button size="sm" onClick={onOpen}>
							<Plus className="size-4 mr-2" />
							Add new
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<DataTable
						filterKey="name"
						columns={columns}
						data={data ?? []}
						onDelete={(row) => {
							const ids = row.map((r) => r.original.id)

							deleteAccounts({ ids })
						}}
						disabled={isDisabled}
					/>
				</CardContent>
			</Card>
		</div>
	)
}

export default AccountsPage
