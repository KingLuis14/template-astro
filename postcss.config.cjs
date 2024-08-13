const autoprefixer = require('autoprefixer');
const postcssPresetEnv = require('postcss-preset-env');
 
module.exports = {
 	plugins: [
 		postcssPresetEnv({
 			stage: 2,
 			features: {
 				
 				
 				'media-query-ranges': true,
 			},
 		}),
 		autoprefixer(),
 	],
 };