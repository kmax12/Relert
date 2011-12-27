$(window).ready(function(){
	$("#box").validate({
		rules: {
			url: {
				required: true,
				url: true
			},
			name: {
				required: true,
			},
			email: {
				required: true,
				email:true
			}
		},
		messages: {
			url: {
				required: "Please enter a url",
				url: "Invald url"
			},
			name: {
				required: "Please name this relert"
			},
			email: {
				required: "Please enter an email address",
				email: "Invaild email address"
			}
		},
		// the errorPlacement has to take the table layout into account
		errorPlacement: function(error, element) {
			var error = $(error).text();
			
		},
		success: function(label) {
			console.log(label);
			// set &nbsp; as text for IE
			//label.html("&nbsp;").addClass("checked");
		}
	});
	$('#url').focus();
	$('#url').blur(function(){
		if ($('#url').val().substring(0, 'http://'.length) !== 'http://'){
			$('#url').val('http://'+$('#url').val())
		}
		
	});
	
	$('#submit').submit(function(e){
			
		$.get('http://relert.herokuapp.com/add?url='+$('#url').val()+'&email='+$('#email').val()+'&name='+$('#name').val(),function(data) {
			var data = $.parseJSON(data)
			if (!data.error){
				$('#overlay').removeClass('hidden');
				$('#relert-modal').removeClass('hidden');
				
				$('#relert-link').val(data.url).focus().select();
			} else {
				alert(data.error)
			}
		});
		
		e.preventDefault();
	});
	
	$('#new').click(function(){
		$('#overlay').addClass('hidden');
		$('#relert-modal').addClass('hidden');
	});
	
	$('#how').click(function(){
		$('#overlay').removeClass('hidden');
		$('#how-modal').removeClass('hidden');
		return false;
	});
});


function isUrl(s) {
	var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	return regexp.test(s);
}
