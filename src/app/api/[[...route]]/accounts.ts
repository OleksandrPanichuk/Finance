import { db } from '@db/drizzle'
import { accounts, insertAccountSchema } from '@db/schema'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { zValidator } from '@hono/zod-validator'
import { and, eq, inArray } from 'drizzle-orm'
import { Hono } from 'hono'
import { nanoid } from 'nanoid'
import { z } from 'zod'

const app = new Hono()
	.get('/', clerkMiddleware(), async (c) => {
		const auth = getAuth(c)

		if (!auth?.userId) {
			return c.json({ error: 'Unauthorized' }, 401)
		}

		const data = await db
			.select({
				id: accounts.id,
				name: accounts.name
			})
			.from(accounts)
			.where(eq(accounts.userId, auth.userId))

		return c.json({ data })
	})
	.get(
		'/:id',
		zValidator('param', z.object({ id: z.string().optional() })),
		clerkMiddleware(),
		async (c) => {
			const auth = getAuth(c)
			const { id } = c.req.valid('param')

			if (!id) {
				return c.json({ error: 'Messing id' }, 400)
			}

			if (!auth?.userId) {
				return c.json({ error: 'Unauthorized' }, 401)
			}

			const [data] = await db
				.select({
					id: accounts.id,
					name: accounts.name
				})
				.from(accounts)
				.where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)))

			if (!data) {
				return c.json({ error: 'Not found.' }, 404)
			}

			return c.json({ data })
		}
	)
	.post(
		'/',
		clerkMiddleware(),
		zValidator(
			'json',
			insertAccountSchema.pick({
				name: true
			})
		),
		async (c) => {
			const auth = getAuth(c)

			if (!auth?.userId) {
				return c.json({ error: 'Unauthorized' }, 401)
			}

			const values = c.req.valid('json')

			const [data] = await db
				.insert(accounts)
				.values({
					id: nanoid(),
					userId: auth?.userId,
					...values
				})
				.returning()

			return c.json({ data }, 201)
		}
	)
	.post(
		'/bulk-delete',
		clerkMiddleware(),
		zValidator(
			'json',
			z.object({
				ids: z.array(z.string())
			})
		),
		async (c) => {
			const auth = getAuth(c)
			const values = c.req.valid('json')

			if (!auth?.userId) {
				return c.json({ error: 'Unauthorized' }, 401)
			}

			const data = await db
				.delete(accounts)
				.where(
					and(
						eq(accounts.userId, auth.userId),
						inArray(accounts.id, values.ids)
					)
				)
				.returning({
					id: accounts.id
				})

			return c.json({ data })
		}
	)
	.patch(
		'/:id',
		clerkMiddleware(),
		zValidator(
			'param',
			z.object({
				id: z.string().optional()
			})
		),
		zValidator(
			'json',
			insertAccountSchema.pick({
				name: true
			})
		),
		async (ctx) => {
			const auth = getAuth(ctx)
			const { id } = ctx.req.valid('param')
			const values = ctx.req.valid('json')

			if (!id) {
				return ctx.json({ error: 'Missing id.' }, 400)
			}

			if (!auth?.userId) {
				return ctx.json({ error: 'Unauthorized.' }, 401)
			}

			const [data] = await db
				.update(accounts)
				.set(values)
				.where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)))
				.returning()

			if (!data) {
				return ctx.json({ error: 'Not found.' }, 404)
			}

			return ctx.json({ data })
		}
	)
	.delete(
		'/:id',
		clerkMiddleware(),
		zValidator(
			'param',
			z.object({
				id: z.string().optional()
			})
		),
		async (ctx) => {
			const auth = getAuth(ctx)
			const { id } = ctx.req.valid('param')

			if (!id) {
				return ctx.json({ error: 'Missing id.' }, 400)
			}

			if (!auth?.userId) {
				return ctx.json({ error: 'Unauthorized.' }, 401)
			}

			const [data] = await db
				.delete(accounts)
				.where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)))
				.returning({
					id: accounts.id
				})

			if (!data) {
				return ctx.json({ error: 'Not found.' }, 404)
			}

			return ctx.json({ data })
		}
	)

export default app
