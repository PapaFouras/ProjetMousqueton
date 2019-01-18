<?php
session_start();
if(!empty($_SESSION['login_user'])) { 
  header('Location: ../asm/index.php');
  }
?>
<!doctype html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<title>GENDLOC - ASM - LOGIN</title>
<link rel="stylesheet" href="css/style.css"/>
<script src="js/jquery.min.js"></script>
<script src="js/jquery.ui.shake.js"></script>
	<script>
			$(document).ready(function() {
			
			$('#login').click(function()
			{
			var username=$("#username").val();
			var password=$("#password").val();
		    var dataString = 'username='+username+'&password='+password;
			if($.trim(username).length>0 && $.trim(password).length>0)
			{
			
 
			$.ajax({
            type: "POST",
            url: "ajaxLogin.php",
            data: dataString,
            cache: false,
            beforeSend: function(){ $("#login").val('Connecting...');},
            success: function(data){
            if(data)
            {
            $("body").load("home.php").hide().fadeIn(1500).delay(6000);
            }
            else
            {
             $('#box').shake();
			 $("#login").val('ENTRER')
			 $("#error").html("<span style='color:#cc0000'>Error:</span> INVALIDE ");
            }
            }
            });
			
			}
			return false;
			});
			
				
			});
		</script>
</head>

<body>
<div id="main">
</br></br></br></br></br></br></br></br>
<div id="box">
<form action="" method="post">
<label>Nom</label> 
<input type="text" name="username" class="input" autocomplete="off" id="username"/>
<label>Mot de passe </label>
<input type="password" name="password" class="input" autocomplete="off" id="password"/><br/>
<input type="submit" class="button button-primary" value="ENTRER" id="login"/> 
<span class='msg'></span> 

<div id="error">

</div>	

</div>
</form>	
</div>

</div>
</body>
</html>
