$(window).ready(function(){
	$('#submit').click(function(e){
		e.preventDefault();
		
		$.get('http://relert.herokuapp.com/add?url='+$('#url').val()+'&email='+$('#rmail').val(),function(data) {
			var data = $.parseJSON(data)
			if (!data.error){
				$('.popbox').removeClass('hidden');
				
				$('#relert-link').val('<a href="'+data.url+'">'+data.url+'</a')
			} else {
				alert(data.error)
			}
		});
	});
	
	$('#new').click(function(){
		$('.popbox').addClass('hidden');
	});
});
