'use client'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle
} from '@/components/ui'
import {
	AccountForm,
	useCreateAccount,
	useNewAccount
} from '@/features/accounts'
import { insertAccountSchema } from '@db/schema'
import { z } from 'zod'

const formSchema = insertAccountSchema.pick({ name: true })

type FormValues = z.infer<typeof formSchema>

export const NewAccountSheet = () => {
	const { isOpen, onClose } = useNewAccount()

	const { mutate, isPending } = useCreateAccount()

	const onSubmit = (values: FormValues) =>
		mutate(values, {
			onSuccess: onClose
		})

	return (
		<Sheet open={isOpen} onOpenChange={onClose}>
			<SheetContent className={'space-y-4'}>
				<SheetHeader>
					<SheetTitle>New Account</SheetTitle>
					<SheetDescription>
						Create a new account to track your transactions.
					</SheetDescription>
				</SheetHeader>
				<AccountForm
					onSubmit={onSubmit}
					disabled={isPending}
					defaultValues={{ name: '' }}
				/>
			</SheetContent>
		</Sheet>
	)
}
