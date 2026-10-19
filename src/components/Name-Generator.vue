<script setup>

import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

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
const preferenceOptions = [ 'male', 'female', 'any' ]
const nationalityOptions = [ 'english', 'french', 'spanish', 'other' ]
const nationalityPreferenceOptions = [ ...nationalityOptions, 'any' ]
const RECRUIT_FADE_DURATION_MS = 250
const RECRUIT_FADE_OVERLAP_MS = 75

const animatingDeath = ref( false )
const deadPirates = ref( [] )
const recruitedPirates = ref( [] )
const pendingPirate = ref( null )
const isModalOpen = ref( false )
const isShipfulModalOpen = ref( false )
const shipfulCount = ref( 10 )
const hasGeneratedPirate = ref( false )
const selectedPreference = ref( 'male' )
const selectedNationality = ref( 'any' )
const nameEl = ref( null )

const STORAGE_KEY = 'pirate-name-gender-preference'
const NATIONALITY_STORAGE_KEY = 'pirate-name-nationality-preference'
const RECRUITED_KEY = 'pirate-names-recruited'
const DEAD_KEY = 'pirate-names-dead'
const LAST_NAME_KEY = 'pirate-names-last'
let nextRecruitedPirateId = 0

const createRecruitedPirate = ( name, fadeDelay = 0 ) =>
{
	return { id: nextRecruitedPirateId++, name, fadeDelay }
}

const getRandomElement = ( array ) =>
{
	return array[ Math.floor( Math.random() * array.length ) ]
}

const getSelectedNationalities = () =>
{
	return selectedNationality.value === 'any'
		? nationalityOptions
		: [ selectedNationality.value ]
}

const getForenames = () =>
{
	const selectedNationalities = getSelectedNationalities()
	const maleForenames = selectedNationalities.flatMap( ( nationality ) => forenames[ nationality ].male )
	const femaleForenames = selectedNationalities.flatMap( ( nationality ) => forenames[ nationality ].female )

	if ( selectedPreference.value === 'female' ) {
		return femaleForenames
	}

	if ( selectedPreference.value === 'any' ) {
		return [ ...maleForenames, ...maleForenames, ...femaleForenames ]
	}

	return maleForenames
}

const getSurnames = () =>
{
	return getSelectedNationalities().flatMap( ( nationality ) => surnames[ nationality ] )
}

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

