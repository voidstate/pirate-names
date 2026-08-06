<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const STORAGE_KEY = 'pirate-name-gender-preference'
const preferenceOptions = [
	{ value: 'male', label: 'Lads' },
	{ value: 'female', label: 'Lasses' },
	{ value: 'any', label: 'I\'ll take anyone!' },
]

const selectedPreference = ref( 'male' )

const RECRUITED_KEY = 'pirate-names-recruited'
const DEAD_KEY = 'pirate-names-dead'

const killAllPirates = () =>
{
	if ( typeof window === 'undefined' ) {
		return
	}

	// Clear stored recruited and dead/rejected pirates
	window.localStorage.removeItem( RECRUITED_KEY )
	window.localStorage.removeItem( DEAD_KEY )

	// Notify other parts of the app to reset their in-memory state
	window.dispatchEvent( new CustomEvent( 'piratesReset' ) )
}

const confirmOpen = ref( false )
const router = useRouter()

const openConfirm = () =>
{
	confirmOpen.value = true
}

const confirmAndGo = () =>
{
	killAllPirates()
	confirmOpen.value = false
	router.push( { name: 'main' } )
}

const closeConfirm = () =>
{
	confirmOpen.value = false
}

const loadPreference = () =>
{
	if ( typeof window === 'undefined' ) {
		return 'male'
	}

	const storedPreference = window.localStorage.getItem( STORAGE_KEY )
	return storedPreference && preferenceOptions.some( ( option ) => option.value === storedPreference )
		? storedPreference
		: 'male'
}

const savePreference = ( value ) =>
{
	selectedPreference.value = value

	if ( typeof window !== 'undefined' ) {
		window.localStorage.setItem( STORAGE_KEY, value )
	}
}

onMounted( () =>
{
	selectedPreference.value = loadPreference()
} )
</script>

<template>
	<div class="options-page">
		<h2>How do ye want to crew yer vessel, Cap'n?</h2>

		<fieldset class="options-page__fieldset">
			<div class="options-page__options">
				<div v-for="option in preferenceOptions" :key="option.value" class="options-page__option">
					<input type="radio" :name="STORAGE_KEY" :id="`preference-${option.value}`" :value="option.value" v-model="selectedPreference" class="options-page__input" @change="savePreference(option.value)" />
					<label :for="`preference-${option.value}`" class="options-page__button" :class="{ 'options-page__button--active': selectedPreference === option.value }">
						{{ option.label }}
					</label>
				</div>
			</div>
		</fieldset>

		<h2>Had enough of these lazy swabs?</h2>

		<div class="options-page__reset-wrapper">
			<div class="options-page__reset-button-wrapper">
				<button class="options-page__button" @click="openConfirm" title="Start again">
					<span class="options-page__inspect-label">Throw 'em overboard!'</span>
				</button>
			</div>

			<div v-if="confirmOpen" class="options-page__modal" role="dialog" aria-modal="true">
				<div class="options-page__modal-card">
					<p class="options-page__modal-intro">...and good riddance!</p>
					<div class="options-page__modal-actions">
						<div class="options-page__modal-action">
							<button class="options-page__button options-page__modal-action-button options-page__confirm-accept" @click="confirmAndGo">Recruit more pirates</button>
						</div>
						<div class="options-page__modal-action">
							<button class="options-page__button options-page__modal-action-button" @click="closeConfirm">Close</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<p class="options-page__back-btn-wrapper">
			<RouterLink :to="{ name: 'main' }"><font-awesome-icon icon="arrow-left" /> Back</RouterLink>
		</p>
	</div>
</template>

<style scoped>
.options-page
{
	margin-top: 2rem;
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

h2 {
	margin-bottom: 0;
}

.options-page__fieldset
{
	border: 0;
	padding: 0;
	margin: 0;
}

.options-page__options
{
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
}

.options-page__option
{
	display: flex;
	align-items: center;
}

.options-page__input
{
	position: absolute;
	opacity: 0;
	pointer-events: none;
}

.options-page__button
{
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: var(--button-padding);
	border: var(--border-width) solid var(--color-border);
	border-radius: var(--border-radius);
	background-color: var(--color-button-bg);
	color: var(--color-link);
	cursor: pointer;
	font-size: var(--font-size-button);
	font-weight: var(--font-weigt-button);
	line-height: var(--line-height-button);
	transition: background-color 0.2s ease, transform 0.2s ease;
}

.options-page__button:hover
{
	background-color: var(--color-button-bg-hover);
	color: var(--color-link);
	transform: translateY(-1px);
}

.options-page__button--active
{
	background-color: var(--color-link);
	color: var(--color-button-bg);
	border-color: var(--color-link);
}

.options-page__modal
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

.options-page__modal-card
{
	position: relative;
	background-color: var(--color-background-soft);
	border: var(--border-width) solid var(--color-border);
	border-radius: var(--border-radius);
	padding: 1.5rem;
	max-width: 36rem;
	width: 100%;
	text-align: center;
	box-shadow: 0 0 2rem .5rem var(--color-glow);
}

.options-page__modal-intro
{
	margin: 0 0 1rem;
	font-size: var(--font-size-title);
}

.options-page__modal-actions
{
	display: flex;
	justify-content: center;
	gap: 1.25rem;
	margin-bottom: 2rem;
}

.options-page__modal-action
{
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: .35rem;
}

.options-page__modal-action-button
{
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 3.25rem;
}

/* Match Name-Generator modal entrance animation */
.options-page__modal
{
	animation: modal-fade 180ms ease-out;
}

.options-page__modal-card
{
	animation: modal-pop 220ms cubic-bezier(0.2, 0.9, 0.25, 1);
	transform-origin: center top;
}

.options-page__back-btn-wrapper
{
	font-size: var(--font-size-body);
    margin-bottom: var(--margin-bottom-body);
}

@keyframes modal-fade
{
	from
	{
		opacity: 0
	}

	to
	{
		opacity: 1
	}
}

@keyframes modal-pop
{
	from
	{
		transform: translateY(8px) scale(0.985);
		opacity: 0
	}

	to
	{
		transform: translateY(0) scale(1);
		opacity: 1
	}
}
</style>
