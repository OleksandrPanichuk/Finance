import { InferRequestType, InferResponseType } from 'hono'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { hono } from '@/lib'
import { toast } from 'sonner'

type ResponseType = InferResponseType<typeof hono.api.accounts.$post>
type RequestType = InferRequestType<typeof hono.api.accounts.$post>['json']

export const useCreateAccount = () => {
	const queryClient = useQueryClient()

	return useMutation<ResponseType, Error, RequestType>({
		mutationFn: async (json) => {
			const response = await hono.api.accounts.$post({ json })
			return await response.json()
		},
		onSuccess: () => {
			toast.success('Account created')
			queryClient.invalidateQueries({ queryKey: ['accounts'] })
		},
		onError: () => {
			toast.error('Failed to create account')
		}
	})
}
