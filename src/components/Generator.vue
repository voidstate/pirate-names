<script setup>

import { ref } from 'vue'

import SkullIcon from './icons/IconSkull.vue'
import ReloadIcon from './icons/IconReload.vue'

//const openReadmeInEditor = () => fetch( '/__open-in-editor?file=README.md' )

const name = ref( `What's me name then, cap'n?` )

const newName = ( event ) =>
{
	// `this` inside methods points to the current active instance
	alert( `${ this.name }!` )

	// `event` is the native DOM event
	if ( event ) {
		alert( event.target.tagName )
	}
}

</script>

<template>
	<div class="generator">
		<div class="generator__name-container">
			<div class="generator__name"></div>
			<div class="generator__btn">
				<button @click="newName">
					<ReloadIcon />
				</button>
			</div>
			<div class="generator__factoid"></div>
		</div>
	</div>
</template>
