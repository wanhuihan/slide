// import "@babel/polyfill";

// let slideCaptcha = {
// 	obj: {
// 		slideBox: null,
// 	},
// 	init: function(obj) {
// 		// 
// 		// {id, spiritUrl, slideBgUrl} = obj;
// 		// 
// 		let id = obj.id;
// 		let spiritUrl = obj.spiritUrl;
// 		let slideBgUrl = obj.slideBgUrl;

// 		this.obj.slideBox = document.getElementById(id);
// 		// 
// 		this.imageLoad(slideBgUrl).then( data => {
// 			this.slideBgDraw(data);
// 			return this.imageLoad(spiritUrl)
// 		}).then( data => {
// 			document.body.append(data)
// 		})
// 		// 
// 	},
// 	// 
// 	imageLoad: function(url) {
// 		// let slideBg = document.createElement('div');
// 		// slideBg.setAttribute('id', 'slideBg');
// 		return new Promise((resolve, reject) => {
//   		let image = new Image();
//   		image.src = url;
//   		image.onload = function() {
//   			resolve(image)
//   		}
// 		})
// 	},
// 	// 
// 	slideBgDraw: function(image) {
// 		// 
// 		let slideBg = document.createElement('div')
// 		slideBg.setAttribute('id', 'slideBg');
// 		slideBg.append(image);
// 		// 
// 		this.obj.slideBox.append(slideBg)
// 	}

// }
// // 
// window.onload = function() {
// slideCaptcha.init({
// 	id: 'slideCaptcha',
// 	spiritUrl: 'http://www.epicc.com.cn/idprovider/static/images/webpic.png',
// 	slideBgUrl: 'http://10.10.40.21:7005/kpzym/dlzcymlbt/201510/W020170224606831760725.png',

// })     	
// }
// 
console.log(123)
alert(123)