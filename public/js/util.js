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

	var socket = io('http://06cb5375.ngrok.io/');

	socket.on('intel-data', function(msg){
    	$('#messages').append($('<li>').text(msg));
		$('.intel-row.gender').html('Gender :'+msg.gender);
		$('.intel-row.age').html('Age :'+msg.age);
		$('.custom-video source')[0].attr('src',msg.video);
		var customVideo = $('.custom-video')[0];
		customVideo.load();
		customVideo.play();
		customVideo.onended = function() {
    		socket.emit('videoEnded',{});
    		imageSlide = true;
			if($('.slide-show').hasClass('hide'))
				$('.slide-show').toggleClass('hide');
			if(!$('.intel-data').hasClass('hide'))
				$('.intel-data').toggleClass('hide');
			if(!$('.live-image').hasClass('hide'))
				$('.live-image').toggleClass('hide');		
			if(!$('.video-show').hasClass('hide'))
				$('.video-show').toggleClass('hide');    		
		};

		imageSlide = false;
		if(!$('.slide-show').hasClass('hide'))
			$('.slide-show').toggleClass('hide');
		if($('.intel-data').hasClass('hide'))
			$('.intel-data').toggleClass('hide');
		if($('.live-image').hasClass('hide'))
			$('.live-image').toggleClass('hide');		
		if($('.video-show').hasClass('hide'))
			$('.video-show').toggleClass('hide');
			
  	});

	socket.on('live-image', function(msg){
		$('.custom-image').attr('src',msg.base64Image);
  	});  	

 	socket.on('intel-emotion', function(msg){
    	$('.intel-row.emotion').html('Emotion :'+msg.emotion);
  	});
  	
 	socket.on('intel-status', function(msg){
    	$('.intel-row.status').html('Status : '+msg.status);
  	});
});