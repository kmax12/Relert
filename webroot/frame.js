$(window).ready(function(){
	resize();
	$(window).resize(resize);
});

function resize(){
	var barHeight= $('#bar').height();
	$('#iframe').height($(window).height()-barHeight);
	$('#iframe').css('top',barHeight);
}
