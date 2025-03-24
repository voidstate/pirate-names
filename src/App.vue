<script setup>
import PageHeader from './components/Page-Header.vue'
import NameGenerator from './components/Name-Generator.vue'
import PageFooter from './components/Page-Footer.vue'
</script>

<template>
	<div class="app__inner">
		<header>
			<PageHeader />
		</header>

		<main>
			<NameGenerator />
		</main>

		<footer>
			<PageFooter />
		</footer>
	</div>
</template>

<style scoped></style>
