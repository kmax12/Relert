$(window).ready(function(){
	resize();
	$(window).resize(resize);
});

function resize(){
	$('#iframe').height($(window).height()-100);
}
