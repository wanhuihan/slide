// import 'babel-polyfill';
// 
import './scss/index.scss';

let slideCaptcha = {
	// 
	obj: {
		slideBox: null,
		defaultPoint: {},
		getImageUrl: '',
		validCheck: '',
		randomNo: parseInt(Math.random() * 10000000)
	},
	// 
	init: function(obj) {
		// 
		let id = obj.id;
		let spiritUrl = obj.spiritUrl;
		let slideBgUrl = obj.slideBgUrl;
		// 
		this.obj.getImageUrl = obj.getResource;
		this.obj.validCheck = obj.validCheck;
		this.obj.defaultPoint.x = obj.defaultPoint.x;
		this.obj.defaultPoint.y = obj.defaultPoint.y;
		this.obj.slideBox = document.getElementById(id);
		// 
		this.getImage(this.obj.randomNo).then(data => {
			// console.log(data.data);
			spiritUrl = data.data.newImage;
			slideBgUrl = data.data.oriCopyImage;
			this.obj.defaultPoint.x = 0;
			this.obj.defaultPoint.y = data.data.yPoint;
			// 
			return this.imageLoad(slideBgUrl);

		}).then( data => {

			this.slideBgDraw(data);
			return this.imageLoad(spiritUrl)

		}).then( data => {

			this.slideSpiritDraw(data);
			// 
			this.slidebarCreate();
			// 
			this.successStatusAdd()
			// 
			this.dragEventInit();
		})
		// 
	},
	// 
	imageLoad: function(url) {
		return new Promise((resolve, reject) => {
  		let image = new Image();
  		image.src = 'data:image/png;base64,' + url;
  		image.onload = function() {
  			resolve(image)
  		}
		})
	},
	// 
	slideBgDraw: function(image) {
		// 
		let slideBg = document.createElement('div')
		slideBg.setAttribute('id', 'slideBg');
		slideBg.appendChild(image);
		// 
		this.obj.slideBox.appendChild(slideBg)
	},
	// 
	slideSpiritDraw: function (image) {
		let spiritDiv = document.createElement('span');
		spiritDiv.setAttribute('id', 'slideSpirit');
		// 
		spiritDiv.appendChild(image);
		// 
		spiritDiv.style.left = this.obj.defaultPoint.x + 'px' || 0;
		// 
		spiritDiv.style.top = this.obj.defaultPoint.y + 'px';

		let slideBg = document.getElementById('slideBg');
		slideBg.appendChild(spiritDiv)
	},
	// 
	slidebarCreate: function() {
		// 
		let slidebar = document.getElementById('slidebar');
		if (!slidebar) {
			let bar = document.createElement('div');
			bar.setAttribute('id', "slideBar");
			bar.setAttribute('class', 'slidebar');
			// 
			let slideCircle = document.createElement('span');
			slideCircle.setAttribute('id', 'slideBarCircle');
			bar.appendChild(slideCircle);
			// 
			this.obj.slideBox.appendChild(bar)			
		}
	},
	// 
	dragEventInit: function() {
		// 
		let _that = this;
		// 
		let slideCircle = document.getElementById('slideBarCircle');
		let slideSpirit = document.getElementById('slideSpirit');
		let startX;
		let dragX;
		// 
		slideCircle.addEventListener('mousedown', mouseDown);
		// 
		function mouseDown(e) {
			startX = e.clientX;
			document.body.addEventListener('mousemove',mouseMove)	
			// 
			document.body.addEventListener('mouseup', mouseUp)			
		}
		//
		function mouseMove (e) {
			if (e.clientX - startX > 0 && e.clientX - startX < document.getElementById('slideBg').clientWidth - document.getElementById('slideSpirit').clientWidth + 5) {
				if (startX) {
					moveCalc(slideCircle, startX, e.clientX);
					// 
					moveCalc(slideSpirit, startX, e.clientX)
				}				
			}
		}	
		//
		function moveCalc(target, startX, moveX) {
			// 
			dragX = moveX - startX;
			target.style.left = dragX + 'px'
		}
		// 
		function mouseUp(e) {
			document.body.removeEventListener('mousemove', mouseMove);
			document.body.removeEventListener('mouseup', mouseUp);
			// 
			_that.validCheck(dragX).then (data => {
				if (data.status === 0) {
					// 
					document.getElementById('successBg').classList.add('success');
					// 
					// document.getElementById('slideBg').classList.add('success')
					// 
					let removeStatus = setTimeout(function() {
						document.getElementById('successBg').classList.remove('success')
						clearTimeout(removeStatus)
					},1000)
				} else {
					resetPoint()
				}
			})			
		}
		// 
		function resetPoint() {
			slideCircle.style.left = 0;
			slideSpirit.style.left = 0;
		}
	},

	mousemoveEvent: function(e) {

	},
	// 
	ajaxCall: function() {

	},
	getImage: function(params) {
		return new Promise( (resolve, reject) => {
			let xhr = new XMLHttpRequest();
			xhr.open('post', this.obj.getImageUrl, true);	
			xhr.setRequestHeader('Content-Type','application/json');	
			xhr.onreadystatechange = function() {
				if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
					let res = JSON.parse(xhr.response)
					resolve(res);
				}
			}		
			xhr.send(JSON.stringify({flowId: params}))	
		})
	},
	validCheck: function(pointX) {
		// 
		return new Promise( (resolve, reject) => {
			let xhr = new XMLHttpRequest();
			xhr.open('post', this.obj.validCheck, true);	
			xhr.setRequestHeader('Content-Type','application/json');
			xhr.onreadystatechange = function() {
				if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
					let res = JSON.parse(xhr.response)
					resolve(res);
				}
			}		
			xhr.send(JSON.stringify({flowId: this.obj.randomNo, xPoint: pointX}))	
		})
		// 
	},
	// 
	successStatusAdd: function() {
		let successStatus = document.createElement('div');
		successStatus.setAttribute('id', 'successBg');
		// successStatus.setAttribute('class', 'success-bg');
		successStatus.style.height = document.getElementById('slideBg').clientHeight + 'px'
		document.getElementById('slideBg').appendChild(successStatus);
		// 
		// console.log(document.getElementById('slideBg').clientHeight)
		let successText = document.createElement('div');
		successText.setAttribute('id', 'successText');
		document.getElementById('slideBar').appendChild(successText)
 		// successText.setAttribute('c')

	}
}
// 
window.onload = function() {
	slideCaptcha.init({
		id: 'slideCaptcha',
		spiritUrl: '',
		slideBgUrl: '',
		defaultPoint: {
			x: 0,
			y: 0
		},
		validCheck: '/checkPoint',
		getResource: '/getVerifyImg'
	})     	
}
