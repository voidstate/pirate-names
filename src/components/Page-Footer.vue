<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const currentRouteName = computed( () => route.name )
</script>

<template>
	<div class="footer">
		<span>
			web app by <a href="//voidstate.com/rpg">voidstate</a>
		</span>
		<span>|</span>
		<span>
			<template v-if="currentRouteName === 'main'">
				<span class="footer__current">Home</span>
			</template>
			<template v-else>
				<RouterLink :to="{ name: 'main' }">Home</RouterLink>
			</template>
		</span>
		<span>|</span>
		<span>
			<template v-if="currentRouteName === 'options'">
				<span class="footer__current">Options</span>
			</template>
			<template v-else>
				<RouterLink :to="{ name: 'options' }">Options</RouterLink>
			</template>
		</span>
		<span>|</span>
		<span>
			<template v-if="currentRouteName === 'about'">
				<span class="footer__current">About</span>
			</template>
			<template v-else>
				<RouterLink :to="{ name: 'about' }">About</RouterLink>
			</template>
		</span>
		<span>|</span>
		<span class="footer__icon">
			<a href="//github.com/voidstate/pirate-names"><font-awesome-icon :icon="['fab', 'github']" /></a>
		</span>
	</div>
</template>

<style>
footer
{
	margin-top: 4rem;
	border-top: 1px solid var(--color-border);
	padding: 1rem .5rem;
	text-align: right;
	font-size: var(--font-size-footer);
	color: var(--color-text-muted);

	& > div
	{
		display: flex;
		flex-direction: row;
		gap: .5rem;
		align-items: center;
		justify-content: flex-end;
	}

	.footer__current
	{
		color: var(--color-link);
		pointer-events: none;
	}

	.footer__icon
	{
		width: 1.5rem;
		display: inline-block;
		height: auto;
		margin-top: -3px;

		path
		{
			fill: var(--color-link);
		}
	}

	a:is(:hover, :active)
	{
		.footer__icon path
		{
			fill: var(--color-link-active);
		}
	}
}
</style>
