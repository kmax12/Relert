$(window).ready(function(){
	$('#url').blur(function(){
		var url = $(this).text();
		if(!url.match(/(?i)\b((?:https?://|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/){
			alert('nope');
		}
	});
	
	$('#submit').click(function(e){
		e.preventDefault();
		
		$.get('http://relert.herokuapp.com/add?url='+$('#url').val()+'&email='+$('#email').val()+'&name='+$('#name').val(),function(data) {
			var data = $.parseJSON(data)
			if (!data.error){
				$('.popbox').removeClass('hidden');
				
				$('#relert-link').val(data.url).focus().select();
			} else {
				alert(data.error)
			}
		});
	});
	
	$('#new').click(function(){
		$('.popbox').addClass('hidden');
	});
});
