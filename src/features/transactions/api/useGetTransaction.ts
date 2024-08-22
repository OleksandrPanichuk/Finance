import { useQuery } from '@tanstack/react-query'

import { convertAmountFromMilliunits, hono } from '@/lib'

export const useGetTransaction = (id?: string) => {
	const query = useQuery({
		enabled: !!id,
		queryKey: ['transaction', { id }],
		queryFn: async () => {
			const response = await hono.api.transactions[':id'].$get({
				param: { id }
			})

			if (!response.ok) throw new Error('Failed to fetch transaction.')

			const { data } = await response.json()

			return {
				...data,
				amount: convertAmountFromMilliunits(data.amount)
			}
		}
	})

	return query
}
