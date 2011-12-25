$(window).ready(function(){
	$('#submit').click(function(e){
		e.preventDefault();
		
		$.get('http://relert.herokuapp.com/add?url='+$('#url').val()+'&email='+$('#rmail').val(),function(data) {
		  console.log(data);
		});
	});
});
