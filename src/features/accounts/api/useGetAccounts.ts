import { hono } from '@/lib'
import { useQuery } from '@tanstack/react-query'

export const useGetAccounts = () => {
	return useQuery({
		queryKey: ['accounts'],
		queryFn: async () => {
			const response = await hono.api.accounts.$get()

			if (!response.ok) {
				throw new Error('Failed to fetch accounts')
			}

			const { data } = await response.json()
			return data
		}
	})
}
