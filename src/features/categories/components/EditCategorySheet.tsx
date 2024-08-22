import { Loader2 } from 'lucide-react'
import { z } from 'zod'

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle
} from '@/components/ui'
import {
	CategoryForm,
	useDeleteCategory,
	useEditCategory,
	useGetCategory,
	useOpenCategory
} from '@/features/categories'
import { useConfirm } from '@/hooks'
import { insertCategorySchema } from '@db/schema'

const formSchema = insertCategorySchema.pick({
	name: true
})

type FormValues = z.infer<typeof formSchema>

export const EditCategorySheet = () => {
	const { isOpen, onClose, id } = useOpenCategory()

	const [ConfirmDialog, confirm] = useConfirm(
		'Are you sure?',
		'You are about to delete this category.'
	)

	const categoryQuery = useGetCategory(id)
	const editMutation = useEditCategory(id)
	const deleteMutation = useDeleteCategory(id)

	const isPending = editMutation.isPending || deleteMutation.isPending

	const isLoading = categoryQuery.isLoading

	const onSubmit = (values: FormValues) => {
		editMutation.mutate(values, {
			onSuccess: () => {
				onClose()
			}
		})
	}

	const defaultValues = categoryQuery.data
		? {
				name: categoryQuery.data.name
			}
		: {
				name: ''
			}

	const onDelete = async () => {
		const ok = await confirm()

		if (ok) {
			deleteMutation.mutate(undefined, {
				onSuccess: () => {
					onClose()
				}
			})
		}
	}

	return (
		<>
			<ConfirmDialog />
			<Sheet open={isOpen || isPending} onOpenChange={onClose}>
				<SheetContent className="space-y-4">
					<SheetHeader>
						<SheetTitle>Edit Category</SheetTitle>

						<SheetDescription>Edit an existing category.</SheetDescription>
					</SheetHeader>

					{isLoading ? (
						<div className="absolute inset-0 flex items-center justify-center">
							<Loader2 className="size-4 animate-spin text-muted-foreground" />
						</div>
					) : (
						<CategoryForm
							id={id}
							defaultValues={defaultValues}
							onSubmit={onSubmit}
							disabled={isPending}
							onDelete={onDelete}
						/>
					)}
				</SheetContent>
			</Sheet>
		</>
	)
}
