<script setup>
import PageHeader from '@/components/Page-Header.vue'
import PageFooter from '@/components/Page-Footer.vue'
</script>

<template>
	<div class="app__wrapper">
		<div class="app__inner">
			<header>
				<PageHeader />
			</header>

			<main>
				<RouterView />
			</main>

			<footer>
				<PageFooter />
			</footer>
		</div>
	</div>
</template>

<style scoped></style>
