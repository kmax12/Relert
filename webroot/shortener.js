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
			//var error = $(error).text();
			console.log($(error).text());
			
			$(element).qtip({
			content: error,
			position: {
				corner: {
					target: 'leftMiddle',
					tooltip: 'rightMiddle'
				}
			},
			show: { ready: true },
			style: {
				tip: 'rightMiddle',
				padding: '5px 15px', // Give it some extra padding
				name: 'red' // And style it with the preset dark theme
			}
			});
			if($(element).qtip("api")){
				//$(element).qtip("api").qtip('destroy');
			}
		},
		success: function(label) {
			console.log(label);
			// set &nbsp; as text for IE
			//label.html("&nbsp;").addClass("checked");
		}
	});
	$('#url').focus();
	
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


function isUrl(s) {
	var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	return regexp.test(s);
}
