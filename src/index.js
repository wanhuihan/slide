// 
// import './scss/index.scss';
// 
function SlideCaptcha(obj) {
	this.slideBox = null;
	this.defaultPoint = {};
	this.getImageUrl = ''
	this.validCheck = ''
	this.randomNo = parseInt(Math.random() * 10000000)
	this.id = obj.id;
	this.init(obj)
}

// Init the SlideCaptcha 
SlideCaptcha.prototype.init = function(obj) {
	// 
	this.getImageUrl = obj.getResource;
	this.validCheck = obj.validCheck;
	this.defaultPoint.x = obj.defaultPoint.x;
	this.defaultPoint.y = obj.defaultPoint.y;
	this.slideBox = document.getElementById(obj.id);
	this.id = obj.id;
	// 
	this.slideBox.classList.add('slideCaptcha')
	// 
	this.getImage(this.randomNo).then(data => {
		// console.log(data.data);
		this.spiritUrl = data.data.newImage;
		this.slideBgUrl = data.data.oriCopyImage;
		this.defaultPoint.x = 0;
		this.defaultPoint.y = data.data.yPoint;
		return this.imageLoad(this.slideBgUrl);

	}).then ( data => {
		// 
		this.slideBgBoxCreate();
		this.slideBgDraw(data);
		this.refreshImageBg()
		return this.imageLoad(this.spiritUrl)	

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
	console.log(this)
}

// Get the image data, data type is base64
SlideCaptcha.prototype.getImage = function(parmas) {

	let params = parmas;
	return new Promise( (resolve, reject) => {
		let xhr = new XMLHttpRequest();
		xhr.open('post', this.getImageUrl, true);	
		xhr.setRequestHeader('Content-Type','application/json');	
		xhr.onreadystatechange = function() {
			if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
				let res = JSON.parse(xhr.response)
				resolve(res);
			}
		}		
		xhr.send(JSON.stringify({flowId: params}))	
	})	
}

// Global method to generate the image tag with url
SlideCaptcha.prototype.imageLoad = function(url) {
	return new Promise((resolve, reject) => {
		let image = new Image();
		image.src = 'data:image/png;base64,' + url;
		image.onload = function() {
			resolve(image)
		}
	})
}

// To generate a image background tag in the box after the function prototype.slideBgBoxCreate()
SlideCaptcha.prototype.slideBgDraw = function(image) {
	// console.log(123)
	let bg = document.getElementById( this.id + '_slideBoxImage');
	if (bg) {
		bg.appendChild(image)
		bg.replaceChild(image, bg.children[0])
	} else {
		let slideBg = document.createElement('div')
		slideBg.setAttribute('id', this.id + '_slideBoxImage');
		slideBg.classList.add('slideBoxImage')
		slideBg.appendChild(image);
		// 
		document.getElementById(this.id + '_slideBg').appendChild(slideBg);
		this.slideContainerSizeSet(image.clientWidth, image.clientHeight); 
		this.boxWidth = image.clientWidth;
		this.boxHeight = image.clientHeight;
		document.getElementById(this.id + '_slideBg').classList.add('hide');
	}
}

// To generate a box tag for image background;
SlideCaptcha.prototype.slideBgBoxCreate = function() {
	let slideBg = document.createElement('div')
	slideBg.setAttribute('id', this.id + '_slideBg');
	//
	slideBg.classList.add('slideBg'); 
	//
	this.slideBox.appendChild(slideBg);
}

// Refresh the image, recall the ajax to get random image from API;
SlideCaptcha.prototype.refreshImageBg = function() {
	// console.log(this.obj.defaultPoint)
	let img = document.getElementById(this.id + '_slideBoxImage').children[0];	
	let _that = this;
	let reload = document.createElement('span');
	reload.setAttribute('id',  this.id + '_imageReload');
	reload.classList.add('imageReload')
	// 
	let spiritUrl, slideBgUrl;
	reload.addEventListener('click', function() {
		_that.randomNo = parseInt(Math.random() * 10000000);
		_that.getImage(_that.randomNo).then(data => {
			// console.log(data.data);
			spiritUrl = data.data.newImage;
			slideBgUrl = data.data.oriCopyImage;
			_that.defaultPoint.x = 0;
			_that.defaultPoint.y = data.data.yPoint;
			// 
			return _that.imageLoad(slideBgUrl);

		}).then( data => {

			_that.slideBgDraw(data);
			return _that.imageLoad(spiritUrl)
		}).then( data => {
			// 
			// console.log(_that.obj.defaultPoint, slideBgUrl)
			_that.slideSpiritDraw(data);
		})
	})
	document.getElementById(this.id + '_slideBg').appendChild(reload)
}
// The spirit box image generate
SlideCaptcha.prototype.slideSpiritDraw = function(image) {
	// 
	let slideSpirit = document.getElementById(this.id + '_slideSpirit');

	if (slideSpirit) {
		slideSpirit.replaceChild(image, slideSpirit.children[0]);
		slideSpirit.style.left = this.defaultPoint.x + 'px' || 0;
		slideSpirit.style.top = this.defaultPoint.y + 'px';
	} else {
		let spiritDiv = document.createElement('span');
		spiritDiv.setAttribute('id', this.id + '_slideSpirit');
		spiritDiv.classList.add('slideSpirit');
		spiritDiv.appendChild(image);
		spiritDiv.style.left = this.defaultPoint.x + 'px' || 0;
		spiritDiv.style.top = this.defaultPoint.y + 'px';
		let slideBg = document.getElementById(this.id + '_slideBg');
		slideBg.appendChild(spiritDiv)			
	}

}
// To generate the slide icon and the background in the slidebar in the slide box;
SlideCaptcha.prototype.slidebarCreate = function() {
	// 
	let slidebar = document.getElementById(this.id + '_slideBar');
	if (!slidebar) {
		let bar = document.createElement('div');
		bar.setAttribute('id', this.id + '_slideBar');
		bar.setAttribute('class', 'slideBar');
		// 
		let slideCircle = document.createElement('span');
		slideCircle.setAttribute('id', this.id + '_slideBarCircle');
		slideCircle.classList.add('slideBarCircle')
		bar.appendChild(slideCircle);
		// 
		this.slideBox.appendChild(bar)		
		// 
	}
}
// To create a success status box after slide to the correct position;
SlideCaptcha.prototype.successStatusAdd = function() {
	// 
	let successStatus = document.createElement('div');
	successStatus.setAttribute('id', this.id + '_successBg');
	successStatus.classList.add('successBg');
	successStatus.innerHTML = `
		<span>验证成功</span>
	`;
	successStatus.style.height = this.boxHeight + 'px'
	document.getElementById(this.id + '_slideBg').appendChild(successStatus);
	let successText = document.createElement('div');
	successText.setAttribute('id', this.id + '_successText');
	successText.classList.add('successText');
	successText.innerHTML = `
		<span class="success-arrow"></span>
		<span class="success-text"> 拖动滑块完成验证 </span>
		<span class="success-arrow"></span>
	`;
	document.getElementById(this.id + '_slideBar').appendChild(successText)
	// 
}
// mouseDown, mouseMove, mouseUp event init.
SlideCaptcha.prototype.dragEventInit = function() {
	// 
	let _that = this;
	// 
	let slideCircle = document.getElementById(this.id + '_slideBarCircle');
	let slideSpirit = document.getElementById(this.id + '_slideSpirit');
	let startX;
	let dragX;
	// 
	slideCircle.addEventListener('mousedown', mouseDown);
	// 
	function mouseDown(e) {
		startX = e.clientX;
		document.body.addEventListener('mousemove',mouseMove)	
		document.body.addEventListener('mouseup', mouseUp)	
		// 
		document.getElementById(_that.id + '_slideBg').classList.remove('hide');		
	}
	//
	function mouseMove (e) {
		// console.log(e)
		if (e.clientX - startX > 0 && e.clientX - startX < document.getElementById(_that.id + '_slideBg').clientWidth - document.getElementById(_that.id + '_slideSpirit').clientWidth + 5) {
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
		// console.log (_that.validCheck)
		_that.validCheckFn(dragX).then (data => {
			if (data.status === 0) {
				document.getElementById(_that.id + '_successBg').classList.add('success');
				let removeStatus = setTimeout(function() {
					document.getElementById(_that.id + '_successBg').classList.remove('success')
					clearTimeout(removeStatus);
					document.getElementById(_that.id + '_successText').classList.add('success');
					document.querySelector('.success-text').innerHTML = '';
					slideCircle.style.left = (document.getElementById(_that.id + '_slideBar').clientWidth - 40) + 'px';
					// document.getElementById('slideBg').remove()		
					_that.slideBox.removeChild(document.getElementById(_that.id + '_slideBg'))				
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
}
// To check the slide vliadation when mouseup, it will call the ajax and send the corridiate X;
SlideCaptcha.prototype.validCheckFn = function(pointX) {
	return new Promise( (resolve, reject) => {
		let xhr = new XMLHttpRequest();
		xhr.open('post', this.validCheck, true);	
		xhr.setRequestHeader('Content-Type','application/json');
		xhr.onreadystatechange = function() {
			if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
				let res = JSON.parse(xhr.response)
				resolve(res);
			}
		}		
		xhr.send(JSON.stringify({flowId: this.randomNo, xPoint: pointX}))	
	})
	// 	
}
// To set the slide box height after get the image Background;
SlideCaptcha.prototype.slideContainerSizeSet = function (w, h) {
	this.slideBox.style.width = w + 'px';
}
// 
function slideCaptcha(obj) {
	new SlideCaptcha(obj)
}

export default slideCaptcha;
     
