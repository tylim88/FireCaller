import { z, ZodType, ZodTypeDef } from 'zod'
import {
	getFunctions,
	httpsCallable,
	Functions,
	HttpsCallableOptions,
} from 'firebase/functions'

type ErrorCode = `functions/${
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
	| 'unauthenticated'}`

const errCode = [
	'functions/cancelled',
	'functions/unknown',
	'functions/invalid-argument',
	'functions/deadline-exceeded',
	'functions/not-found',
	'functions/already-exists',
	'functions/permission-denied',
	'functions/resource-exhausted',
	'functions/failed-precondition',
	'functions/aborted',
	'functions/out-of-range',
	'functions/unimplemented',
	'functions/internal',
	'functions/unavailable',
	'functions/data-loss',
	'functions/unauthenticated',
] as const

export const callable = <
	T extends {
		req: ZodType<unknown, ZodTypeDef, unknown>
		res: ZodType<unknown, ZodTypeDef, unknown>
		name: string
	}
>(
	schema: T,
	func?: Functions
) => {
	const callable = (
		data: z.infer<T['req']>,
		options?: HttpsCallableOptions
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
				code: 'generic'
				message: 'generic'
				err: unknown
		  }
		| { code: 'schema-out-of-sync'; message: string }
	> => {
		return httpsCallable<z.infer<T['req']>, z.infer<T['res']>>(
			func || getFunctions(),
			schema.name,
			options
		)(data)
			.then(result => {
				const { data } = result
				try {
					schema.res.parse(data)
				} catch (e) {
					return {
						code: 'schema-out-of-sync' as const,
						message: 'please sync your schema',
					}
				}

				return { code: 'ok' as const, data: result.data }
			})
			.catch(err => {
				try {
					if (errCode.includes(err.code)) {
						return {
							code: err.code as ErrorCode,
							message: err.message as string,
						}
					} else {
						throw 'something is wrong'
					}
				} catch (e) {
					return { code: 'generic', message: 'generic', err: e } // is it even possible to test this?
				}
			})
	}
	return callable
}
