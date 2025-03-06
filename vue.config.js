/*
# Troubleshooting

This file is not loaded - fails silently: https://stackoverflow.com/a/67893456/76363

Cannot convert to CommonJS as CJS for Vite is deprecated. https://stackoverflow.com/a/78568432/76363

Check these settings with: vue inspect --mode production
 */

/*

// CommonJS version

// vue.config.js
const { defineConfig } = require('@vue/cli-service')

// use relative path in production
module.exports = defineConfig({
	publicPath: process.env.NODE_ENV === 'production'
		? './xxx/'
		: '/'
})
*/

// Module version
//import '@vue/cli-service' from defineConfig
module.exports = {
	lintOnSave: true,
	publicPath:
		process.env.NODE_ENV === 'production'
			? './xxx/'
			: '/yyy/'

}
