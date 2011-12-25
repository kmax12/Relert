$(window).ready(function(){
	$('#submit').click(function(e){
		e.preventDefault();
		$.get('/add/'+$('#url').val(), function(data) {
		  console.log(data);
		});
	});
});
