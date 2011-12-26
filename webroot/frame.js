$(window).ready(function(){
	resize();
	$(window).resize(resize);
	
	$('#close').click(function(){
		$.post("http://relert.herokuapp.com/done/"+window.hex, {message: false} );	
	});
	
	$('#send').click(function(){
		var val = $('#message').val();
		if (val === ""){
				alert('Please enter message');
		} else {
			$.post("http://relert.herokuapp.com/done/"+window.hex, {message: true; messageBody: val} );	
		}
	});
});

function resize(){
	var barHeight= $('#bar').height();
	$('#iframe').height($(window).height()-barHeight);
	$('#iframe').css('top',barHeight);
}
