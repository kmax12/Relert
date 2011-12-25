$(window).ready(function(){
	$('#submit').click(function(e){
		e.preventDefault();
		
		$.get('http://relert.herokuapp.com/add?url='+$('#url').val()+'&email='+$('#rmail').val(),function(data) {
			var data = $.parseJSON(data)
			if (!data.error){
				$('#container').html('<a href="'+data+'">'+data.url+'</a')
			} else {
				alert(data.error)
			}
		});
	});
});
