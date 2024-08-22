'use client'

import { EditAccountSheet, NewAccountSheet } from '@/features/accounts'
import { EditCategorySheet, NewCategorySheet } from '@/features/categories'
import {
	EditTransactionSheet,
	NewTransactionSheet
} from '@/features/transactions'
import { useMountedState } from 'react-use'

export const SheetProvider = () => {
	const isMounted = useMountedState()

	if (!isMounted) return null

	return (
		<>
			<NewAccountSheet />
			<NewCategorySheet />
			<NewTransactionSheet />
			<EditAccountSheet />
			<EditCategorySheet />
			<EditTransactionSheet />
		</>
	)
}
