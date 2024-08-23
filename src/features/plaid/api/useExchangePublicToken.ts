import { InferRequestType, InferResponseType } from 'hono'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { hono } from '@/lib'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
	typeof hono.api.plaid.token.exchange.$post
>
type RequestType = InferRequestType<
	typeof hono.api.plaid.token.exchange.$post
>['json']

export const useExchangePublicToken = () => {
	const queryClient = useQueryClient()

	return useMutation<ResponseType, Error, RequestType>({
		mutationFn: async (json) => {
			const response = await hono.api.plaid.token.exchange.$post({ json })
			return await response.json()
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['accounts'] })
		},
		onError: () => {
			toast.error('Something went wrong')
		}
	})
}
