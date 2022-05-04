<!-- markdownlint-disable MD010 -->
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD041 -->

<div align="center">
		<img src="https://raw.githubusercontent.com/tylim88/Firelord/main/img/ozai.png" width="200px"/>
		<h1>FireCaller 烈火呼(Beta)</h1>
</div>

<div align="center">
		<a href="https://www.npmjs.com/package/firecaller" target="_blank">
				<img
					src="https://img.shields.io/npm/v/firecaller"
					alt="Created by tylim88"
				/>
			</a>
			&nbsp;
			<a
				href="https://github.com/tylim88/firecaller/blob/main/LICENSE"
				target="_blank"
			>
				<img
					src="https://img.shields.io/github/license/tylim88/firecaller"
					alt="License"
				/>
			</a>
			&nbsp;
			<a
				href="https://www.npmjs.com/package/firecaller?activeTab=dependencies"
				target="_blank"
			>
				<img
					src="https://img.shields.io/badge/dynamic/json?url=https://api.npmutil.com/package/firecaller&label=dependencies&query=$.dependencies.count&color=brightgreen"
					alt="dependency count"
				/>
			</a>
			&nbsp;
			<img
				src="https://img.shields.io/badge/gzipped-0.3KB-brightgreen"
				alt="package size"
			/>
			<br/>
			<br/>
			<p>🔥 Write callable functions systematically like a Firelord. No more chaotic error handling, no more unsafe endpoint data type, no more messy validation. Be the Master of Fire you always wanted to be.</p>
</div>
<br/>
<br/>

FireCaller validate response and handle error from [FireCall](https://github.com/tylim88/FireCall).

It wraps around Firebase callable functions to provide type safety for you request data and response data with [zod](https://www.npmjs.com/package/zod).

Do not use this library if you are not using FireCall.

FireCaller is a library for Web, FireCall is for Nodejs.

## Why Do You Need This? What Is The Problem FireCall Trying To Solve?

Read [Here](https://github.com/tylim88/FireCall#why-do-you-need-this-what-is-the-problem-firecall-trying-to-solve)

## Related Projects

1. [FirelordJS](https://github.com/tylim88/Firelordjs) - Typescript wrapper for Firestore Web V9
2. [Firelord](https://github.com/tylim88/Firelord) - Typescript wrapper for Firestore Admin
3. [Firelordrn](https://github.com/tylim88/firelordrn) - Typescript wrapper for Firestore React Native
4. [FireLaw](https://github.com/tylim88/firelaw) - Write Firestore security rule with Typescript, utilizing Firelord type engine.

FirelordJS is completed, the rest are still under development.

## Installation

```bash
npm i firecaller firebase zod
```

and of course you need `typescript`.

## Create Schema With Zod

Normally this file is created on backend and share to frontend.

Tips: You can also use these schemas to validate your form, learn more at [zod](https://github.com/colinhacks/zod)!

```ts
import { z } from 'zod'

export const updateUserSchema = {
	//request data schema
	req: z.object({
		name: z.string(),
		age: z.number(),
		address: z.string(),
	}),
	// response data schema
	res: z.undefined(),
	// function name
	name: 'updateUser',
}

export const getUserSchema = {
	res: z.string(), // userId
	res: z.object({
		name: z.string(),
		age: z.number(),
	}),
	name: 'getUser',
}
```

## Create the Callable Functions

```ts
import { initializeApp } from 'firebase/app'
import { callableCreator } from 'firecaller'
import { updateUserSchema, getUserSchema } from './someFile'

export const app = initializeApp(yourConfig) // must initialize app before using firecaller

const funRef = getFunctions(app)

const callable = callableCreator(funRef)
// OR
const callable = callableCreator()

// now create the specific callable
export const updateUser = callable(updateUserSchema)
export const getUser = callable(getUserSchema)
```

## Calling

**FireCaller never throw**, all error is caught and return as object. We choose this pattern because it is impossible to type-safe rejected promise.

By checking the value of the `code`, you know how to deal with them

if the `code` value is:

| code                                                                                                                                                                                                                                                                    | meaning                                                                                                                                                                                             |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ok                                                                                                                                                                                                                                                                      | success, you can access the `data` value                                                                                                                                                            |
| NON_FUNCTION_ERROR                                                                                                                                                                                                                                                      | FireCall in Nodejs did not cause this error, this is something totally unexpected, you can access the `err` object, but the type is completely unknown. Handle it with your generic error handling. |
| OUT_OF_SYNC_SCHEMA                                                                                                                                                                                                                                                      | Incorrect response data shape, your schema is out of sync, you can access the `message`                                                                                                             |
| 'cancelled', 'unknown', 'invalid-argument', 'deadline-exceeded', 'not-found', 'already-exists', 'permission-denied', 'resource-exhausted', 'failed-precondition', 'aborted', 'out-of-range', 'unimplemented', 'internal', 'unavailable', 'data-loss', 'unauthenticated' | the error source is FireCall in NodeJS, you can access the `message`.                                                                                                                               |

```ts
import { updateUser, getUser } from './someOtherFile'

const { name, age, address } = someFormData()

updateUser(
	// input type depends on schema.req
	{ name, age, address } // { name: string, age: number, address: string }
).then(res => {
	const { code } = res
	if (code === 'ok') {
		const data = res.data // data = undefined, data type depends on schema.res
	} else if (code === 'NON_FUNCTION_ERROR') {
		const { err } = res
	} else if (code === 'OUT_OF_SYNC_SCHEMA') {
		// since this error also has message prop, you can combine this case with the `else` case
		const { message } = res
	} else {
		const { message } = res
		// message is string
	}
})
```

Or handle all the errors generically

```ts
getUser(
	// input type depend on schema.req
	userId // string
).then(res => {
	const { code } = res
	if (code === 'ok') {
		const { name, age } = res.data // data = { name, age }, data type depends on schema.res
	} else {
		alert('error, help!')
		// handle errors generically
	}
})
```
