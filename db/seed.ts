import { Clients, db } from 'astro:db'

// https://astro.build/db/seed
export default async function seed() {
	await db.insert(Clients).values([
		{ id: 1, name: 'John Doe', age: 30, isActive: true },
		{ id: 2, name: 'Jane Smith', age: 25, isActive: false },
		{ id: 3, name: 'Alice Johnson', age: 28, isActive: true },
		{ id: 4, name: 'Bob Brown', age: 35, isActive: false },
		{ id: 5, name: 'Charlie Davis', age: 40, isActive: true }
	])

	console.log('Seeding database...')
}
