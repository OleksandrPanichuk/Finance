import { Button } from '@/components/ui'
import Link from 'next/link'
import { cn } from '@/lib'

interface INavButtonProps {
	isActive?: boolean
	href: string
	label: string
}

export const NavButton = ({ href, isActive, label }: INavButtonProps) => {
	return (
		<Button
			asChild
			size={'sm'}
			variant={'outline'}
			className={cn(
				'w-full lg:w-auto justify-between font-normal hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition',
				isActive ? 'bg-white/10' : 'bg-transparent'
			)}
		>
			<Link href={href}>{label}</Link>
		</Button>
	)
}