watch( selectedNationality, ( value ) =>
{
	if ( typeof window !== 'undefined' ) {
		window.localStorage.setItem( NATIONALITY_STORAGE_KEY, value )
	}
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
	const forenames = getForenames()
	const selectedSurnames = getSurnames()

	const generatedName = randomTemplate
		.replace( /%adjective%/, getRandomElement( adjectives ) )
		.replace( /%adjective%/, getRandomElement( adjectives ) )
		.replace( /%noun%/, getRandomElement( nouns ) )
		.replace( /%noun%/, getRandomElement( nouns ) )
		.replace( /%forename%/g, getRandomElement( forenames ) )
		.replace( /%surname%/g, getRandomElement( selectedSurnames ) )
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

const openShipfulModal = () =>
{
	shipfulCount.value = 10
	isShipfulModalOpen.value = true
}

const recruitPirate = () =>
{
	if ( !pendingPirate.value ) {
		return
	}

	recruitedPirates.value.unshift( createRecruitedPirate( pendingPirate.value ) )

	pendingPirate.value = null
	isModalOpen.value = false
	// trigger approach animation on main name display
	triggerApproachAnimation( nameEl.value )
}

const isShipfulCountValid = computed( () =>
	Number.isInteger( shipfulCount.value ) && shipfulCount.value >= 1 && shipfulCount.value <= 99
)

const recruitShipful = () =>
{
	if ( !isShipfulCountValid.value ) {
		return
	}

	const newPirates = Array.from( { length: shipfulCount.value }, generatePirateName )
	const recruitedBatch = newPirates.map( ( pirateName, index ) =>
		createRecruitedPirate( pirateName, index * ( RECRUIT_FADE_DURATION_MS - RECRUIT_FADE_OVERLAP_MS ) )
	)
	recruitedPirates.value.unshift( ...recruitedBatch )
	name.value = 'A new pirate approaches...'
	hasGeneratedPirate.value = true
	isShipfulModalOpen.value = false

}

const giveBlackSpot = ( pirate ) =>
{
	recruitedPirates.value = recruitedPirates.value.filter( ( recruitedPirate ) => recruitedPirate.id !== pirate.id )
	deadPirates.value.unshift( `${ pirate.name } (Black spot)` )
	if ( deadPirates.value.length > 10 ) {
		deadPirates.value.pop()
	}
}

const closeShipfulModal = () =>
{
	isShipfulModalOpen.value = false
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
	// trigger approach animation on main name display
	triggerApproachAnimation( nameEl.value )
}

// helper to toggle the approach animation class
const triggerApproachAnimation = ( el ) =>
{
	if ( !el ) return
	el.classList.remove( 'animate-approach' )
	// force reflow so re-adding the class restarts the animation
	// eslint-disable-next-line @typescript-eslint/no-unused-expressions
	void el.offsetWidth
	el.classList.add( 'animate-approach' )
	const onEnd = () => {
		el.classList.remove( 'animate-approach' )
		el.removeEventListener( 'animationend', onEnd )
	}
	el.addEventListener( 'animationend', onEnd )
}

const onNameClick = () => {
	triggerApproachAnimation( nameEl.value )
}

const closeModal = () =>
{
	pendingPirate.value = null
	isModalOpen.value = false
}

defineExpose( { openShipfulModal } )

const name = ref( 'A new pirate approaches...' )

const loadPreference = () =>
{
	if ( typeof window === 'undefined' ) {
		return 'male'
	}

	const storedPreference = window.localStorage.getItem( STORAGE_KEY )
	return storedPreference && preferenceOptions.includes( storedPreference )
		? storedPreference
		: 'male'
}

const loadNationalityPreference = () =>
{
	if ( typeof window === 'undefined' ) {
		return 'any'
	}

	const storedPreference = window.localStorage.getItem( NATIONALITY_STORAGE_KEY )
	return storedPreference && nationalityPreferenceOptions.includes( storedPreference )
		? storedPreference
		: 'any'
}

onMounted( () =>
{
	selectedPreference.value = loadPreference()
	selectedNationality.value = loadNationalityPreference()

	if ( typeof window !== 'undefined' ) {
		try {
			const storedRecruited = JSON.parse( window.localStorage.getItem( RECRUITED_KEY ) || '[]' )
			if ( Array.isArray( storedRecruited ) ) {
				recruitedPirates.value = storedRecruited
					.filter( ( pirate ) => typeof pirate === 'string' )
					.map( createRecruitedPirate )
			}
		}
		catch ( e ) {
			// fail silently
		}

		try {
			const storedDead = JSON.parse( window.localStorage.getItem( DEAD_KEY ) || '[]' )
			if ( Array.isArray( storedDead ) ) deadPirates.value = storedDead
		}
		catch ( e ) {
			// fail silently
		}

		const last = window.localStorage.getItem( LAST_NAME_KEY )
		if ( last ) {
			name.value = last
			hasGeneratedPirate.value = true
		}
	}
} )

// Listen for a global reset event so the options page can clear recruits/rejected
const handlePiratesReset = () =>
{
	recruitedPirates.value = []
	deadPirates.value = []

 	if ( typeof window !== 'undefined' ) {
 		window.localStorage.removeItem( RECRUITED_KEY )
 		window.localStorage.removeItem( DEAD_KEY )
 	}
}

window.addEventListener( 'piratesReset', handlePiratesReset )

onUnmounted( () => {
 	window.removeEventListener( 'piratesReset', handlePiratesReset )
} )

watch( recruitedPirates, ( val ) =>
{
	if ( typeof window !== 'undefined' ) {
		window.localStorage.setItem( RECRUITED_KEY, JSON.stringify( val.map( ( pirate ) => pirate.name ) ) )
	}
}, { deep: true } )

watch( deadPirates, ( val ) =>
{
	if ( typeof window !== 'undefined' ) {
		window.localStorage.setItem( DEAD_KEY, JSON.stringify( val || [] ) )
	}
}, { deep: true } )

watch( name, ( val ) =>
{
	if ( typeof window !== 'undefined' ) {
		window.localStorage.setItem( LAST_NAME_KEY, val || '' )
	}
} )

const inspectLabel = computed( () =>
{
	if ( selectedPreference.value === 'female' ) {
		return "Bring 'er aboard"
	}

	if ( selectedPreference.value === 'any' ) {
		return "Bring 'em aboard"
	}

	return "Bring 'im aboard"
} )

</script>

<template>
	<div class="generator" :style="{ '--recruit-fade-duration': `${ RECRUIT_FADE_DURATION_MS }ms` }">
		<div class="generator__name-container">
			<div class="generator__name" ref="nameEl" @click="onNameClick" :class="{ 'generator__btn--die-anim': animatingDeath }">
				<span v-html="name"></span>
			</div>
			<div class="generator__actions">
				<div class="generator__inspect-action">
					<button class="generator__btn-button generator__btn-button--inspect" @click="openPirateModal" :title="hasGeneratedPirate ? 'Generate another pirate!' : 'Generate your first pirate!'">
						<font-awesome-icon icon="coins" />
						<span class="generator__inspect-label">{{ inspectLabel }}</span>
					</button>
				</div>
			</div>
		</div>

		<Teleport to="body">
			<div v-if="isModalOpen" class="generator__modal" role="dialog" aria-modal="true">
				<div class="generator__modal-card">
					<div class="generator__modal-close-icon" @click="closeModal"><font-awesome-icon icon="circle-xmark" /></div>
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
								<span class="generator__modal-action-label">Reject</span>
							</button>
						</div>
					</div>
					<!-- <button class="generator__modal-close" @click="closeModal"><font-awesome-icon icon="xmark" /> Close</button> -->
				</div>
			</div>

			<div v-if="isShipfulModalOpen" class="generator__modal" role="dialog" aria-modal="true" aria-labelledby="shipful-modal-title">
				<form class="generator__modal-card generator__shipful-card" @submit.prevent="recruitShipful">
					<button class="generator__modal-close-icon" type="button" aria-label="Close" @click="closeShipfulModal">
						<font-awesome-icon icon="circle-xmark" />
					</button>
					<label id="shipful-modal-title" class="generator__modal-intro" for="shipful-count">
						How many scallywags d'ye need?
					</label>
					<input
						id="shipful-count"
						v-model.number="shipfulCount"
						class="generator__shipful-count"
						type="number"
						min="1"
						max="100"
						step="1"
						required
					/>
					<button class="generator__btn-button generator__shipful-submit" type="submit" :disabled="!isShipfulCountValid">
						<font-awesome-icon icon="anchor" />
						<span>Bring 'em aboard</span>
					</button>
				</form>
			</div>
		</Teleport>

		<div class="generator__factoid"></div>
		<div v-show="recruitedPirates.length" class="generator__log generator__log--recruited">
			<h3 class="generator__log-title">Recruited pirates</h3>
			<TransitionGroup name="recruit-fade" tag="p" class="generator__recruited-list">
				<span
					v-for="pirate in recruitedPirates"
					:key="pirate.id"
					class="generator__recruit-entry"
					:style="{ '--recruit-fade-delay': `${ pirate.fadeDelay }ms` }"
				>
					<a href="#" class="generator__recruit-link" @click.prevent="giveBlackSpot( pirate )">
						{{ pirate.name }}<span class="generator__recruit-tooltip">Give the Black Spot</span>
					</a>
				</span>
			</TransitionGroup>
		</div>
		<div v-if="deadPiratesOutput.length" class="generator__log">
			<h3 class="generator__log-title">Rejected pirates</h3>
			<p v-html="deadPiratesOutput"></p>
		</div>
	</div>
</template>

<style>
.generator
{
	font-family: var(--font-family-body);
	margin-top: 2rem;
}

.generator__name-container
{
	display: grid;
	grid-template-columns: 1fr max-content;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
	overflow: visible;
}

.generator__name {
	font-size: var(--font-size-title);
	display: inline-block;
	overflow: visible;
	will-change: transform, opacity;
}

.generator__name.animate-approach {
	display: inline-block;
	transform-origin: center bottom;
	position: relative;
	z-index: 10;
	animation: approach-and-sway 900ms cubic-bezier(.22,1.15,.35,1.02) both;
}

.generator__actions
{
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 0.75rem;
}

.generator__options-link
{
	font-weight: 700;
	color: var(--color-link);
	text-decoration: none;
}

.generator__options-link:hover
{
	text-decoration: underline;
}

.generator__btn-button
{
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: var(--space-2) var(--space-3);
	cursor: pointer;
	background-color: var(--color-button-bg);
	color: var(--color-link);
	border: var(--border-width) solid var(--color-border);
	border-radius: var(--border-radius);
	font-size: var(--font-size-button);
	transition: background-color var(--button-transition-duration) ease;

	&:hover
	{
		background-color: var(--color-button-bg-hover);
	}
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
	background: var(--modal-overlay-background);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: var(--space-2);
	z-index: var(--modal-z-index);
}

.generator__modal-card
{
	position: relative;
	background-color: var(--color-background-soft);
	border: var(--border-width) solid var(--color-border);
	border-radius: var(--border-radius);
	padding: var(--modal-padding);
	max-width: var(--modal-max-width);
	width: 100%;
	text-align: center;
	box-shadow: var(--modal-shadow);
}

.generator__shipful-card
{
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
}

.generator__shipful-card .generator__modal-intro
{
	margin: 0;
}

.generator__shipful-count
{
	width: 8rem;
	padding: var(--space-1);
	border: var(--border-width) solid var(--color-border);
	border-radius: var(--border-radius);
	background-color: var(--color-background);
	color: var(--color-text);
	font-size: var(--font-size-title);
	text-align: center;
}

.generator__shipful-count::-webkit-inner-spin-button,
.generator__shipful-count::-webkit-outer-spin-button
{
	-webkit-appearance: none;
	margin: 0;
}

.generator__shipful-count
{
	-moz-appearance: textfield;
}

.generator__shipful-submit:disabled
{
	cursor: not-allowed;
	opacity: .5;
}

.generator__modal-close-icon {
	position: absolute;
	top: .5rem;
	right: .5rem;
	cursor: pointer;
	color: var(--color-glow);
	font-size: var(--font-size-button);

	&:hover {
		color: var(--color-glow-mute);
	}
}

.generator__modal-intro
{
	margin: 0 0 1rem;
	font-size: var(--font-size-body);
}

.generator__modal-title
{
	margin: 0 0 2rem;
	font-size: var(--font-size-title);
}

.generator__modal-name
{
	margin: 0 0 1rem;
	font-size: var(--font-size-body);
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
	font-size: var(--font-size-subtitle);
	font-weight: bold;
	color: var(--color-text-muted);
	text-align: center;
}

.generator__log
{
	margin-top: 1.5rem;
	border-top: 1px solid var(--color-border);
	padding: var(--space-2) 0 0;
	text-align: left;
	font-size: var(--font-size-body);
	color: var(--color-text-muted);
}

.generator__log-title
{
	font-size: var(--font-size-subtitle);
	margin-bottom: .5rem;
	color: var(--color-text-grey);
}

.generator__recruit-link
{
	position: relative;
	color: inherit;
	text-decoration: none;
}

.generator__recruit-link:hover
{
	color: var(--color-link-active);
	text-decoration: underline;
}

.generator__recruit-tooltip
{
	position: absolute;
	left: 50%;
	bottom: calc(100% + var(--space-1));
	z-index: 1;
	display: none;
	padding: var(--space-1);
	transform: translateX(-50%);
	border: var(--border-width) solid var(--color-border);
	border-radius: var(--border-radius);
	background-color: var(--color-background-soft);
	box-shadow: var(--modal-shadow);
	white-space: nowrap;
	color: var(--color-text);
}

.generator__recruit-link:hover .generator__recruit-tooltip,
.generator__recruit-link:focus .generator__recruit-tooltip
{
	display: block;
}

.generator__recruit-entry:not(:last-child)::after
{
	content: ', ';
}

.recruit-fade-enter-active
{
	transition: opacity var(--recruit-fade-duration) ease var(--recruit-fade-delay);
}

.recruit-fade-enter-from
{
	opacity: 0;
}

.generator__log span.log-0,
.generator__log span.generator__recruit-entry:first-child
{
	color: var(--color-text-grey);
}

.generator__log span.log-1
{
	color: var(--color-text-greyer);
}

.generator__log span
{
	color: var(--color-text-greyest);
}

@media (max-width: 768px)
{
	.generator__name-container
	{
		display: flex;
		flex-direction: column;
	}

	.generator__modal-card
	{
		margin: 0 2rem;
	}
}

/* Small fade/scale animation for modal appearance */
.generator__modal {
	animation: modal-fade var(--modal-fade-duration) var(--modal-fade-easing);
}

.generator__modal-card {
	animation: modal-pop var(--modal-pop-duration) var(--modal-pop-easing);
	transform-origin: center top;
}
</style>
