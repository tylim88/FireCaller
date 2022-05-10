import { onCall } from 'firecall'
import { z } from 'zod'

export const schema = {
	req: z.string(),
	res: z.string(),
	name: 'test',
}

export const test = onCall(schema, { route: 'public' }, data => {
	return { code: 'ok', data }
}).onCall

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
