$(window).ready(function(){
	resize();
	$(window).resize(resize);
	
	$('#close').click(function(){
		$.post("http://relert.herokuapp.com/done/"+window.hex, {message: false} );	
	});
});

function resize(){
	var barHeight= $('#bar').height();
	$('#iframe').height($(window).height()-barHeight);
	$('#iframe').css('top',barHeight);
}
