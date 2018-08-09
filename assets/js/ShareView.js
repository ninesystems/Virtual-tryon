
var ShareView = function(){
	/*var previewArea = myWorkArea;*/
	var settings = settings_tryon;
	var loadimg='';
	var mainArea='';
	ShareView.prototype.initPlugin = function() {
		EventListener.addEventListener("SHARE_PREVIEW_SCREEN", setupLayout);
	};

	function setupLayout(evt) {
		// body...
		//this will open a transparent black panel in which we will have sharing icons//
	};
	ShareView.prototype.savetheImage=function (option) {
		  var previewArea=jsDom.nodeById(settings_tryon.activeTryon);
		  mainArea=jsDom.nodeById("mainArea");
		  loadimg= jsDom.createNode("img", {"src":"assets/vtoplus/assets/images/loader.gif"}, "", "parent", previewArea, true);
		  jsDom.css(loadimg, {"position":"absolute", "display":"block", "opacity":"1","left":"45%","top":"45%"});
		  jsDom.css(mainArea, {"opacity":"0.5"});
		  var data='';
		  var areatoshare=jsDom.nodeById("mainArea");
		  var mainimage=jsDom.nodeById("previewImage");
		  var canvaswidth=mainimage.width;
		  var canvasheight=mainimage.height;
		  var canvas =document.createElement('canvas');
		  canvas.width=canvaswidth;
		  canvas.height=canvasheight;
		 
		  var scalefactor=mainimage.naturalHeight/mainimage.height;
		  var ctx=canvas.getContext("2d");
		  Tools.getTransformData(mainimage,function(scale,fRotation){
		  ctx.save();
		  ctx.translate(mainimage.width/2,mainimage.height/2);
		  ctx.rotate(fRotation*Math.PI/180);
          ctx.scale(scale,scale);
		  ctx.drawImage(mainimage,-mainimage.width/2,-mainimage.height/2,mainimage.width,mainimage.height);
		  getFilterData(mainimage,ctx,canvas);
		  data=canvas.toDataURL('image/png');
		  })
		  frame=jsDom.nodeById("frame");
		  if(frame){
			Tools.getTransformData(frame,function(scale,fRotation){

				var x=parseFloat(frame.style.left)+frame.width/2-parseFloat(mainimage.style.left);
				var y=parseFloat(frame.style.top)+frame.height/2-parseFloat(mainimage.style.top);
				ctx.restore();
				ctx.translate(x,y);
				ctx.rotate(fRotation*Math.PI/180);
          		ctx.scale(scale,scale);
                ctx.globalAlpha = 0.85;
          		ctx.drawImage(frame,-1*frame.width/2,-1*frame.height/2,frame.width,frame.height);
         		data=canvas.toDataURL('image/png');
         		sendRequest(option,data);
			});
		 
		 }
          else{
          sendRequest(option,data);
          }
       	
	};
	function sendRequest(option,data){
		try{
			var xmlhttp;
			if (window.XMLHttpRequest) {
	        xmlhttp = new XMLHttpRequest();
	    	} else {
	        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	    	}
			xmlhttp.onreadystatechange = function() {
	        if (xmlhttp.readyState == 4 ) {
	           if(xmlhttp.status == 200){
	           	jsDom.remove(loadimg);
	           	jsDom.css(mainArea, {"opacity":"1"});
	            switch(option){
			      case 'tw':
			       shareToTwitter(xmlhttp.responseText);
			      break;
			      case 'fb':
			       shareToFB(xmlhttp.responseText);
			      break;
			      case 'saveonly':
			      var a = document.createElement('a');
    			 a.setAttribute('download', settings.saveImageTitle);
     			 a.href = xmlhttp.responseText;
     			 a.setAttribute('target', '_blank');
      			 a.innerHTML = 'testing';
			     a.style.display = 'none';
			     document.body.appendChild(a);
			     a.click();
			      break;
	            }

	           }
	           else if(xmlhttp.status == 400) {
	              console.log('There was an error 400')
	           }
	           else {
	               console.log('something else other than 200 was returned')
	           }
	        }
	    	}
			xmlhttp.open("POST", settings.saveFileUrl, true);
			xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xmlhttp.send('img='+data);
			}catch(e){console.log(e);}

	};
	
	function getFilterData(container,context,canvas){
		var st = window.getComputedStyle(container, null);
      	var tr = st.getPropertyValue("-webkit-filter") ||
	    st.getPropertyValue("filter");
	    if(tr!='none'){
	    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
		var pixels = imageData.data,delta=50;
		    for (var i = 0, il = pixels.length; i < il; i += 4) {
			  pixels[i] +=delta ;
		      pixels[i + 1] +=delta;
		      pixels[i + 2] +=delta;
		    }
		var contrast=65;
		var factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
			for(var i=0;i<pixels.length;i+=4)
		    {
		        pixels[i] = factor * (pixels[i] - 128) + 128;
		        pixels[i+1] = factor * (pixels[i+1] - 128) + 128;
		        pixels[i+2] = factor * (pixels[i+2] - 128) + 128;
		    }
		   context.putImageData(imageData, 0, 0);
	    }
	};
	function shareToFB(imgurl) {
		var encodedurl=encodeURIComponent(settings.shareURL+"?title="+settings.shareTitle+"& desc="+settings.shareDescription+" & image="+imgurl);
		var fbUrl="http://www.facebook.com/sharer/sharer.php?u="+encodedurl;
		window.open(fbUrl, "_blank");
      };
	function shareToTwitter(imgurl) {
		var encodedurl=encodeURIComponent(settings.shareURL+"?title="+settings.shareTitle+"& desc="+settings.shareDescription+" & image="+imgurl);
		var twUrl='https://twitter.com/intent/tweet?text='+settings.shareTitle+'&url=http://demo.thesoftsol.com/tryon.html&hashtags='+settings.twitterHashtag;
      	window.open(twUrl, "_blank");
     };
	// auto intiate //
	this.initPlugin();
};