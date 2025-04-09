import { getGreeting } from './greetings/get-greetings.action'
import { getPostLikes } from './posts/get-post-likes.action'
import { updatePostLikes } from './posts/update-likes.action'

export const server = {
	getGreeting,
	getPostLikes,
	updatePostLikes
}
