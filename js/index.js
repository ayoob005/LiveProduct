
$(document).ready(function() {
  
  var animating = false,
      submitPhase1 = 1100,
      submitPhase2 = 400,
      logoutPhase1 = 800,
      $login = $(".login"),
      $app = $(".app");
  
  function ripple(elem, e) {
    $(".ripple").remove();
    var elTop = elem.offset().top,
        elLeft = elem.offset().left,
        x = e.pageX - elLeft,
        y = e.pageY - elTop;
    var $ripple = $("<div class='ripple'></div>");
    $ripple.css({top: y, left: x});
    elem.append($ripple);
  };
  
  $(document).on("click", "#loginSubmit", function(e) {
	 var username=$("#username").val();
	 var password=$("#password").val();
	 if(username){
		 if(username.length==0){
			 showErrorMessage("Please Enter Username");
			 returnToLogin(that);
			 return;
		 }
	 }else{
		 showErrorMessage("Please Enter Username");
		 returnToLogin(that);
		 return;
	 }
	 if(password){
		 if(password.length==0){
			 showErrorMessage("Please Enter Password");
			 returnToLogin(that);
			 return;
		 }
	 }else{
		 showErrorMessage("Please Enter Password");
		 returnToLogin(that);
		 return;
	 }
    if (animating) return;
    animating = true;
    var that = this;
    ripple($(that), e);
    $(that).addClass("processing");
	var url="http://localhost:3000/customer/login";
	var dataObj = {};
	dataObj["Username"] = username;
	dataObj["Password"] = password;
	
	var responsedata = ajaxCall(url,JSON.stringify(dataObj));
	if(responsedata){
		if(responsedata[0]){
			console.log(responsedata[0]);
			var userObj = responsedata[0];
		  $.session.set('Company Name', userObj["Company Name"]);
		  $.session.set('Company Domain', userObj["Company Domain"]);
		  $.session.set('Email Id', userObj["Email Id"]);
		 
		  setTimeout(function() {
		  $(that).addClass("success");
		  setTimeout(function() {
			$app.show();
			$app.css("top");
			$app.addClass("active");
		  }, submitPhase2 - 70);
		  setTimeout(function() {
			$login.hide();
			$login.addClass("inactive");
			animating = false;
			$(that).removeClass("success processing");
		  }, submitPhase2);
		}, submitPhase1);
		
		//window.location.href = './ui/Home.html';
			//return false;
	  }else{
		  
		 var errorMessage ="Login Failed due to invalid login attempt. If you forgot the Password, please use forgot password flow to reset password.";
		 showErrorMessage(errorMessage);
		 returnToLogin(that);
	  }
	}else{
		
		 var errorMessage ="Login Failed due to invalid login attempt. If you forgot the Password, please use forgot password flow to reset password.";
		 showErrorMessage(errorMessage);
		 returnToLogin(that);
	}
		  
  });
  $(document).on("click", "#nextBtn", function(e) {
	  var flag = validateForm('First');
	  if(flag){
		  $(".registration__form").hide();
		  $(".registration__form_second").show();
	  }
	  
	});  
	$(document).on("click", "#backBtn", function(e) {
	  
	  $(".registration__form_second").hide();
	  $(".registration__form").show();
	}); 
	$(document).on("click", "#backBtnFirst", function(e) {
	   window.location.href = '../index.html';
	   return false;
	});
	$(document).on("click", "#brachMenu", function(e) {
	   window.location.href = './ui/branches.html';
	   return false;
	});
	
	$(document).on("focus", "input", function(e) {
	  	$(this).removeClass("blinking_text");
		$(this).addClass("login__input");
	});
	$(document).on("click", "#sumbitBtn", function(e) {
		
		var flag = validateForm('Second');
		if(flag){
			
			var that = this;
			ripple($(that), e);
			$(that).addClass("processing");
			
			var companyName=$("#companyName").val();
			var contactName=$("#contactName").val();
			var domain=$("#domain").val();
			var address1=$("#address1").val();
			var streat=$("#streat").val();
			var city=$("#city").val();
			var pin=$("#pin").val();
			var state=$("#state").val();
			var country=$("#country").val();
			var contactNnumber=$("#contactNnumber").val();
			var emailId=$("#emailId").val();
			var username=$("#username").val();
			var password=$("#password").val();
			var confirmPassword=$("#confirmPassword").val();
			
			var url="http://localhost:3000/customer/register";
			var responsedata = ajaxCall(url,JSON.stringify(createJSON()));
			console.log(responsedata);
			if(responsedata){
				setTimeout(function(){ 
				$(".registration__form_second").hide();
				$(".registration__form_success").show(); }, 900);
				
			}else{
				$(".ripple").remove();
				$(that).removeClass("processing");
			}
		}
		
		
		
	});	
	function validateForm(page){
		var flag= true;
		$( "input" ).each(function( index ) {
			console.log(index +":"+$( this ).val());
			
			if(page=='First'){
				if(index<9){
					if(!$( this ).val()){
						$(this).removeClass("login__input");
						$(this).addClass("blinking_text");
						flag = false;
					}
				}
			}
			if(page=='Second'){
				if(index>=9){
					if(!$( this ).val()){
						$(this).removeClass("login__input");
						$(this).addClass("blinking_text");
						flag = false;
					}
				}
			}
		});
		return flag;
	}
	function createJSON(){
		var object={};
		$( "input" ).each(function( index ) {
			if($( this ).val()){
				if($( this ).attr('placeholder') != 'Confirm Password'){
					object[$( this ).attr('placeholder')] = $( this ).val();
				}
			}
			
		});
		return object;
	}

  $(document).on("click", ".app__logout", function(e) {
    if (animating) return;
    $(".ripple").remove();
    animating = true;
    var that = this;
    $(that).addClass("clicked");
    setTimeout(function() {
      $app.removeClass("active");
      $login.show();
      $login.css("top");
      $login.removeClass("inactive");
    }, logoutPhase1 - 120);
    setTimeout(function() {
      $app.hide();
      animating = false;
      $(that).removeClass("clicked");
    }, logoutPhase1);
  });
  
  function ajaxCall(url,dataObj){
	  var responseObj;
	  console.log("dataObj==="+dataObj);
	  $.ajax({
	  url: url,
	  type: "POST",
	 
		crossDomain: true,
		
	  dataType: "json",
	  contentType: 'application/json; charset=utf-8',
	  data: dataObj,
	  async: false,
	  success: function(data) {
		  responseObj= data;
			
	  },
	  error: function(jqXHR, textStatus, errorThrown) {
		console.log(textStatus + jqXHR.responseText);
	  }
	});
	
	return responseObj;
  }
  
  function showErrorMessage(errorMessage){
	  var iconObj = "<img src='image/err_icon.png' width='30px' height='30px' class='errorImage'/>"
	  
	  $("#messageDiv").html(iconObj+errorMessage);
	  $("#messageDiv").show();
	  
  }
  function returnToLogin(that){
	  animating = false;
		   $(".ripple").remove();
		  setTimeout(function() {
		  
		  $login.show();
		  $login.css("top");
		  $login.removeClass("inactive");
		}, logoutPhase1 - 120);
		$(that).removeClass("processing");
  }
  
  
  
});

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=http://localhost:3000/customer/login";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}