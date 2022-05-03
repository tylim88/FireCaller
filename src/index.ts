import { z, ZodType, ZodTypeDef } from 'zod'
import { getFunctions, httpsCallable, Functions } from 'firebase/functions'

type ErrorCode =
	| 'cancelled'
	| 'unknown'
	| 'invalid-argument'
	| 'deadline-exceeded'
	| 'not-found'
	| 'already-exists'
	| 'permission-denied'
	| 'resource-exhausted'
	| 'failed-precondition'
	| 'aborted'
	| 'out-of-range'
	| 'unimplemented'
	| 'internal'
	| 'unavailable'
	| 'data-loss'
	| 'unauthenticated'

const errCode = [
	'cancelled',
	'unknown',
	'invalid-argument',
	'deadline-exceeded',
	'not-found',
	'already-exists',
	'permission-denied',
	'resource-exhausted',
	'failed-precondition',
	'aborted',
	'out-of-range',
	'unimplemented',
	'internal',
	'unavailable',
	'data-loss',
	'unauthenticated',
]

export const callableCreator =
	(functions?: Functions) =>
	<
		T extends {
			req: ZodType<unknown, ZodTypeDef, unknown>
			res: ZodType<unknown, ZodTypeDef, unknown>
			name: string
		}
	>(
		schema: T
	) => {
		const callback = (
			data: z.infer<T['req']>
		): Promise<
			| {
					code: 'ok'
					data: z.TypeOf<T['res']>
			  }
			| {
					code: ErrorCode
					message: string
			  }
			| {
					code: 'NON_FUNCTION_ERROR'
					err: unknown
			  }
		> =>
			httpsCallable<z.infer<T['req']>, z.infer<T['res']>>(
				functions || getFunctions(),
				schema.name
			)(data)
				.then(result => {
					return { code: 'ok' as const, data: result.data }
				})
				.catch(err => {
					let code = ''
					let message = ''
					try {
						code = err.code
						message = err.message
					} catch (e) {
						return { code: 'NON_FUNCTION_ERROR' as const, err }
					}

					if (errCode.includes(code) && typeof message === 'string') {
						return { code: code as ErrorCode, message }
					} else {
						return { code: 'NON_FUNCTION_ERROR' as const, err }
					}
				})

		return callback
	}
