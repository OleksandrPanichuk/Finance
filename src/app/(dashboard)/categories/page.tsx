'use client'

import { Loader2, Plus } from 'lucide-react'

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
	useBulkDeleteCategories,
	useGetCategories,
	useNewCategory
} from '@/features/categories'

import { columns } from './columns'

const CategoriesPage = () => {
	const newCategory = useNewCategory()
	const deleteCategories = useBulkDeleteCategories()
	const categoriesQuery = useGetCategories()
	const categories = categoriesQuery.data || []

	const isDisabled = categoriesQuery.isLoading || deleteCategories.isPending

	if (categoriesQuery.isLoading) {
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

	return (
		<div className="mx-auto -mt-6 w-full max-w-screen-2xl pb-10">
			<Card className="border-none drop-shadow-sm">
				<CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
					<CardTitle className="line-clamp-1 text-xl">
						Categories Page
					</CardTitle>

					<Button size="sm" onClick={newCategory.onOpen}>
						<Plus className="mr-2 size-4" /> Add new
					</Button>
				</CardHeader>

				<CardContent>
					<DataTable
						filterKey="name"
						columns={columns}
						data={categories}
						onDelete={(row) => {
							const ids = row.map((r) => r.original.id)

							deleteCategories.mutate({ ids })
						}}
						disabled={isDisabled}
					/>
				</CardContent>
			</Card>
		</div>
	)
}

export default CategoriesPage
