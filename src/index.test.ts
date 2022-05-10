import { initializeApp } from 'firebase/app'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import f from '../firebase.json'
import { callable } from './index'
import { z } from 'zod'

const app = initializeApp({ projectId: process.env.PROJECT_ID })
const functions = getFunctions(app)

connectFunctionsEmulator(functions, 'localhost', f.emulators.functions.port)

const schema = {
	req: z.string(),
	res: z.string(),
	name: 'test',
}

const callable_ = callable(schema, functions)

describe('test callable', () => {
	it('success test', async () => {
		const result = await callable_('123')

		expect(result.code).toBe('ok')
		// @ts-expect-error
		expect(result.data).toEqual('123')
	})

	it('invalid arguments test', async () => {
		// @ts-expect-error
		const result = await callable_(123)

		expect(result.code).toBe('functions/invalid-argument')
		// @ts-expect-error
		expect(result.message).toEqual('invalid-argument')
	})

	it('schema not in sync test', async () => {
		const schema = {
			req: z.string(),
			res: z.boolean(),
			name: 'test',
		}
		const callable_ = callable(schema, functions)

		const result = await callable_('123')

		expect(result.code).toBe('schema-out-of-sync')
		// @ts-expect-error
		expect(result.message).toEqual('please sync your schema')
	})

	it('unknown', async () => {
		const schema = {
			req: z.string(),
			res: z.string(),
			name: 'error',
		}
		const callable_ = callable(schema, functions)

		const result = await callable_('123')
		console.log({ result })

		expect(result.code).toBe('functions/unknown')
		// @ts-expect-error
		expect(result.message).toEqual('unknown')
	})
})
