<script setup>

import { computed, ref } from 'vue'

import adjectives from '../data/adjectives.json' with { type: 'json' }
import nouns from '../data/nouns.json' with { type: 'json' }
import forenames from '../data/forenames.json' with { type: 'json' }
import surnames from '../data/surnames.json' with { type: 'json' }
import titles from '../data/titles.json' with { type: 'json' }
import deaths from '../data/deaths.json' with { type: 'json' }
import eaters from '../data/eaters.json' with { type: 'json' }
import places from '../data/places.json' with { type: 'json' }

import templates from '../data/templates.json' with { type: 'json' }

import { normalizeTemplateEntries, pickWeightedItem } from '../utils/weightedSelection'

const templateEntries = normalizeTemplateEntries( templates )

const getRandomElement = ( array ) =>
{
	return array[ Math.floor( Math.random() * array.length ) ]
}

const animatingDeath = ref( false )
const deadPirates = ref( [] )
const recruitedPirates = ref( [] )
const pendingPirate = ref( null )
const isModalOpen = ref( false )
const hasGeneratedPirate = ref( false )

const deadPiratesOutput = computed( () =>
{
	if ( !deadPirates.value.length ) {
		return ''
	}

	return deadPirates.value
		.slice( 0, 10 )
		.map( ( pirate, index ) => `<span class="log-${ index }">${ pirate }</span>` )
		.join( ', ' )
} )

const recruitedPiratesOutput = computed( () =>
{
	if ( !recruitedPirates.value.length ) {
		return ''
	}

	return recruitedPirates.value
		.slice( 0, 10 )
		.map( ( pirate, index ) => `<span class="recruit-${ index }">${ pirate }</span>` )
		.join( ', ' )
} )

