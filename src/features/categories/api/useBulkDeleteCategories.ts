import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

import { hono } from '@/lib/hono'

type ResponseType = InferResponseType<
	(typeof hono.api.categories)['bulk-delete']['$post']
>
type RequestType = InferRequestType<
	(typeof hono.api.categories)['bulk-delete']['$post']
>['json']

export const useBulkDeleteCategories = () => {
	const queryClient = useQueryClient()

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async (json) => {
			const response = await hono.api.categories['bulk-delete']['$post']({
				json
			})
			return await response.json()
		},
		onSuccess: () => {
			toast.success('Categories deleted.')
			queryClient.invalidateQueries({ queryKey: ['categories'] })
			queryClient.invalidateQueries({ queryKey: ['summary'] })
		},
		onError: () => {
			toast.error('Failed to delete categories.')
		}
	})

	return mutation
}
