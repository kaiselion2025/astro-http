import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import { getPostLikesFromDB } from './helperGetPostLikes'

export const getPostLikes = defineAction({
	input: z.object({ postId: z.string() }),
	handler: async ({ postId }) => {
		const data = await getPostLikesFromDB(postId)
		return data
	}
})
