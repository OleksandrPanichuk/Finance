import { convertAmountToMilliunits } from '@/lib'
import { plaidClient } from '@/lib/plaid'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@db/drizzle'
import { accounts, categories, transactions } from '@db/schema'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { zValidator } from '@hono/zod-validator'
import { format, subDays } from 'date-fns'
import { and, eq, isNotNull } from 'drizzle-orm'
import { Hono } from 'hono'
import { nanoid } from 'nanoid'
import {
	CountryCode,
	LinkTokenCreateRequest,
	Products,
	Transaction
} from 'plaid'
import { z } from 'zod'

const app = new Hono()
	.post('/token/link', clerkMiddleware(), async (c) => {
		const user = await currentUser()

		if (!user) {
			return c.json({ error: 'Unauthorized' }, 401)
		}

		const clientName =
			user.firstName && user.lastName
				? `${user.firstName} ${user.lastName}`
				: user.fullName ?? user.emailAddresses[0].emailAddress

		const tokenParams: LinkTokenCreateRequest = {
			user: {
				client_user_id: user?.id
			},
			client_name: clientName,
			products: ['auth'] as Products[],
			language: 'en',
			country_codes: ['US'] as CountryCode[]
		}

		const response = await plaidClient.linkTokenCreate(tokenParams)

		return c.json({ linkToken: response.data.link_token }, 200)
	})
	.post(
		'/token/exchange',
		clerkMiddleware(),
		zValidator('json', z.object({ publicToken: z.string() })),
		async (c) => {
			const auth = getAuth(c)

			if (!auth?.userId) {
				return c.json({ error: 'Unauthorized' }, 401)
			}

			const { publicToken } = c.req.valid('json')

			const response = await plaidClient.itemPublicTokenExchange({
				public_token: publicToken
			})

			const accessToken = response.data.access_token
			const itemId = response.data.item_id

			const accountsResponse = await plaidClient.accountsGet({
				access_token: accessToken
			})

			const plaidAccount = accountsResponse.data.accounts[0]

			const [account] = await db
				.insert(accounts)
				.values({
					id: nanoid(),
					userId: auth?.userId,
					plaidId: itemId,
					plaidAccountId: plaidAccount.account_id,
					plaidToken: accessToken,
					name: plaidAccount.name,
					isTransactionsImported: false
				})
				.returning()

			return c.json(
				{ accessToken: response.data.access_token, accountId: account.id },
				200
			)
		}
	)
	.post('/transactions', clerkMiddleware(), async (c) => {
		const auth = getAuth(c)

		if (!auth?.userId) {
			return c.json({ error: 'Unauthorized' }, 401)
		}

		const dbAccounts = await db
			.select({
				id: accounts.id,
				accessToken: accounts.plaidToken
			})
			.from(accounts)
			.where(
				and(
					eq(accounts.userId, auth.userId),
					isNotNull(accounts.isTransactionsImported),
					eq(accounts.isTransactionsImported, false),
					isNotNull(accounts.plaidToken)
				)
			)

		if (!dbAccounts.length) {
			return c.json({ noChange: true }, 200)
		}

		const allTransactions: (Transaction & { accountId: string })[] = []
		const allCategories = new Set<string>()

		await Promise.all(
			dbAccounts.map(async (account) => {
				if (!account.accessToken) {
					return
				}

				const endDate = new Date()
				const startDate = subDays(endDate, 365 * 4)

				const response = await plaidClient.transactionsGet({
					access_token: account.accessToken,
					end_date: format(endDate, 'yyyy-MM-dd'),
					start_date: format(startDate, 'yyyy-MM-dd')
				})

				const plaidTransactions = response.data.transactions.map((el) => ({
					...el,
					accountId: account.id
				}))

				const plaidCategories = plaidTransactions
					.map((transaction) => transaction.category?.[0])
					.filter(Boolean)

				plaidCategories.forEach((category) => {
					if (category) {
						allCategories.add(category)
					}
				})

				allTransactions.push(...plaidTransactions)
			})
		)

		const allCategoriesArray = Array.from(allCategories)

		const dbCategories = await Promise.all(
			allCategoriesArray.map(async (el) => {
				const [existingValue] = await db
					.select()
					.from(categories)
					.where(eq(categories.name, el))

				if (existingValue) {
					return existingValue
				}

				const newCategory = await db
					.insert(categories)
					.values({
						id: nanoid(),
						name: el,
						userId: auth.userId
					})
					.returning()

				return newCategory[0]
			})
		)

		await Promise.all(
			allTransactions.map(async (transaction) => {
				const plaidCategory = transaction.category?.[0]

				const payee =
					transaction.payment_meta.payee ||
					transaction.counterparties?.[0]?.name ||
					'Not set'

				let categoryId: string | undefined = undefined

				if (plaidCategory) {
					categoryId = dbCategories.find(
						(category) => category.name === plaidCategory
					)?.id
				}

				await db.insert(transactions).values({
					id: nanoid(),
					accountId: transaction.accountId,
					date: new Date(transaction.date),
					amount:
						transaction.amount > 0
							? convertAmountToMilliunits(transaction.amount) * -1
							: convertAmountToMilliunits(transaction.amount),
					categoryId,
					payee
				})

				await db
					.update(accounts)
					.set({ isTransactionsImported: true })
					.where(eq(accounts.id, transaction.accountId))
			})
		)

		return c.json({ success: true }, 200)
	})

export default app
