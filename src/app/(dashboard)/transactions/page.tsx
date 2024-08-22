'use client'

import { Loader2, Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { DataTable } from '@/components/common'
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Skeleton
} from '@/components/ui'
import { useSelectAccount } from '@/features/accounts'
import {
	columns,
	ImportCard,
	UploadButton,
	useBulkCreateTransactions,
	useBulkDeleteTransactions,
	useGetTransactions,
	useNewTransaction
} from '@/features/transactions'
import { transactions as transactionSchema } from '@db/schema'

enum VARIANTS {
	LIST = 'LIST',
	IMPORT = 'IMPORT'
}

const INITIAL_IMPORT_RESULTS = {
	data: [],
	errors: [],
	meta: []
}

const TransactionsPage = () => {
	const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST)
	const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS)

	const [AccountDialog, confirm] = useSelectAccount()
	const newTransaction = useNewTransaction()
	const createTransactions = useBulkCreateTransactions()
	const deleteTransactions = useBulkDeleteTransactions()
	const transactionsQuery = useGetTransactions()
	const transactions = transactionsQuery.data || []

	const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
		setImportResults(results)
		setVariant(VARIANTS.IMPORT)
	}

	const onCancelImport = () => {
		setImportResults(INITIAL_IMPORT_RESULTS)
		setVariant(VARIANTS.LIST)
	}

	const onSubmitImport = async (
		values: (typeof transactionSchema.$inferInsert)[]
	) => {
		const accountId = await confirm()

		if (!accountId) {
			return toast.error('Please select an account to continue.')
		}

		const data = values.map((value) => ({
			...value,
			accountId: accountId as string
		}))

		createTransactions.mutate(data, {
			onSuccess: () => {
				onCancelImport()
			}
		})
	}

	const isDisabled = transactionsQuery.isLoading || deleteTransactions.isPending

	if (transactionsQuery.isLoading) {
		return (
			<div className="mx-auto -mt-6 w-full max-w-screen-2xl pb-10">
				<Card className="border-none drop-shadow-sm">
					<CardHeader>
						<Skeleton className="h-8 w-48" />
					</CardHeader>

					<CardContent>
						<div className="flex h-[500px] w-full items-center justify-center">
							<Loader2 className="size-6 animate-spin text-slate-300" />
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	if (variant === VARIANTS.IMPORT) {
		return (
			<>
				<AccountDialog />

				<ImportCard
					data={importResults.data}
					onCancel={onCancelImport}
					onSubmit={onSubmitImport}
				/>
			</>
		)
	}

	return (
		<div className="mx-auto -mt-6 w-full max-w-screen-2xl pb-10">
			<Card className="border-none drop-shadow-sm">
				<CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
					<CardTitle className="line-clamp-1 text-xl">
						Transaction History
					</CardTitle>

					<div className="flex flex-col items-center gap-x-2 gap-y-2 lg:flex-row">
						<Button
							size="sm"
							onClick={newTransaction.onOpen}
							className="w-full lg:w-auto"
						>
							<Plus className="mr-2 size-4" /> Add new
						</Button>

						<UploadButton onUpload={onUpload} />
					</div>
				</CardHeader>

				<CardContent>
					<DataTable
						filterKey="payee"
						columns={columns}
						data={transactions}
						onDelete={(row) => {
							const ids = row.map((r) => r.original.id)

							deleteTransactions.mutate({ ids })
						}}
						disabled={isDisabled}
					/>
				</CardContent>
			</Card>
		</div>
	)
}

export default TransactionsPage