import './assets/main.css'

import { createApp } from 'vue'
import router from './router'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import
	{
		faGithub
	} from '@fortawesome/free-brands-svg-icons'

import
	{
		faArrowLeft,
		faCircleXmark,
		faCoins,
		faHand,
		faXmark,
		faSkull,
		faAnchor
	} from '@fortawesome/free-solid-svg-icons'

library.add(
	faArrowLeft,
	faCircleXmark,
	faCoins,
	faHand,
	faXmark,
	faSkull,
	faAnchor,
	faGithub
)

const app = createApp( App )
app.use( router )
app.component( 'font-awesome-icon', FontAwesomeIcon )
app.mount( '#app' )