const decodeHtmlEntities = ( value ) =>
{
	if ( !value ) {
		return ''
	}

	return value
		.replace( /&quot;/g, '"' )
		.replace( /&#39;/g, "'" )
		.replace( /&amp;/g, '&' )
		.replace( /&#8216;/g, '‘' )
		.replace( /&#8217;/g, '’' )
		.replace( /&#8220;/g, '“' )
		.replace( /&#8221;/g, '”' )
		.replace( /&#8230;/g, '…' )
}

const generatePirateName = () =>
{
	const selectedTemplate = pickWeightedItem( templateEntries )
	const randomTemplate = selectedTemplate?.template ?? templateEntries[ 0 ]?.template ?? ''

	const generatedName = randomTemplate
		.replace( /%adjective%/, getRandomElement( adjectives ) )
		.replace( /%adjective%/, getRandomElement( adjectives ) )
		.replace( /%noun%/, getRandomElement( nouns ) )
		.replace( /%noun%/, getRandomElement( nouns ) )
		.replace( /%forename%/g, getRandomElement( forenames ) )
		.replace( /%surname%/g, getRandomElement( surnames ) )
		.replace( /%title%/g, getRandomElement( titles ) )
		.replace( /%place%/g, getRandomElement( places ) )

	return decodeHtmlEntities( generatedName )
}

const openPirateModal = () =>
{
	pendingPirate.value = generatePirateName()
	isModalOpen.value = true
	name.value = 'A new pirate approaches...'
	hasGeneratedPirate.value = true
}

const recruitPirate = () =>
{
	if ( !pendingPirate.value ) {
		return
	}

	recruitedPirates.value.unshift( pendingPirate.value )
	if ( recruitedPirates.value.length > 10 ) {
		recruitedPirates.value.pop()
	}

	pendingPirate.value = null
	isModalOpen.value = false
}

const killPirate = () =>
{
	if ( !pendingPirate.value ) {
		return
	}

	let causeOfDeath = ''
	if ( Math.random() < .4 ) {
		causeOfDeath = 'eaten by ' + getRandomElement( eaters )
	}
	else {
		causeOfDeath = getRandomElement( deaths )
	}

	deadPirates.value.unshift( `${ pendingPirate.value } (${ causeOfDeath })` )
	if ( deadPirates.value.length > 10 ) {
		deadPirates.value.pop()
	}

	pendingPirate.value = null
	isModalOpen.value = false
}

const closeModal = () =>
{
	pendingPirate.value = null
	isModalOpen.value = false
}

const name = ref( 'A new pirate approaches...' )

</script>

<template>
	<div class="generator">
		<div class="generator__name-container">
			<div class="generator__name" :class="{ 'generator__btn--die-anim': animatingDeath }">
				<span v-html="name"></span>
			</div>
			<div class="generator__inspect-action">
				<button class="generator__btn-button generator__btn-button--inspect" @click="openPirateModal" :title="hasGeneratedPirate ? 'Generate another pirate!' : 'Generate your first pirate!'">
					<font-awesome-icon icon="coins" />
					<span class="generator__inspect-label">Bring 'im aboard</span>
				</button>
			</div>
		</div>

		<div v-if="isModalOpen" class="generator__modal" role="dialog" aria-modal="true">
			<div class="generator__modal-card">
				<p class="generator__modal-intro">Ahoy there, my name is...</p>
				<p class="generator__modal-title">{{ pendingPirate }}</p>
				<div class="generator__modal-actions">
					<div class="generator__modal-action">
						<button class="generator__btn-button generator__modal-action-button generator__btn-button--recruit" title="Recruit" @click="recruitPirate">
							<font-awesome-icon icon="anchor" />
							<span class="generator__modal-action-label">Recruit</span>
						</button>
					</div>
					<div class="generator__modal-action">
						<button class="generator__btn-button generator__modal-action-button generator__btn-button--kill" title="Kill" @click="killPirate">
							<font-awesome-icon icon="skull" />
							<span class="generator__modal-action-label">Kill</span>
						</button>
					</div>
				</div>
				<!-- <button class="generator__modal-close" @click="closeModal"><font-awesome-icon icon="xmark" /> Close</button> -->
			</div>
		</div>

		<div class="generator__factoid"></div>
		<div v-if="recruitedPiratesOutput.length" class="generator__log generator__log--recruited">
			<div class="generator__log-title">Recruited pirates</div>
			<div v-html="recruitedPiratesOutput"></div>
		</div>
		<div v-if="deadPiratesOutput.length" class="generator__log">
			<div class="generator__log-title">Dead pirates</div>
			<div v-html="deadPiratesOutput"></div>
		</div>
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
	grid-template-columns: 1fr max-content;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
}

.generator__btn-button
{
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 1rem 1.5rem;
	cursor: pointer;
	background-color: var(--color-button-bg);
	color: var(--color-link);
	border: .125rem solid var(--color-border);
	border-radius: 1rem;
	font-size: 3rem;
	transition: background-color 0.3s ease;

	&:hover {
		background-color: var(--color-button-bg-hover);
	}
}

.generator__modal-close
{
	display: inline-flex;
	align-items: center;
	gap: .35rem;
	padding: .35rem 1rem;
	cursor: pointer;
	border: .15rem solid var(--color-border);
	border-radius: 1rem;
	background: transparent;
	color: var(--color-link);
	font-size: 1.5rem;
	font-weight: bold;
}

.generator__btn-button :is(svg, path)
{
	fill: currentColor;
	stroke: currentColor;
	transition: transform 0.9s;
}

.generator__btn-button:hover svg
{
	transform: rotate(360deg);
}

.generator__btn--die-anim
{
	transition: transform 1s ease-out,
		opacity 1s ease-out;
	transform: translateY(40px);
	opacity: 0;
}

.generator__modal
{
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.65);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 1rem;
	z-index: 50;
}

.generator__modal-card
{
	background-color: var(--color-background-soft);
	border: .25rem solid var(--color-border);
	border-radius: 1rem;
	padding: 1.5rem;
	max-width: 36rem;
	width: 100%;
	text-align: center;
	box-shadow: 0 0 2rem .5rem var(--color-glow);
}

.generator__modal-intro
{
	margin: 0 0 1rem;
	font-size: 1.25rem;
}

.generator__modal-title
{
	margin: 0 0 2rem;
	font-weight: bold;
}

.generator__modal-name
{
	margin: 0 0 1rem;
	font-size: 1.25rem;
	color: var(--color-text-grey);
}

.generator__modal-actions
{
	display: flex;
	justify-content: center;
	gap: 1.25rem;
	margin-bottom: 2rem;
}

.generator__modal-action
{
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: .35rem;
}

.generator__modal-action-button
{
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 3.25rem;
}

.generator__inspect-label,
.generator__modal-action-label
{
	transform: none;
	font-size: 1.25rem;
	font-weight: bold;
	color: var(--color-text-muted);
	text-align: center;
}

.generator__log
{
	margin-top: 1.5rem;
	border-top: 1px solid var(--color-border);
	padding: 1rem 0;
	text-align: left;
	font-size: 70%;
	color: var(--color-text-muted);
}

.generator__log-title
{
	font-weight: bold;
	margin-bottom: .5rem;
	color: var(--color-text-grey);
}

.generator__log span.log-0,
.generator__log span.recruit-0
{
	color: var(--color-text-grey);
}

.generator__log span.log-1,
.generator__log span.recruit-1
{
	color: var(--color-text-greyer);
}

.generator__log span
{
	color: var(--color-text-greyest);
}
</style>
