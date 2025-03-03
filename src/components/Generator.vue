<script setup>

import { ref } from 'vue'

import SkullIcon from './icons/IconSkull.vue'
import ArrowIcon from './icons/IconArrow.vue'
import ReloadIcon from './icons/IconReload.vue'

import adjectives from '../data/adjectives.json' with {type: 'json'}
import nouns from '../data/nouns.json' with {type: 'json'}
import forenames from '../data/forenames.json' with {type: 'json'}
import surnames from '../data/surnames.json' with {type: 'json'}
import deaths from '../data/deaths.json' with {type: 'json'}
import eaters from '../data/eaters.json' with {type: 'json'}
// also: places

import templates from '../data/templates.json' with {type: 'json'}

const getRandomElement = ( array ) =>
{
	return array[ Math.floor( Math.random() * array.length ) ]
}

const newName = ( event ) =>
{
	if ( event ) {

		const randomTemplate = getRandomElement( templates )

		const newName = randomTemplate
			.replace( /%adjective%/, getRandomElement( adjectives ) )
			.replace( /%adjective%/, getRandomElement( adjectives ) ) // we can have 2 adjectives
			.replace( /%noun%/, getRandomElement( nouns ) )
			.replace( /%noun%/, getRandomElement( nouns ) ) // we can have 2 nouns
			.replace( /%forename%/g, getRandomElement( forenames ) )
			.replace( /%surname%/g, getRandomElement( surnames ) )

		name.value = newName

		// cause of death
		let causeOfDeath = ''
		if ( Math.random() < .33 ) {
			causeOfDeath = 'eaten by ' + getRandomElement( eaters )

		}
		else {
			causeOfDeath = getRandomElement( deaths )
		}

		// remember the name
		nameLog.unshift( newName + ' (' + causeOfDeath + ')' )
		if ( nameLog.length > 10 ) {
			nameLog.pop()
		}

		// output previous names in a comma-separated list
		nameLogOutput = [ ...nameLog ]
		nameLogOutput.shift()
		nameLogOutput = nameLogOutput.join( ', ' )

	}
}

let nameLog, nameLogOutput
nameLog = nameLogOutput = []

// no need for special `setup` hook with the Composition API.
const name = ref( `What's me name then, cap'n?` )

</script>

<template>
	<div class="generator">
		<div class="generator__name-container">
			<div class="generator__name">{{ name }}</div>
			<div class="generator__btn">
				<button @click="newName">
					<span v-if="nameLog.length === 0" class="generator__btn--arrow">
						<ArrowIcon />
					</span>
					<span v-else class="generator__btn--die">
						<SkullIcon />
					</span>
				</button>
			</div>
		</div>
		<div class="generator__factoid"></div>
		<div v-if="nameLogOutput.length" class="generator__log">{{ nameLogOutput }}</div>

	</div>
</template>

<style>
.generator
{
	margin-top: 2rem;
}

.generator__name-container
{
	display: grid;
	grid-template-columns: 1fr min-content;
	justify-content: space-between;
	align-items: center;
}

.generator__name
{
	font-size: clamp(18px, 2.5rem, 40px);
	font-weight: bold;
}

.generator__btn > button
{
	padding: .125rem;
	cursor: pointer;
}

.generator__btn svg
{
	fill: var(--color-link);
	transition: transform 0.9s;
}

.generator__btn--die:hover svg
{
	transform: rotate(360deg);
}

.generator__log
{
	margin-top: 2rem;
	border-top: 1px solid var(--color-border);
	padding: 1rem 0;
	text-align: left;
	font-size: 70%;
	color: var(--color-text-muted);
}
</style>
