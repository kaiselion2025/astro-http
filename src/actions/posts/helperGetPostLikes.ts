import { db, eq, Posts } from 'astro:db'
export async function getPostLikesFromDB(postId: string) {
	const post = await db
		.select()
		.from(Posts)
		.where(eq(Posts.id, postId))
		.limit(1)
	if (!post || post.length === 0) {
		return { exists: false, likes: 0 }
	}
	return {
		exists: true,
		likes: post[0].likes
	}
}
