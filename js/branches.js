$(document).ready(function() {
	
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
	
	$(document).on("click", "#addBtn", function(e) {
	  
	   window.location.href = '../ui/addbranch.html';
	   return false;
	  
	});
	$(document).on("click", "#backBtn", function(e) {
	  
	   window.location.href = '../ui/branches.html';
	   return false;
	  
	});
	$(document).on("click", "#submitReg", function(e) {
	  
	  var flag = validateForm();
		if(flag){
			
			var that = this;
			ripple($(that), e);
			$(that).addClass("processing");
			
			var url="http://localhost:3000/branches/register";
			var responsedata = ajaxCall(url,JSON.stringify(createJSON()));
			console.log(responsedata);
			if(responsedata){
				setTimeout(function(){ 
				window.location.href = '../ui/branches.html';
				return false; }, 900);
				
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
			if(!$( this ).val()){
				$(this).removeClass("login__input");
				$(this).addClass("blinking_text");
				flag = false;
			}
			
		});
		return flag;
	}
	
	function createJSON(){
		var object={};
		$( "input" ).each(function( index ) {
			if($( this ).val()){
				object[$( this ).attr('placeholder')] = $( this ).val();
			}
			
		});
		 console.log("From Session==="+$.session.get('Company Name'));
		
		object['Company Name'] =$.session.get('Company Name');
		object['Company Domain'] =$.session.get('Company Domain');
		object['Email Id'] =$.session.get('Email Id');
		return object;
	}
});