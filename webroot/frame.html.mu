<html>
<head>
<style>
	html{
		height:100%;
	}
	body{
		min-height: 100%;
		margin:0px;
		font-size: 30px;
		color:white;
		font-family: sans-serif;
		font-weight:bold;
		overflow:hidden;
	}
	
	#message{
		display:inline;
		width:20%;
	}
	
	#bar{
		position:relative;
		background: #932; /* Old browsers */
		box-shadow: 0px 1px 20px #222;
		padding:0 10px;
		z-index:9999;
		display: block;
	}
	#close{
		right:20px;
		font-size:20px;
		height: 80%;
		width:5%;
	}
		
	#send{
		width:10%;
	}
	A:link {text-decoration: none; color: white}
	A:visited {text-decoration: none; color: white}
	A:active {text-decoration: none; color: white}
	A:hover {text-decoration: none; color: white;}
	
	
	#iframe{
		position:absolute;
	}
	
	input[type=textarea]{
		display: inline;
		border-radius: 4px;
		font-size: 20px;
		width:50%;
	}
	
	.button{
		display: inline;
		font-size: 1em;
		text-align: center;
		font-weight: bold;
		background-color: #235;
		border-radius: 3px;
		cursor: pointer;
		box-shadow: 0px 0px 2px #abb inset;
	}
	
	.button:hover{
		box-shadow: 0px 0px 5px #abb inset;
	}
	
	.button:active{
		background-color:#334433;
	}
</style>
</head>
<body>
<div id="bar">
	<div id="message">
		Send a comment about the link:
	</div>
	<input type="textarea" placeholder="This will be emailed to your friend"/>
	<div id="send" class="button">send</div>
	<a id="close" class="button" href="{{url}}">x</a>
</div>
<iframe src="{{url}}" width="100%" noresize="noresize" frameborder="0" id="iframe" style="height: 100%; "></iframe>
<script src="jquery.min.js"></script>
<script src="frame.js"></script>
</body>
</html>


