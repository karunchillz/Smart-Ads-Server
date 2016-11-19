$(document).ready(function(){
	var imageSlide = true;
	var timeInt = setInterval(function(){
		if(imageSlide){
			var current = $('.active');
			var next = $('.active').next();
			if(next.length == 0){
				next = $('.slider-images:first-child');
			}
			current.toggleClass('active');
			next.toggleClass('active');
		}
	},10000);

	$('.live-image').on('click',function(event){
		// Pause and Hide the Image Slider
		imageSlide = false;
		$('.slide-show').toggleClass('hide');

		// Set and Show the Intel Data
		$('.intel-row.gender').html('Gender : Male');
		$('.intel-row.age').html('Age : 25');
		$('.intel-row.emotion').html('Emotion : Happiness');
		$('.intel-row.status').html('Status : Neutral');
		$('.intel-data').toggleClass('hide');

		// Set and Show the Live Image
		$('.custom-image').attr('src','images/att.jpg');
		$('.live-image').toggleClass('hide');

		// Reset and Show the 
		$('.custom-video').load();
		$('.video-show').toggleClass('hide');
	});
});