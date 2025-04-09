import { actions, defineAction } from 'astro:actions'
import { db, eq, exists, Posts } from 'astro:db'
import { z } from 'astro:schema'
import { getPostLikesFromDB } from './helperGetPostLikes'

export const updatePostLikes = defineAction({
	input: z.object({
		postId: z.string(),
		increment: z.number()
	}),
	handler: async ({ postId, increment }) => {
		try {
			const { exists, likes } = await getPostLikesFromDB(postId)
			if (!exists) {
				const newPost = {
					id: postId,
					title: 'Post not found',
					likes: 0
				}
				await db.insert(Posts).values(newPost)
			}
			await db
				.update(Posts)
				.set({
					likes: likes + increment
				})
				.where(eq(Posts.id, postId))
			return true
		} catch (err) {
			console.error('Error en updateLikes:', err)
			throw new Error('Error inesperado en updateLikes')
		}
	}
})
