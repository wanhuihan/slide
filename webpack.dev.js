// 
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
	// 
	mode: 'development',
	entry:  ["@babel/polyfill", path.resolve(__dirname, 'src/index.js')],
	// entry: path.resolve(__dirname, 'src/index.js'),
	// 
	output: {
		filename: 'build.js',
		path: path.resolve(__dirname, 'build')
	},
	// 
	devServer: {
		contentBase: './',
		progress: true,
		disableHostCheck:true,
		proxy: {
		'/': {
			target: 'http://11.205.243.80:18080',
			changeOrigin: false
			}
		}
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './index.html'
		}),        
		new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            chunkFilename: "[id].css"
        })

	],
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude:/(node_modules)/,//排除掉node_module目录
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			},
			{
				test: /\.scss$/,
				use: [
					"style-loader",
					"css-loader",
					"sass-loader"
				]
			},
			{
				test: /\.(png|jpe?g|gif)$/i,
				use: [
					{
						loader: 'url-loader',
						options: {}
					}
				]
			}
		]
	}
}