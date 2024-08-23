import { InferResponseType } from 'hono'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { hono } from '@/lib'

type ResponseType = InferResponseType<typeof hono.api.plaid.transactions.$post>

export const useImportTransactions = () => {
	const queryClient = useQueryClient()

	return useMutation<ResponseType, Error>({
		mutationFn: async () => {
			const response = await hono.api.plaid.transactions.$post()
			return await response.json()
		},
		onSuccess: (data) => {
			if ('success' in data) {
				queryClient.invalidateQueries({ queryKey: ['transactions'] })
				queryClient.invalidateQueries({ queryKey: ['summary'] })
				queryClient.invalidateQueries({ queryKey: ['categories'] })
			}
		}
	})
}
