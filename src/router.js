import { createRouter, createWebHashHistory } from 'vue-router'

import MainPage from './components/Main-Page.vue'
import AboutPage from './components/About-Page.vue'
import OptionsPage from './components/Options-Page.vue'

const routes = [
	{ path: '/', name: 'main', component: MainPage },
	{ path: '/about', name: 'about', component: AboutPage },
	{ path: '/options', name: 'options', component: OptionsPage },
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
