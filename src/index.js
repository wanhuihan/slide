// import 'babel-polyfill';
// 
import './scss/index.scss';

export const slideCaptcha = {
	// 
	obj: {
		slideBox: null,
		defaultPoint: {},
		getImageUrl: '',
		validCheck: '',
		randomNo: parseInt(Math.random() * 10000000),
		id: ''
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
		this.obj.id = obj.id;
		// 
		this.obj.slideBox.classList.add('slideCaptcha')
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

			// this.slideBgDraw(data);
			this.slideBgBoxCreate();
			this.slideBgDraw(data);
			this.refreshImageBg()
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
	// 全局获取图片的ajax方法
	imageLoad: function(url) {
		return new Promise((resolve, reject) => {
  		let image = new Image();
  		image.src = 'data:image/png;base64,' + url;
  		image.onload = function() {
  			resolve(image)
  		}
		})
	},
	// 创建滑动背景图div
	slideBgBoxCreate: function() {
		let slideBg = document.createElement('div')
		slideBg.setAttribute('id', this.obj.id + '_slideBg');
		//
		slideBg.classList.add('slideBg'); 
		//
		this.obj.slideBox.appendChild(slideBg);
	},
	// 创建滑动背景
	slideBgDraw: function(image) {

		let bg = document.getElementById( this.obj.id + '_slideBoxImage');
		if (bg) {
			bg.appendChild(image)
			bg.replaceChild(image, bg.children[0])
		} else {
			
			let slideBg = document.createElement('div')
			slideBg.setAttribute('id', this.obj.id + '_slideBoxImage');
			slideBg.classList.add('slideBoxImage')
			slideBg.appendChild(image);
			// 
			document.getElementById(this.obj.id + '_slideBg').appendChild(slideBg)	;
			//
			this.slideContainerSizeSet(image.clientWidth, image.clientHeight); 
		}
	},
	// 刷新滑动背景图及拼图精灵
	refreshImageBg: function() {
		// 
		// console.log(this.obj.defaultPoint)
		let img = document.getElementById(this.obj.id + '_slideBoxImage').children[0];	
		let _that = this;
		let reload = document.createElement('span');
		reload.setAttribute('id',  this.obj.id + '_imageReload');
		reload.classList.add('imageReload')
		// 
		let spiritUrl, slideBgUrl;
		reload.addEventListener('click', function() {
			_that.obj.randomNo = parseInt(Math.random() * 10000000);
			_that.getImage(_that.obj.randomNo).then(data => {
				// console.log(data.data);
				spiritUrl = data.data.newImage;
				slideBgUrl = data.data.oriCopyImage;
				_that.obj.defaultPoint.x = 0;
				_that.obj.defaultPoint.y = data.data.yPoint;
				// 
				return _that.imageLoad(slideBgUrl);

			}).then( data => {

				_that.slideBgDraw(data);
				return _that.imageLoad(spiritUrl)
			}).then( data => {
				// 
				console.log(_that.obj.defaultPoint, slideBgUrl)
				_that.slideSpiritDraw(data);
			})
		})
		document.getElementById(this.obj.id + '_slideBg').appendChild(reload)
		// document.getElementById('')
	},
	// 滑动精灵图片绘制
	slideSpiritDraw: function (image) {
		let slideSpirit = document.getElementById(this.obj.id + '_slideSpirit');
		if (slideSpirit) {
			slideSpirit.replaceChild(image, slideSpirit.children[0]);
			slideSpirit.style.left = this.obj.defaultPoint.x + 'px' || 0;
			slideSpirit.style.top = this.obj.defaultPoint.y + 'px';

		} else {
			let spiritDiv = document.createElement('span');
			spiritDiv.setAttribute('id', this.obj.id + '_slideSpirit');
			// 
			spiritDiv.classList.add('slideSpirit');
			spiritDiv.appendChild(image);
			// 
			spiritDiv.style.left = this.obj.defaultPoint.x + 'px' || 0;
			// 
			spiritDiv.style.top = this.obj.defaultPoint.y + 'px';

			let slideBg = document.getElementById(this.obj.id + '_slideBg');
			slideBg.appendChild(spiritDiv)			
		}
	},
	// 滑动条创建
	slidebarCreate: function() {
		// 
		let slidebar = document.getElementById(this.obj.id + '_slideBar');
		if (!slidebar) {
			let bar = document.createElement('div');
			bar.setAttribute('id', this.obj.id + '_slideBar');
			bar.setAttribute('class', 'slideBar');
			// 
			let slideCircle = document.createElement('span');
			slideCircle.setAttribute('id', this.obj.id + '_slideBarCircle');
			slideCircle.classList.add('slideBarCircle')
			bar.appendChild(slideCircle);
			// 
			this.obj.slideBox.appendChild(bar)		
			// 
		}
	},
	// 事件初始化
	dragEventInit: function() {
		// 
		let _that = this;
		// 
		let slideCircle = document.getElementById(this.obj.id + '_slideBarCircle');
		let slideSpirit = document.getElementById(this.obj.id + '_slideSpirit');
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
			if (e.clientX - startX > 0 && e.clientX - startX < document.getElementById(_that.obj.id + '_slideBg').clientWidth - document.getElementById(_that.obj.id + '_slideSpirit').clientWidth + 5) {
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
					document.getElementById(_that.obj.id + '_successBg').classList.add('success');
					let removeStatus = setTimeout(function() {
						document.getElementById(_that.obj.id + '_successBg').classList.remove('success')
						clearTimeout(removeStatus);
						document.getElementById(_that.obj.id + '_successText').classList.add('success');
						document.querySelector('.success-text').innerHTML = '';
						slideCircle.style.left = (document.getElementById(_that.obj.id + '_slideBar').clientWidth - 40) + 'px';
						// document.getElementById('slideBg').remove()		
						_that.obj.slideBox.removeChild(document.getElementById(_that.obj.id + '_slideBg'))				
					},1000);
					// 
					slideCircle.removeEventListener('mousedown', mouseDown);
					// 
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
	// 
	ajaxCall: function() {

	},
	// 
	slideContainerSizeSet: function (w, h) {
		this.obj.slideBox.style.width = w + 'px';
	},
	// 
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
		successStatus.setAttribute('id', this.obj.id + '_successBg');
		successStatus.classList.add('successBg');
		successStatus.innerHTML = `
			<span>验证成功</span>
		`;
		successStatus.style.height = document.getElementById(this.obj.id + '_slideBg').clientHeight + 'px'
		document.getElementById(this.obj.id + '_slideBg').appendChild(successStatus);
		let successText = document.createElement('div');
		successText.setAttribute('id', this.obj.id + '_successText');
		successText.classList.add('successText');
		successText.innerHTML = `
			<span class="success-arrow"></span>
			<span class="success-text"> 拖动滑块完成验证 </span>
			<span class="success-arrow"></span>
		`;
		document.getElementById(this.obj.id + '_slideBar').appendChild(successText)
	},
	// 

}
