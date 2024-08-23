'use client'
import { Header } from '@/components/common'
import { useImportTransactions } from '@/features/plaid'
import { PropsWithChildren, useEffect } from 'react'

const DashboardLayout = ({ children }: PropsWithChildren) => {
	const { mutate: importTransactions } = useImportTransactions()
	useEffect(() => {
		importTransactions()
	}, [importTransactions])
	return (
		<>
			<Header />
			<main className="px-3 lg:px-14">{children}</main>
		</>
	)
}

export default DashboardLayout
