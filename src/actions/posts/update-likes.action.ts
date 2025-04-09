import { actions, defineAction } from 'astro:actions'
import { db, eq, Posts } from 'astro:db'
import { z } from 'astro:schema'

type UpdateLikesResponse = {
	success: boolean
	error?: string
	likes?: number
}

export const updatePostLikes = defineAction({
	accept: 'json',
	input: z.object({
		postId: z.string(),
		increment: z.number()
	}),
	handler: async ({ postId, increment }): Promise<UpdateLikesResponse> => {
		try {
			// Verificar que postId y increment son valores válidos
			if (!postId || typeof increment !== 'number') {
				return {
					success: false,
					error: 'Parámetros inválidos'
				}
			}

			// Obtener los likes actuales
			const { data, error } = await actions.getPostLikes(postId)

			if (error) {
				console.error('Error al obtener likes:', error)
				return {
					success: false,
					error: 'Error al obtener likes'
				}
			}

			const { exists, likes } = data

			// Si el post no existe, crearlo
			if (!exists) {
				try {
					const newPost = {
						id: postId,
						title: 'Post not found',
						likes: 0
					}

					await db.insert(Posts).values(newPost)
				} catch (insertError) {
					console.error('Error al crear nuevo post:', insertError)
					return {
						success: false,
						error: 'Error al crear post'
					}
				}
			}

			// Actualizar los likes
			try {
				await db
					.update(Posts)
					.set({
						likes: likes + increment
					})
					.where(eq(Posts.id, postId))

				return {
					success: true,
					likes: likes + increment
				}
			} catch (updateError) {
				console.error('Error al actualizar likes:', updateError)
				return {
					success: false,
					error: 'Error al actualizar likes'
				}
			}
		} catch (e) {
			console.error('Error inesperado:', e)
			return {
				success: false,
				error: 'Error interno del servidor'
			}
		}
	}
})
