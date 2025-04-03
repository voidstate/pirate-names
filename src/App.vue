<script setup>
import PageHeader from '@/components/Page-Header.vue'
import PageFooter from '@/components/Page-Footer.vue'
</script>

<script defer>
( () =>
{
	console.log( 'init glow' )

	// DOM elements
	let glow1 = document.querySelector( '.app__glow1' )
	let glow2 = document.querySelector( '.app__glow2' )
	let glow3 = document.querySelector( '.app__glow3' )
	let glow4 = document.querySelector( '.app__glow4' )

	// make the window size usable as a variable
	const windowWidth = window.innerWidth
	const windowHeight = window.innerHeight

	// detect mouse movement and make it usable as a variable
	const moveGlowByMousePosition = ( event ) =>
	{

		setTimeout( () =>
		{
			glow1 = document.querySelector( '.app__glow1' )
			glow2 = document.querySelector( '.app__glow2' )
			glow3 = document.querySelector( '.app__glow3' )
			glow4 = document.querySelector( '.app__glow4' )

			// mouse position
			const mouse_x = event.clientX
			const mouse_y = event.clientY
			console.log( mouse_y + ' : ' + mouse_x )

			// difference between mouse position and window size
			const delta_x1 = Math.round( ( mouse_x / windowWidth * 100 ) / 3, 0 )
			const delta_x2 = Math.round( ( mouse_x / windowWidth * 100 ) / 3, 0 )
			const delta_y1 = Math.round( ( mouse_y / windowHeight * 100 ) / 3, 0 )
			const delta_y2 = Math.round( ( mouse_y / windowHeight * 100 ) / 3, 0 )

			console.log( 'glow1', glow1 )
			console.log( 'glow2', glow2 )

			// Glow element position
			if ( glow1 && glow2 && glow3 && glow4 ) {

				glow1.style.opacity = 0.2 + ( Math.random() * 0.7 )
				glow1.style.right = `${ delta_x1 }%`
				glow1.style.bottom = `${ delta_y1 }%`

				glow2.style.opacity = 0.2 + ( Math.random() * 0.7 )
				glow2.style.bottom = `${ delta_x2 }%`
				glow2.style.left = `${ delta_y2 }%`

				glow3.style.opacity = 0.2 + ( Math.random() * 0.7 )
				glow3.style.left = `${ delta_x2 }%`
				glow3.style.top = `${ delta_y2 }%`

				glow4.style.opacity = 0.2 + ( Math.random() * 0.7 )
				glow4.style.top = `${ delta_x1 }%`
				glow4.style.right = `${ delta_y1 }%`
			}

		}, 200 )
	}

	// detect mouse movement
	document.addEventListener( 'mousemove', moveGlowByMousePosition )

} )()
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

	<div class="app__glow1"></div>
	<div class="app__glow2"></div>
	<div class="app__glow3"></div>
	<div class="app__glow4"></div>
</template>

<style scoped>
.app
{

	overflow: hidden;

	.app__glow1,
	.app__glow2,
	.app__glow3,
	.app__glow4
	{
		content: "";
		position: absolute;
		top: auto;
		bottom: auto;
		left: auto;
		right: auto;
		height: 50%;
		width: 50%;
		max-width: 1024px;
		border-radius: 50%;
		opacity: 0.3;
		filter: blur(60px);
		transition: all 5s ease;
		background-color: var(--color-glow-soft);
	}

	.app__glow1
	{
		z-index: -1;
	}

	.app__glow2
	{
		z-index: -2;
	}

	.app__glow3
	{
		z-index: -3;
	}

	.app__glow4
	{
		z-index: -4;
	}
}
</style>
