import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { QueryProvider, SheetProvider } from '@/providers'
import {Toaster} from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Finance',
	description: 'Finance is a perfect app to manage your finances',
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body className={inter.className}>
					<QueryProvider>
						<Toaster richColors />
						<SheetProvider />
						{children}
					</QueryProvider>
				</body>
			</html>
		</ClerkProvider>
	)
}
