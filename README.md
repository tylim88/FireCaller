<!-- markdownlint-disable MD010 -->
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD041 -->

<div align="center">
		<img src="https://raw.githubusercontent.com/tylim88/Firelord/main/img/ozai.png" width="200px"/>
		<h1>FireCaller 烈火呼</h1>
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
				src="https://img.shields.io/badge/gzipped-0.5KB-brightgreen"
				alt="package size"
			/>
			&nbsp;
			<a href="https://github.com/tylim88/FireCaller/actions" target="_blank">
				<img
					src="https://github.com/tylim88/FireCaller/workflows/Main/badge.svg"
					alt="github action"
				/>
			</a>
			&nbsp;
			<a href="https://codecov.io/gh/tylim88/FireCaller" target="_blank">
				<img
					src="https://codecov.io/gh/tylim88/FireCaller/branch/main/graph/badge.svg"
					alt="code coverage"
				/>
			</a>
			&nbsp;
			<a href="https://github.com/tylim88/FireCaller/issues" target="_blank">
				<img
					alt="GitHub issues"
					src="https://img.shields.io/github/issues-raw/tylim88/FireCaller"
				></img>
			</a>
			&nbsp;
			<a href="https://snyk.io/test/github/tylim88/FireCaller" target="_blank">
				<img
					src="https://snyk.io/test/github/tylim88/FireCaller/badge.svg"
					alt="code coverage"
				/>
			</a>
			&nbsp;
			<a
				href="https://lgtm.com/projects/g/tylim88/FireCaller/alerts/"
				target="_blank"
			>
				<img
					alt="Total alerts"
					src="https://img.shields.io/lgtm/alerts/g/tylim88/FireCaller.svg?logo=lgtm&logoWidth=18"
				/>
			</a>
			&nbsp;
			<a
				href="https://lgtm.com/projects/g/tylim88/FireCaller/context:javascript"
				target="_blank"
			>
				<img
					alt="Language grade: JavaScript"
					src="https://img.shields.io/lgtm/grade/javascript/g/tylim88/FireCaller.svg?logo=lgtm&logoWidth=18"
				/>
			</a>
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

Usable with [Emulator](#usage-with-emulator)

## Why Do You Need This? What Is The Problem FireCall Trying To Solve?

Read [Here](https://github.com/tylim88/FireCall#why-do-you-need-this-what-is-the-problem-firecall-trying-to-solve)

## Related Projects

1. [FirelordJS](https://github.com/tylim88/Firelordjs) - Typescript wrapper for Firestore Web V9
2. [Firelord](https://github.com/tylim88/Firelord) - Typescript wrapper for Firestore Admin
3. [Firelordrn](https://github.com/tylim88/firelordrn) - Typescript wrapper for Firestore React Native
4. [FireLaw](https://github.com/tylim88/firelaw) - Write Firestore security rule with Typescript, utilizing Firelord type engine.

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
import { callable } from 'firecaller'
import { updateUserSchema, getUserSchema } from './someFile'

export const app = initializeApp(yourConfig) // must initialize app before using firecaller

const funRef = getFunctions(app)

// now create the specific callable
export const updateUser = callable(updateUserSchema) // or callable(updateUserSchema, funRef)
export const getUser = callable(getUserSchema) // or callable(getUserSchema, funRef)
```

## Calling

**FireCaller never throw**, all errors are caught and returned as object. We choose this pattern because it is impossible to type-safe rejected promise.

By checking the value of the `code`, you know how to deal with them:

| code                                                                                                                                                                                                                                                                                                                                                                                                                                    | meaning                                                                                 |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| ok                                                                                                                                                                                                                                                                                                                                                                                                                                      | success, you can access the `data` value                                                |
| schema-out-of-sync                                                                                                                                                                                                                                                                                                                                                                                                                      | Incorrect response data shape, your schema is out of sync, you can access the `message` |
| 'functions/cancelled', 'functions/unknown', 'functions/invalid-argument', 'functions/deadline-exceeded', 'functions/not-found', 'functions/already-exists', 'functions/permission-denied', 'functions/resource-exhausted', 'functions/failed-precondition', 'functions/aborted', 'functions/out-of-range', 'functions/unimplemented', 'functions/internal', 'functions/unavailable', 'functions/data-loss', 'functions/unauthenticated' | the error source is FireCall in NodeJS, you can access the `message`.                   |

```ts
import { updateUser, getUser } from './someOtherFile'

const { name, age, address } = someFormData()

updateUser(
	// input type depends on schema.req
	{ name, age, address } // { name: string, age: number, address: string }
).then(res => {
	const { code } = res
	if (code === 'ok') {
		const data = res.data // data type depends on what you define in schema.res
	} else {
		const { code, message } = res
		// message is string
	}
})
```

## Usage With Emulator

```ts
import { initializeApp } from 'firebase/app'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import { callable } from 'firecaller'
import { z } from 'zod'

const app = initializeApp({ projectId: `### YOUR_PROJECT_ID` })
const functions = getFunctions(app)

connectFunctionsEmulator(functions, 'localhost', f.emulators.functions.port)

const schema = {
	req: z.string(),
	res: z.string(),
	name: 'hello',
}

const helloCallable = callable(schema, functions)

describe('test callable', () => {
	it('success', async () => {
		const result = await helloCallable('hello')

		expect(result.code).toBe('ok')
		// @ts-expect-error
		expect(result.data).toEqual('how are you?')
	})

	it('invalid arguments', async () => {
		// @ts-expect-error
		const result = await helloCallable(123) // wrong input type

		expect(result.code).toBe('functions/invalid-argument')
		// @ts-expect-error
		expect(result.message).toEqual('invalid-argument')
	})
})
```
