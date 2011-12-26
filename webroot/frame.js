var messageSent = false;
$(window).ready(function(){
	resize();
	$(window).resize(resize);
	
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
					
			});	
		}
	});
});

function resize(){
	var barHeight= $('#bar').height();
	$('#iframe').height($(window).height()-barHeight);
	$('#iframe').css('top',barHeight);
}
