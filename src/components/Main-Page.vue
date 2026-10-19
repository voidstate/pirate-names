<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import NameGenerator from './Name-Generator.vue'

const nameGenerator = ref( null )
const route = useRoute()
const router = useRouter()

const openShipfulModalFromRoute = () =>
{
	if ( route.query.recruit !== 'shipful' || !nameGenerator.value ) {
		return
	}

	nameGenerator.value.openShipfulModal()
	router.replace( {
		name: 'main',
		query: { ...route.query, recruit: undefined },
	} )
}

onMounted( openShipfulModalFromRoute )
watch( () => route.query.recruit, openShipfulModalFromRoute, { flush: 'post' } )
</script>

<template>
	<div class="main-page__name-generator">
		<NameGenerator ref="nameGenerator" />
	</div>
</template>

<style scoped></style>
