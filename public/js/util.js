$(document).ready(function(){
	setInterval(function(){
		var current = $('.active');
		var next = $('.active').next();
		if(next.length == 0){
			next = $('.slider-images:first-child');
		}
		current.toggleClass('active');
		next.toggleClass('active');
	},10000);
});