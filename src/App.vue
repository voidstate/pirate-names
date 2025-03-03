<script setup>
import Header from './components/Header.vue'
import Generator from './components/Generator.vue'
import Footer from './components/Footer.vue'
</script>

<template>
	<div class="app__inner">
		<header>
			<Header />
		</header>

		<main>
			<Generator />
		</main>

		<footer>
			<Footer />
		</footer>
	</div>
</template>

<style scoped></style>
