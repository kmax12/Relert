$(window).ready(function(){
	$('#submit').click(function(e){
		e.preventDefault();
		
		$.get('http://relert.herokuapp.com/add?url='+$('#url').val()+'&email='+$('#email').val()+'&name='+$('#name').val(),function(data) {
			var data = $.parseJSON(data)
			if (!data.error){
				$('.popbox').removeClass('hidden');
				
				$('#relert-link').val(data.url).focus(function(){this.select()});
			} else {
				alert(data.error)
			}
		});
	});
	
	$('#new').click(function(){
		$('.popbox').addClass('hidden');
	});
});
