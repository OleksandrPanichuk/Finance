import { Header } from '@/components/common'
import { PropsWithChildren } from 'react'

const DashboardLayout = ({ children }: PropsWithChildren) => {
	return (
		<>
			<Header />
			<main className='px-3 lg:px-14'>{children}</main>
		</>
	)
}

export default DashboardLayout
