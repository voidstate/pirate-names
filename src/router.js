import { createMemoryHistory, createRouter } from 'vue-router'

import MainPage from './components/Main-Page.vue'
import AboutPage from './components/About-Page.vue'

const routes = [
	{ path: '/', name: 'main', component: MainPage },
	{ path: '/about', name: 'about', component: AboutPage },
]

const router = createRouter({
	history: createMemoryHistory(),
	routes,
})

export default router
