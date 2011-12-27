$(window).ready(function(){
	$("#box").validate({
		rules: {
			url: {
				required: true,
				niceUrl: function(a){
						if (a.match(/(?:[a-zA-Z]|\d+)\.[a-zA-Z]+./)){
							return true;
						} else {
							return false;
						}
				}
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
				niceUrl: "Invald url"
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
			$(element).next().html(error).removeClass('hidden status-ok').addClass('status-error');
		},
		success: function(label) {
			console.log('#'+$(label).attr('for'));
			$('#'+$(label).attr('for')).next().html("✓").removeClass('hidden status-error').addClass('status-ok');
		}
	});
	$('#url').focus();
	
	$('#box').submit(function(e){
		alert('clicked');
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
		
		return false;
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
	
	$('#how-modal-close').click(function(){
		$('#overlay').addClass('hidden');
		$('#how-modal').addClass('hidden');
		return false;
	});
});


function isUrl(s) {
	var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	return regexp.test(s);
}
