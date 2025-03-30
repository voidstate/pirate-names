<script setup>
	import GithubIcon from './icons/IconGithub.vue'
</script>

<template>
	<div class="footer-container">
		<span>
			web app by <a href="//voidstate.com/rpg">voidstate</a>
		</span>
		<span>|</span>
		<span>
			<RouterLink :to="{ name: 'main' }">Home</RouterLink>
		</span>
		<span>
			<RouterLink :to="{ name: 'about' }">About</RouterLink>
		</span>
		<span>|</span>
		<span>
			<a href="//github.com/voidstate/pirate-names"><GithubIcon class="footer-container__icon"/></a>
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
		font-size: 70%;
		color: var(--color-text-muted);

		& > div {
			display: flex;
			flex-direction: row;
			gap: .5rem;
			align-items: center;
			justify-content: flex-end;
		}

		span:has( a.router-link-active ) {
			display: none;
		}

		.footer-container__icon {
			width: 1.5rem;
			display: inline-block;
			height: auto;
			margin-top: -3px;

			path {
				fill: var(--color-link);
			}
		}

		a:is(:hover, :active) {
			.footer-container__icon path {
				fill: var(--color-link-active);
			}
		}
	}
</style>
