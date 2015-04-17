function Touch(){};

Touch.prototype = {
	init: function(controller) {
		if (window.navigator.msPointerEnabled) {
			window.addEventListener('MSPointerDown', this.handleTouchStart.bind(this), false);
			window.addEventListener('MSPointerMove', this.handleTouchMove.bind(this), false);
			window.addEventListener('MSPointerUp', this.handleTouchEnd.bind(this), false);
		}
		window.addEventListener('touchstart', this.handleTouchStart.bind(this,controller), false);        
		window.addEventListener('touchmove', this.handleTouchMove.bind(this), false);
		window.addEventListener('touchend', this.handleTouchEnd.bind(this), false);
		this.controller = controller;
		this.xDown = null;                                                        
		this.yDown = null;   
		this.touchTime = null;
		this.singleTap = 200;
		this.listenTouch = 1;
	},
	setListenTouch: function(nb) {
		this.listenTouch = nb;
	},
	handleTouchStart: function(evt,controller) {                                         
		if (window.navigator.msPointerEnabled) {
			this.xDown = evt.clientX;                                      
			this.yDown = evt.clientY; 
		} else {
			this.xDown = evt.touches[0].clientX;                                      
			this.yDown = evt.touches[0].clientY; 
		}
		this.touchTime = new Date().getTime();
	},
	handleTouchMove: function(evt) {
		if (window.navigator.msPointerEnabled) {
			var xUp = evt.clientX;                                    
			var yUp = evt.clientY;
		} else {
			var xUp = evt.touches[0].clientX;                                    
			var yUp = evt.touches[0].clientY;
		}
		var yDiff = this.yDown - yUp;
		var xDiff = this.xDown - xUp;

		/* Avoid problems with non-linear swipe */
		if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
			if ( xDiff > 0 ) {
				if(this.listenTouch) console.log('swipe-left');
			} else {
				if(this.listenTouch) console.log('swipe-right');
			}                       
		} else {
			if ( yDiff > 0 ) {
				if(this.listenTouch) console.log('swipe-up');
			} else { 
				if(this.listenTouch) console.log('swipe-down');
//				if(this.listenTouch) console.log('mobilePassIntro', {});
			}                                                                 
		}
	},
	handleTouchEnd: function(evt) {
		var actualTime = new Date().getTime();
		var timeDiff = actualTime-this.touchTime;
		if(timeDiff < this.singleTap) {
			if(this.listenTouch) console.log('tap');
		} else {
			if(this.listenTouch) console.log('hold');
		}
	},
	get: function(key) {
		return this[key];
	}
};
