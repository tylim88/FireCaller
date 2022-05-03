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
</div>
<br/>

🔥 Helper Function to use together with [FireCall](https://github.com/tylim88/FireCall)

This library doesn't do anything on its own, it doesn't validate or handle error like FireCall.

It simply wraps around Firebase callable functions to provide new interface.

Do not use this library if you are not using FireCall.

FireCaller is library for Web, FireCall is for Nodejs.

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

```ts
import { updateUser, getUser } from './someOtherFile'

const { name, age, address } = someFormData()

updateUser(
	// input type depends on schema.req
	{ name, age, address } // { name: string, age: number, address: string }
).then(res => {
	const data = res.data // data = undefined, data type depends on schema.res
})

getUser(
	// input type depend on schema.req
	userId // string
).then(res => {
	const { name, age } = res.data // data = { name, age }, data type depends on schema.res
})
```
