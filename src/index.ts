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

/**
 *
 * @param schema object that contains request data and response data zod schema, and the function name
 * @param schema.req request data zod schema
 * @param schema.res response data zod schema
 * @param schema.name name of the function
 * @param func optional, insert firebase function builder here.
 * @returns
 */
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
	/**
	 *
	 * @param data data type is what you define in schema.req
	 * @param options optional, HttpsCallableOptions
	 * @param options.timeout optional, Time in milliseconds after which to cancel if there is no response. Default is 70000.
	 * @returns
	 */
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
				return {
					code: err.code as ErrorCode,
					message: err.message as string,
				}
			})
	}
	return callable
}
