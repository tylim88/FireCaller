import { z, ZodType, ZodTypeDef } from 'zod'
import { getFunctions, httpsCallable, Functions } from 'firebase/functions'

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
	) =>
	(data: z.infer<T['req']>) =>
		httpsCallable<z.infer<T['req']>, z.infer<T['res']>>(
			functions || getFunctions(),
			schema.name
		)(data)
