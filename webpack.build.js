// 
// require('babel-polyfill');

const path = require('path');
// 
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
	// 
	mode: 'development',
	entry:  [path.resolve(__dirname, 'src/index.js')],
	// entry: path.resolve(__dirname, 'src/index.js'),
	// 
	output: {
		filename: 'build.js',
		path: path.resolve(__dirname, 'build')
	},
	// 
	// devServer: {
	// 	contentBase: './',
	// 	progress: true
	// },
	plugins: [
		new HtmlWebpackPlugin({
			template: './index.html'
		})
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude:/(node_modules|bower_components)/,//排除掉node_module目录
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			}
		]
	}
