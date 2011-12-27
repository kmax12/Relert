var messageSent = false;
$(window).ready(function(){
	resize();
	$(window).resize(resize);
	
	var src = $('#iframe').attr('src');
	if (src.indexOf('youtube.com') != -1 && src.indexOf('youtube.com/embed' == -1){)
			src.replace('youtube.com', 'youtube.com/embed');
			$('#iframe').attr('src', src);
	}
	
	
	$('#close').click(function(){
		if(!messageSent){
			$.post("http://relert.herokuapp.com/done/"+window.hex, {message: false} );	
		}
	});
	
	$('#send').click(function(){
		var $message = $('#message'),
		val = $message.val();
		if (val === ""){
				alert('Please enter message');
				$message.focus();
		} else {
			messageSent = true;
			$.post("http://relert.herokuapp.com/done/"+window.hex, {message: true, messageBody: val}, function(res){
				res = JSON.parse(res);
				
				if (res.success){
						$('#change').html('Message sent!');
				} else {
					$('#change').html('Message not sent :(');
				}
				
				resize();
			});	
		}
	});
});

function resize(){
	var barHeight= $('#bar').height();
	$('#iframe').height($(window).height()-barHeight);
	$('#iframe').css('top',barHeight);
}
