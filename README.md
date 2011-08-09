WKTouch
=======================================

A JavaScript plugin for touch-capable devices, enabling multi-touch drag, scale and rotate on HTML elements.

Basic Usage
---------------------------------------

Include the main JavaScript file in the header of your HTML document:

	<script type="text/javascript" src="WKTouch.js" ></script>

Add the following rules to your CSS stylesheet:

	.touch {
    		-webkit-user-select: none;
    		-webkit-tap-highlight-color: rgba(0,0,0,0);
    		-webkit-text-size-adjust: none;
   		 -webkit-touch-callout: none; 
	}

	#element1 {
    		position: absolute;
    		left: 10px;
    		top: 10px;
    		height:120px; 
    		width:120px;
    		background-color: blue;
	}

Add a class name and id to your html element:

	<div class="touch" id="element1"></div>

Create a new instance of the plugin, making sure to pass it the id of your html element:

	<script type="text/javascript"> 
	window.onload = function() {                     
    		var element1 = new WKTouch('element1').init();       
	};
	</script>

You can also define optional parameters:

	var element1 = new WKTouch(
		'element1', {
		'dragable':true,
		'scalable':false,
		'rotatable': true,
    		'opacity':false
	}).init();

License information
---------------------------------------
 
[Released under MIT license]: http://miniapps.co.uk/license/
