import { Button } from '@/components/ui'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import {
	PlaidLinkOnSuccess,
	PlaidLinkOptions,
	usePlaidLink
} from 'react-plaid-link'

import { useCreateLinkToken, useExchangePublicToken } from '../api'

export const PlaidLink = () => {
	const router = useRouter()

	const [token, setToken] = useState('')

	const { mutate: getLinkToken } = useCreateLinkToken({
		onSuccess: setToken
	})

	const { mutateAsync: exchangePublicToken } = useExchangePublicToken()

	useEffect(() => {
		getLinkToken()
	}, [getLinkToken])

	const onSuccess = useCallback<PlaidLinkOnSuccess>(
		async (publicToken: string) => {
			try {
				await exchangePublicToken({
					publicToken
				})
				router.push('/')
			} catch {}
		},
		[router, exchangePublicToken]
	)

	const config: PlaidLinkOptions = {
		token,
		onSuccess
	}

	const { open, ready } = usePlaidLink(config)

	return (
		<>
			<Button
				onClick={() => open()}
				disabled={!ready}
				size="sm"
				className="plaidlink-primary"
			>
				Connect bank
			</Button>
		</>
	)
}
