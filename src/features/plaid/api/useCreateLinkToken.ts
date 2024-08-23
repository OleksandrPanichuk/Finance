import { InferRequestType, InferResponseType } from 'hono'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { hono } from '@/lib'
import { toast } from 'sonner'

type ResponseType = InferResponseType<typeof hono.api.plaid.token.link.$post>

export const useCreateLinkToken = ({onSuccess}:{onSuccess?:(token:string) => void} = {}) => {
	const queryClient = useQueryClient()

	return useMutation<ResponseType, Error>({
		mutationFn: async () => {
			const response = await hono.api.plaid.token.link.$post()
			return await response.json()
		},
		onSuccess: (data) => {

			if('linkToken' in data) {
				onSuccess?.(data.linkToken)
			}
		},
		onError: () => {
			toast.error('Failed to get plaid token')
		}
	})
}
