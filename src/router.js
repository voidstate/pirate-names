import { createRouter, createWebHashHistory } from 'vue-router'

const getBasePath = () => {
	const redirect = window.location.search.includes('redirect=')
		? new URLSearchParams(window.location.search).get('redirect')
		: ''

	return redirect ? redirect : '/'
}

import MainPage from './components/Main-Page.vue'
import AboutPage from './components/About-Page.vue'

const routes = [
	{ path: '/', name: 'main', component: MainPage },
	{ path: '/about', name: 'about', component: AboutPage },
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
})

router.beforeEach( ( to, from, next ) => {
	const redirect = new URLSearchParams( window.location.search ).get( 'redirect' )
	if ( redirect && to.path === '/' ) {
		next( { path: redirect, replace: true } )
		return
	}
	next()
} )

export default router
