<template>
	<div v-if="isLoading">Loading...</div>

	<button v-else-if="likeCount === 0" @click="likePost">Like This Post</button>

	<button v-else @click="likePost">
		Likes
		<span>{{ likeCount }}</span>
	</button>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import confetti from 'canvas-confetti'
import debounce from 'lodash.debounce'
import { actions } from 'astro:actions'

interface Props {
	postId: string
}
const props = defineProps<Props>()

const likeCount = ref(0)
const likeClicks = ref(0)
const isLoading = ref(true)

watch(
	likeCount,
	debounce(() => {
		fetch(`/api/posts/likes/${props.postId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ likes: likeClicks.value })
		})

		likeClicks.value = 0
	}, 500)
)

const likePost = async () => {
	likeCount.value++
	likeClicks.value++

	const { data, error } = await actions.getGreeting({
		age: 39,
		name: 'Jhonattan',
		isActive: true
	})

	if (error) {
		return alert('Algo Salio Mal')
	}

	console.log({ data })

	confetti({
		particleCount: 100,
		spread: 70,
		origin: { x: Math.random(), y: Math.random() - 0.2 }
	})
}

const getCurrenLikes = async () => {
	const resp = await fetch(`/api/posts/likes/${props.postId}`)

	if (!resp.ok) return

	const data = await resp.json()

	likeCount.value = data.likes
	isLoading.value = false
}

getCurrenLikes()
</script>

<style scoped>
button {
	background-color: #5e51bc;
	color: white;
	padding: 10px 20px;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	transition: all 0.3s;
}

button:hover {
	background-color: #4a3f9a;
}
</style>
