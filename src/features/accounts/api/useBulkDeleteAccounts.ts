import { InferRequestType, InferResponseType } from 'hono'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { hono } from '@/lib'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
	(typeof hono.api.accounts)['bulk-delete']['$post']
>
type RequestType = InferRequestType<
	(typeof hono.api.accounts)['bulk-delete']['$post']
>['json']

export const useBulkDeleteAccounts = () => {
	const queryClient = useQueryClient()

	return useMutation<ResponseType, Error, RequestType>({
		mutationFn: async (json) => {
			const response = await hono.api.accounts['bulk-delete']['$post']({ json })
			return await response.json()
		},
		onSuccess: () => {
			toast.success('Accounts deleted')
			queryClient.invalidateQueries({ queryKey: ['accounts'] })
			queryClient.invalidateQueries({ queryKey: ['summary'] })
		},
		onError: () => {
			toast.error('Failed to delete accounts')
		}
	})
}
