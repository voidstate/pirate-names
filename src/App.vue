<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

import PageHeader from '@/components/Page-Header.vue'
import PageFooter from '@/components/Page-Footer.vue'

const glow1 = ref( null )
const glow2 = ref( null )
const glow3 = ref( null )
const glow4 = ref( null )

let frameId = null
let mouseX = 0
let mouseY = 0
let lastMouseMove = performance.now()

const handleMouseMove = ( event ) =>
{
	mouseX = event.clientX
	mouseY = event.clientY
	lastMouseMove = performance.now()
}

onMounted( () =>
{
	const windowWidth = window.innerWidth
	const windowHeight = window.innerHeight
	const glows = [ glow1.value, glow2.value, glow3.value, glow4.value ]

	const updateGlows = ( timestamp ) =>
	{
		const time = timestamp * 0.0005
		const idleTime = timestamp - lastMouseMove
		const mouseInfluence = Math.max( 0, 1 - ( idleTime / 2500 ) )

		glows.forEach( ( element, index ) =>
		{
			if ( !element ) {
				return
			}

			const driftX = Math.sin( time * ( 0.25 + ( index * 0.06 ) ) + ( index * 0.9 ) ) * 35
			const driftY = Math.cos( time * ( 0.2 + ( index * 0.05 ) ) + ( index * 0.6 ) ) * 30
			const mouseXPercent = ( mouseX / windowWidth ) * 100
			const mouseYPercent = ( mouseY / windowHeight ) * 100
			const baseX = 50 + driftX
			const baseY = 50 + driftY
			const targetX = mouseXPercent + ( driftX * 0.2 )
			const targetY = mouseYPercent + ( driftY * 0.2 )
			const x = ( targetX * mouseInfluence ) + ( baseX * ( 1 - mouseInfluence ) )
			const y = ( targetY * mouseInfluence ) + ( baseY * ( 1 - mouseInfluence ) )

			element.style.opacity = 0.18 + ( 0.12 * Math.sin( time * 0.8 + index ) + 0.15 )
			element.style.right = `${ x }%`
			element.style.bottom = `${ y }%`
			element.style.left = 'auto'
			element.style.top = 'auto'
		} )

		frameId = window.requestAnimationFrame( updateGlows )
	}

	window.addEventListener( 'mousemove', handleMouseMove )
	window.addEventListener( 'resize', () =>
	{
		mouseX = window.innerWidth / 2
		mouseY = window.innerHeight / 2
	} )

	frameId = window.requestAnimationFrame( updateGlows )
} )

onBeforeUnmount( () =>
{
	window.removeEventListener( 'mousemove', handleMouseMove )
	if ( frameId ) {
		window.cancelAnimationFrame( frameId )
	}
} )
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

	<div ref="glow1" class="app__glow1"></div>
	<div ref="glow2" class="app__glow2"></div>
	<div ref="glow3" class="app__glow3"></div>
	<div ref="glow4" class="app__glow4"></div>
</template>

<style scoped>
.app__wrapper,
.app__inner
{
	position: relative;
}

.app__wrapper
{
	overflow: hidden;
}

.app__glow1,
.app__glow2,
.app__glow3,
.app__glow4
{
	content: "";
	position: fixed;
	top: auto;
	bottom: auto;
	left: auto;
	right: auto;
	height: 50vh;
	width: 50vw;
	max-width: 1024px;
	border-radius: 50%;
	opacity: 0.3;
	filter: blur(60px);
	transition: opacity 1.2s ease, right 0.8s ease, bottom 0.8s ease;
	background-color: var(--color-glow-soft);
	pointer-events: none;
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
</style>
