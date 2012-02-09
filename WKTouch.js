/*
 * 
 * Find more about this plugin by visiting
 * http://miniapps.co.uk/
 *
 * Copyright (c) 2010 Alex Gibson, http://miniapps.co.uk/
 * Released under MIT license 
 * http://miniapps.co.uk/license/
 * 
 */

(function() {
	
	function PrintObj(object){
		var output = '';
		for (property in object) {
		  output += property + ': ' + object[property]+'; ';
		}
		console.log(output);
	
	}
	
	
	function WKTouch(node, options) {

		this.node = typeof node == 'object' ? node : document.getElementById(node);
		// Physics controls
		this.speedx = 0;
		this.speedy = 0;
		this.friction = 0.94;
		this.oldx = 0;
		this.oldy = 0;
		this.offsetX = 0;
		this.offsetY = 0;
		this.offsetX1 = 0;
		this.offsetY1 = 0;
		this.isTouched = false;
		this.isDragging = false;
		this.oldLength;
		this.manual = false;
		this.oldX0;
		this.oldX1;
		
		this.oldY0;
		this.oldY1;
		this.oldMiddleX = 0;
		this.oldMiddleY = 0;
		this.origin;
		
		self = this;
		
		this.options = {
			dragable : true,
			scalable : true,
			rotatable : true,
			opacity : true
		};
    
		// User defined options
		if (typeof options == 'object') {
			for (var i in options) {
				if(options.hasOwnProperty(i)) {
					this.options[i] = options[i];
				}
			}
		}
		
		//detect support for Webkit CSS 3d transforms
		this.physicalSlide = function(){
			var speedTotal = Math.abs(this.speedx) + Math.abs(this.speedy);
			
			speedTotal= Math.abs(this.speedx) + Math.abs(this.speedy);
			var myTransform = "",
	    		x1 = 0,
	        	y1 = 0,
	        	x2 = 0,
	        	y2 = 0,
	        	curX = 0,
	        	curY = 0;
			if(speedTotal > 1 && !this.isDragging){
					if(Math.abs(this.speedx) > 30){
						if(this.speedx < 0){
							this.speedx = -30;
						} else {
							this.speedx = 30;
						}
					}
					if(Math.abs(this.speedy) > 30){
						if(this.speedy < 0){
							this.speedy = -30;
						} else {
							this.speedy = 30;
						}
					}
					var newx = this.oldx  - this.speedx;
					var newy = this.oldy  - this.speedy;
					
					if (this.supportsWebkit3dTransform) {
						myTransform += "translate3d("+newx+"px, "+newy+"px ,0)";
					} else {
						myTransform += "translate("+newx+"px, "+newy+"px)";
					}
					myTransform += "scale(" + (this.scale) + ")";
					
					myTransform += "rotate(" + ((this.rotation) % 360) + "deg)";
								   
					this.speedx *= this.friction;
					this.speedy *= this.friction;
					
					this.speedx = (Math.round(this.speedx * 100)/100);
					this.speedy = (Math.round(this.speedy * 100)/100);
					
					this.node.style.webkitTransform = myTransform;
					var here = this;
					
					this.oldx = newx;
					this.oldy = newy;
					setTimeout(function(self){
						self.physicalSlide();
					}, 18, this);
				} else {
					
					speedTotal = 0;
					destx = curX;
					desty = curY;
					this.speedx = 0
					this.speedy = 0;
					
				}
			
		}
		
		
		
		this.supportsWebkit3dTransform = ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix());
	}

	//static property to store the zIndex for an element
	WKTouch.zIndexCount = 1;

	WKTouch.prototype.init = function () {
          
    	this.rotation = 0; //default rotation in degrees
    	this.scale = 1.0; //default scale value
    	this.gesture = false; //flags a 2 touch gesture
    	this.node.style.position = "absolute";
    	var image = this.node.getElementsByTagName('img')[0];
    	this.node.style.width = image.width+"px";
    	this.node.style.height = image.height+"px";
    	this.node.addEventListener('touchstart', this, false);
		this.node.addEventListener('mousedown', this, false);
		this.node.addEventListener('mouseup', this, false);
		this.node.addEventListener('mouseout', this, false);
		this.node.addEventListener('mousemove', this, false);
		
	};

	
	WKTouch.prototype.mousedown = function (e){
		
		this.offsetX = e.offsetX;
		this.offsetY = e.offsetY;
		
		this.isDragging = true;
		this.node.style.zIndex = WKTouch.zIndexCount++;    
		e.preventDefault();
	}
	WKTouch.prototype.mouseout = function(e){
		this.isDragging = false;
		
		if(Math.abs(this.speedx) > 0 || Math.abs(this.speedy) > 0){
			this.physicalSlide();
		}
	
	}
	WKTouch.prototype.mouseup = function (e){
		this.isDragging = false;
		
		if(Math.abs(this.speedx) > 0 || Math.abs(this.speedy) > 0){
			this.physicalSlide();
		}
		
		
		
		
		
	
		e.preventDefault();
	}
	WKTouch.prototype.mousemove = function (e){
		
		if(this.isDragging){
			
			var myTransform = "",
	    		x1 = 0,
	        	y1 = 0,
	        	x2 = 0,
	        	y2 = 0,
	        	curX = 0,
	        	curY = 0;
				
				
			this.node.style.position = "absolute";
			var newposx = (e.pageX-this.offsetX);
			var newposy = (e.pageY-this.offsetY);
			
			if (this.supportsWebkit3dTransform) {
				myTransform += "translate3d("+newposx+"px, "+newposy+"px ,0)";
			
			} else {
				myTransform += "translate("+newposx+"px, "+newposy+"px)";
			
			}
			
			this.node.style.webkitTransform = myTransform;
			
			this.speedx = this.oldx-newposx;
			this.speedy = this.oldy-newposy;
			
			
			this.oldx = (e.pageX-this.offsetX);
			this.oldy = (e.pageY-this.offsetY);
			
		}
		e.preventDefault();
	}
	WKTouch.prototype.touchstart = function (e) {
	
		e.preventDefault();
    	this.oldLength = null;
    	this.oldX0 = null;
    	this.node.isTouched = true;
		this.isDragging = true;
    	//bring item to the front
    	this.node.style.zIndex = WKTouch.zIndexCount++;    
    	this.node.addEventListener('touchmove', this, false);
    	this.node.addEventListener('touchend', this, false);
    	this.node.addEventListener('touchcancel', this, false);
    	
		if(e.targetTouches.length > 1){
			this.offsetX = e.targetTouches[0].clientX - this.oldx;
			this.offsetY = e.targetTouches[0].clientY - this.oldy;
			
			this.offsetX1 = e.targetTouches[1].clientX - this.oldx;
			this.offsetY1 = e.targetTouches[1].clientY - this.oldy;
			
			
			
			var middlex =  Math.round(((((e.targetTouches[0].clientX + e.targetTouches[1].clientX) * 0.5)-this.oldx)/ (this.node.offsetWidth))*100);
        	var middley =  Math.round(((((e.targetTouches[0].clientY + e.targetTouches[1].clientY) * 0.5)-this.oldy)/(this.node.offsetHeight))*100);
        	
        	
        	
        	this.origin = "50% 50%";
        	
        	
        	this.oldMiddleX = middlex;
        	this.oldMiddleY = middley;
		} else {
			this.offsetX = e.targetTouches[0].clientX - this.oldx;
			this.offsetY = e.targetTouches[0].clientY - this.oldy;	
			
        	this.origin = "50% 50%";
			
		}
		
		
		
		
		
    	if (this.options.opacity) {
        	//this.node.style.opacity = '0.5';
    	}
	};
    
	
	 
	WKTouch.prototype.touchmove = function (e) {
		
    	e.preventDefault();
    	this.node.isTouched = true;
    	var myTransform = "",
    		x1 = 0,
        	y1 = 0,
        	x2 = 0,
        	y2 = 0,
        	curX = 0,
        	curY = 0;
    
    	//drag event
    	if ((e.targetTouches.length === 1  ) && (this.options.dragable)) {
    		
			
			
    		//get drag point
        	/*
			curX = e.targetTouches[0].pageX - (this.node.offsetLeft + (this.node.offsetWidth / 2));
        	curY = e.targetTouches[0].pageY - (this.node.offsetTop + (this.node.offsetHeight / 2));
        	*/
			curX = e.targetTouches[0].pageX - this.offsetX;
        	curY = e.targetTouches[0].pageY - this.offsetY;
				
        	//translate drag
        	//window.getComputedStyle(this.node, null).getPropertyValue("-webkit-transform")
        	
        	if (this.supportsWebkit3dTransform) {
        		myTransform += 'translate3d(' + curX + 'px,' + curY + 'px, 0)';
        		
        	} else {
        		myTransform += 'translate(' + curX + 'px,' + curY + 'px)';
        	}
        	
        	//persist scale and rotate values from previous gesture
        	if (this.options.scalable) {
            	myTransform += "scale(" + (this.scale) + ")";
        	} 
        
        	if (this.options.rotatable) {
            	myTransform += "rotate(" + ((this.rotation) % 360) + "deg)";
        	}
			
			
			
			
			
			
			
    	}
    	else if ((e.targetTouches.length > 1) && ((this.options.scalable) || (this.options.rotatable))) {
    
        	
        	//gesture event
        	this.gesture = (e.scale != undefined && e.rotation != undefined) ? true : false;
        	
        	//get middle point between two touches for drag
        	
		
			// middle of the screen
		
			
			
			x1 = e.targetTouches[0].pageX - (this.node.offsetLeft + ((this.offsetX + this.offsetX1)/2));
        	y1 = e.targetTouches[0].pageY - (this.node.offsetTop + ((this.offsetY + this.offsetY1)/2));
        	x2 = e.targetTouches[1].pageX - (this.node.offsetLeft + ((this.offsetX + this.offsetX1)/2));
        	y2 = e.targetTouches[1].pageY -  (this.node.offsetTop + ((this.offsetY + this.offsetY1)/2));
        	
        	
        	curX = (x1 + x2) / 2,
        	curY = (y1 + y2) / 2;
			/*
			x1 = e.targetTouches[0].pageX - (this.node.offsetLeft + (this.node.offsetWidth / 2));
        	y1 = e.targetTouches[0].pageY - (this.node.offsetTop + (this.node.offsetHeight / 2));
        	x2 = e.targetTouches[1].pageX - (this.node.offsetLeft + (this.node.offsetWidth / 2));
        	y2 = e.targetTouches[1].pageY - (this.node.offsetTop + (this.node.offsetHeight / 2));
        	curX = (x1 + x2) / 2,
        	curY = (y1 + y2) / 2;
        	*/
        	
        	//translate drag
        
        	if (this.supportsWebkit3dTransform) {
        		//$("#minPointer").css("-webkit-transform-origin", "50% 100%" );

        		myTransform += 'translate3d(' + curX + 'px,' + curY + 'px, 0)';
        		
        	} else {
        	    myTransform += 'translate(' + curX + 'px,' + curY + 'px)';
        	}
        	
        	
        	if (this.options.scalable && e.scale == undefined) {
            	
            	this.manual = true;
            	var lengthx =  e.targetTouches[1].pageX - e.targetTouches[0].pageX;
            	var lengthy =  e.targetTouches[1].pageY - e.targetTouches[0].pageY;
            	
            	var newLength = Math.round(Math.sqrt(Math.pow(lengthx,2) + Math.pow(lengthy, 2))); 
            	if(this.oldLength != null){
            		
            		var manscale =newLength / this.oldLength; ;
            		
            		
            		this.scale *= manscale;
            		
            	
            	}
            	myTransform += "scale(" + (this.scale) + ")";
            	
            	
            	
            	//this.offsetY += (this.node.offsetHeight *this.scale)-this.node.offsetWidth;
            	
            	
            	
            	this.oldLength = newLength;
            
            	
            	//myTransform += "scale(" + manscale + ")";
            	
            	
            	
        	} 
        	
        	
        	
        	//scale and rotate
        	if (this.options.scalable && e.scale != undefined) {
            	myTransform += "scale(" + (this.scale * e.scale) + ")";
        	} 
        	
        	if (this.options.rotatable && e.rotation == undefined) {
        		this.manual = true;
        		if(this.oldX0 != null){
        			var rn = Math.atan2(e.targetTouches[1].pageY-e.targetTouches[0].pageY,e.targetTouches[1].pageX-e.targetTouches[0].pageX);
        			var ro = Math.atan2(this.oldY1-this.oldY0,this.oldX1-this.oldX0);
        			
        			
        			var rot = rn - ro;
        		
        			var d = rot *180 / Math.PI
        			
        			this.rotation += d;
        		}
        		myTransform += "rotate(" + ((this.rotation) % 360) + "deg)";
        		
        		
        		this.oldX0 = e.targetTouches[0].pageX;
        		this.oldY0 = e.targetTouches[0].pageY;
        		this.oldX1 = e.targetTouches[1].pageX;
        		this.oldY1 = e.targetTouches[1].pageY;
        	}
        	
        
        	if (this.options.rotatable && e.rotation != undefined) {
            	myTransform += "rotate(" + ((this.rotation + e.rotation) % 360) + "deg)";
        	}
    	} 
    	this.node.style.webkitTransform = this.node.style.MozTransform = this.node.style.msTransform = this.node.style.OTransform = this.node.style.transform = myTransform;
		
		this.node.style['-webkit-transform-origin'] = this.origin;
		this.speedx =  this.oldx - curX;
		this.speedy =  this.oldy - curY;
		this.oldx = curX;
		this.oldy = curY;
		
	};
        
	WKTouch.prototype.touchend = function (e) {
		this.isDragging = false;
    	e.preventDefault();
     	this.node.isTouched = false;
    	this.node.removeEventListener('touchmove', this, false);
    	this.node.removeEventListener('touchend', this, false);
    	this.node.removeEventListener('touchcancel', this, false);
		
        //store scale and rotate values on gesture end    
    	if (this.gesture) {
        	this.scale *= e.scale;
        	this.rotation = (this.rotation + e.rotation) % 360;
        	this.gesture = false;
    	} 
    	
    	if (this.options.opacity) {
        	this.node.style.opacity = '1';
    	}  
		if(Math.abs(this.speedx) > 0 || Math.abs(this.speedy) > 0){
			this.physicalSlide();
		}
		
	};

	WKTouch.prototype.touchcancel = function (e) {
		this.isDragging = false;
    	e.preventDefault();
    	this.node.isTouched = false;
    	this.node.removeEventListener('touchmove', this, false);
    	this.node.removeEventListener('touchend', this, false);
    	this.node.removeEventListener('touchcancel', this, false);
    
    	//store scale and rotate values on gesture end 
    	
    	if (this.gesture) {
        	this.scale *= e.scale;
        	this.rotation = (this.rotation + e.rotation) % 360;
        	this.gesture = false;
    	} 
    
    	//set opacity
    	if (this.options.opacity) {
        	this.node.style.opacity = '1';
    	}  
		
		if(Math.abs(this.speedx) > 0 || Math.abs(this.speedy) > 0){
			this.physicalSlide();
		} 
	};

	//event handler
	WKTouch.prototype.handleEvent = function (e) {

		if (typeof(this[e.type]) === 'function' ) {
			return this[e.type](e);
		}
	};
	
	//public function
	window.WKTouch = WKTouch;
	
})();