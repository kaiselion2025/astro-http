import { actions, defineAction } from 'astro:actions'
import { db, Posts, eq } from 'astro:db'
import { z } from 'astro:schema'

export const updatePostLikes = defineAction({
	accept: 'json',
	input: z.object({
		postId: z.string(),
		increment: z.number()
	}),
	handler: async ({ postId, increment }) => {
		try {
			// Obtener información del post
			const { data, error } = await actions.getPostLikes(postId)
			if (error) {
				console.error('Error al obtener likes:', error)
				throw new Error('Algo Salió Mal')
			}

			// Verificar que data tenga la estructura esperada
			if (!data) {
				console.error('No se recibieron datos de getPostLikes')
				throw new Error('Datos de post no disponibles')
			}

			const { exists, likes } = data

			// Si el post no existe, crear uno nuevo
			if (!exists) {
				const newPost = {
					id: postId,
					title: 'Unknown',
					likes: 0
				}

				try {
					await db.insert(Posts).values(newPost)
				} catch (insertError) {
					console.error('Error al insertar nuevo post:', insertError)
					throw new Error('No se pudo crear el post')
				}
			}

			// Actualizar los likes del post
			try {
				await db
					.update(Posts)
					.set({
						likes: exists ? likes + increment : increment
					})
					.where(eq(Posts.id, postId))
			} catch (updateError) {
				console.error('Error al actualizar likes:', updateError)
				throw new Error('No se pudieron actualizar los likes')
			}

			return true
		} catch (error) {
			console.error('Error en updatePostLikes:', error)
			// En lugar de lanzar el error directamente, devuelve un objeto con formato
			return {
				error: {
					message: error instanceof Error ? error.message : 'Error desconocido',
					code: 'UPDATE_LIKES_ERROR'
				}
			}
		}
	}
})
