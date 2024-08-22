import {
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	Input
} from '@/components/ui'
import { insertAccountSchema } from '@db/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = insertAccountSchema.pick({ name: true })

type FormValues = z.infer<typeof formSchema>

interface IAccountFormProps {
	id?: string
	defaultValues?: FormValues
	disabled?: boolean
	onSubmit: (values: FormValues) => void
	onDelete?: () => void
}

export const AccountForm = ({
	defaultValues,
	onDelete,
	disabled,
	onSubmit,
	id
}: IAccountFormProps) => {
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues
	})

	const handleSubmit = (values: FormValues) => {
		onSubmit(values);
	}

	const handleDelete = () => {
		onDelete?.()
	}

	return (
		<Form {...form}>
			<form
				className="space-y-4 pt-4"
				onSubmit={form.handleSubmit(handleSubmit)}
			>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input
									disabled={disabled}
									placeholder="e.g. Cash, Bank, Credit Card"
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<Button className="w-full" disabled={disabled}>
					{id ? 'Save changes' : 'Create account'}
				</Button>
				{!!id && (
					<Button
						type="button"
						disabled={disabled}
						onClick={handleDelete}
						className="w-full gap-2"
						variant="outline"
					>
						<Trash className="size-4" />
						Delete account
					</Button>
				)}
			</form>
		</Form>
	)
}
