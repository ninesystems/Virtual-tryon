var WebcamToImage = function(playBackArea){
	var _webcam = this;
	var _playbackArea = playBackArea;
	var settings = settings_tryon;
	var vid =null;
	var can = null;
	var camWidth = 400;
	var camHeight = 300;
	var isMirror = false;
	var isEnhancedLight = false;
    var camInitiated = false;

	navigator.getUserMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);
	
	WebcamToImage.prototype.setupCam = function(){
		resetCam();
        if(!EventListener.hasEventListener("WEBCAM_CLOSE", closeCam, _webcam, true)){
            EventListener.addEventListener("WEBCAM_CLOSE", closeCam, _webcam, true);
            EventListener.addEventListener("WEBCAM_TAKE_PICTURE", takePicture, _webcam);
            EventListener.addEventListener("FLASH_CAM_DENIED", camDenied);
            if(navigator.getUserMedia){
                vid = jsDom.createNode("video", {"id":"tryon_webcam", "width":camWidth, "height":camHeight, "style":"position:absolute;"}, "", "parent", _playbackArea);
                jsDom.css(vid, {"transform":"rotateY(0deg)", "-webkit-transform":"rotateY(0deg);", "-moz-transform":"rotateY(0deg)", "display":"none;"});
                can = jsDom.createNode("canvas", {"id":"tryon_canvas", "width":settings.width+"", "height":settings.height+"", "style":"position:absolute;display:none;"}, "", "parent", _playbackArea);
                var tw = jsDom.getStyle(_playbackArea, "width", true);
                var th = jsDom.getStyle(_playbackArea, "height", true);

                var resVal = scaleToFit(camWidth, camHeight, tw, th, false);
                if(resVal){
                    vid.width = resVal.width;
                    vid.height = resVal.height;
                    jsDom.css(vid, {"left":resVal.targetleft+"px"});
                    jsDom.css(vid, {"top":resVal.targettop+"px"});
                };
                startHtmlCamera(vid);
            }else{
                startFlashCamera();
            }
        }
	};
	function startHtmlCamera(video) {
		var successCallback = function(stream){
			stream = stream;
			if (stream.getVideoTracks().length == 0) {
                // TODO: Add "noCamFound" as public event.
                EventListener.dispatch("noCamFound", this);
				closeCam(true);
        		return;
    		}
			if (window.URL){
			    video.src = window.URL.createObjectURL(stream);
			}else{
			    video.src = stream;
			};
		    jsDom.css(video, {"display":"block"});

			video.play();
            camInitiated = true;
            EventListener.dispatch("WEBCAM_READY", this);
			AddPanel();
		};
		var errorCallback = function(error){
            if(error.name == "PermissionDeniedError"){
                // TODO: Add "cameraPermissionDenied" as public event.
                EventListener.dispatch("cameraPermissionDenied", this);
            }
            camInitiated = false;
			closeCam(true);
		};
		navigator.getUserMedia({audio: false, video: true}, successCallback, errorCallback);
	};

	function AddPanel() {
		var panel = jsDom.createNode("div", {"style":"position:absolute; top:0;left:0;background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAAHe9q7oAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkRFMzM4RUI1NTIzODExRTRBRTVBRTRFMjA0NzM2OTVBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkRFMzM4RUI2NTIzODExRTRBRTVBRTRFMjA0NzM2OTVBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6REUzMzhFQjM1MjM4MTFFNEFFNUFFNEUyMDQ3MzY5NUEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6REUzMzhFQjQ1MjM4MTFFNEFFNUFFNEUyMDQ3MzY5NUEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6Dw1B6AAAAK0lEQVR42mJQVVbpBwggBhABEECMYBYQAAQQnMHEAAUAAcYCE4EBJgY0AAAI3ATyMVu6KgAAAABJRU5ErkJggg==); width:"+settings.width+"px; height:20px;"}, "", "parent", _playbackArea);
		
		var lowLightLabel = jsDom.createNode("label", {"style":"color:#fff; font-size:12px;float:right; width:89px; line-height:20px; font-family:Arial; display:block;"}, "", "parent", panel);
		jsDom.html(lowLightLabel, "Low light");
		var lowLight = jsDom.createNode("input", {"type":"checkbox", "id":"lowlight", "style":"float:left;"}, "", "parent", lowLightLabel);

		var mirrorModeLabel = jsDom.createNode("label", {"style":"color:#fff;float:left; font-size:12px; line-height:20px; width:89px; font-family:Arial; display:block;"}, "", "parent", panel);
		jsDom.html(mirrorModeLabel, "Mirror mode");
		var mirrorMode = jsDom.createNode("input", {"type":"checkbox", "id":"mirrormode", "style":"float:left"}, "", "parent", mirrorModeLabel);


		mirrorMode.addEventListener("click", function(evt){
			isMirror = jsDom.getProperty(mirrorMode, "checked");
			swapMirror(isMirror);
			disabledEventPropagation(evt);
		});
		mirrorMode.addEventListener("touchstart", function(evt){
			isMirror = jsDom.getProperty(mirrorMode, "checked");
			swapMirror(isMirror);
			disabledEventPropagation(evt);
		});

		lowlight.addEventListener("click", function(evt){
			isEnhancedLight = jsDom.getProperty(lowlight, "checked");
			enhanceLight(isEnhancedLight);
			disabledEventPropagation(evt);
		});
		lowlight.addEventListener("touchstart", function(evt){
			isEnhancedLight = jsDom.getProperty(lowlight, "checked");
			enhanceLight(isEnhancedLight);
			disabledEventPropagation(evt);
		});
	};

	function swapMirror(isMirror) {
		if(isMirror){
			jsDom.css(vid, {"transform":"scaleX(-1)", "-webkit-transform":"scaleX(-1);", "-moz-transform":"scaleX(-1)", "display":"block;"});
		}else{
			jsDom.css(vid, {"transform":"scaleX(1)", "-webkit-transform":"scaleX(1);", "-moz-transform":"scaleX(1)", "display":"block;"});
		};
	};

	function enhanceLight(isLowLight) {
		if(isLowLight){
			jsDom.css(vid, {"filter":"url(#brightness)", "-webkit-filter":" brightness(150%)", "display":"block;"});
		}else{
			jsDom.removeStyle(vid, "filter");
			jsDom.css(vid, {"-webkit-filter":" brightness(100%)", "display":"block;"});
		};
	};
	// Starting up flash camera //
	function startFlashCamera(){
        vid = jsDom.createNode("div", {"id":"tryon_webcam", "width":settings.width, "height":settings.height, "style":"position:absolute;top:0px;display:block;"}, "", "parent", _playbackArea);
        jsDom.html(vid, '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="'+settings.width+'" height="'+settings.height+'" id="webcam_flash"><param name="movie" value="'+settings.webcampath+'" /><param name="wmode" value="opaque" /><!--[if !IE]>--><object type="application/x-shockwave-flash" data="'+settings.webcampath+'" width="'+settings.width+'" height="'+settings.height+'" id="webcam_flash"><param name="wmode" value="opaque" /><!--<![endif]--><!--[if !IE]>--></object><!--<![endif]--></object>');

        //console.log("After the object insertion", vid.innerHTML);
        EventListener.addEventListener("WEBCAM_READY", function(){
            camInitiated = true;
        });
	};

    function takePicture(evt) {

        if(camInitiated){
            if(!navigator.getUserMedia){
                var flashCam = jsDom.nodeById("webcam_flash");
                if(flashCam!=null){
                    var imageData = flashCam._snap();
                    closeCam(false);
                    var data = 'data:image/jpg;base64,' + imageData;
                    EventListener.dispatch("ASK_FOR_CONFIRM", this, data, {"mirror":false, "enhancelight":false});
                }

            }else{
                var scale = vid.videoHeight/settings.height;
               
                if(isMirror){
                    can.width = vid.videoWidth;
                    can.height = vid.videoHeight;
                    var ctx=can.getContext("2d");

                    ctx.scale(-1,1);
                    ctx.drawImage(vid,0,0,-1*vid.videoWidth,vid.videoHeight);
                }
                else{
                can.getContext("2d").drawImage(vid, -1*parseInt(vid.style.left)*scale, -1*parseInt(vid.style.top)*scale, parseInt(settings.width)*scale, parseInt(settings.height)*scale, 0, 0, settings.width, settings.height);
                	
                }
                var img = can.toDataURL("image/png");
                closeCam(false);
                EventListener.dispatch("ASK_FOR_CONFIRM", this, img, {"mirror":isMirror, "enhancelight":isEnhancedLight});
               	}
        }else{
            // TODO: Add "requestAllowCamera" as public event.
            EventListener.dispatch("requestAllowCamera", this);
        }
	};

    function closeCam(needToReset) {
		if(navigator.getUserMedia){
			if(stream){
				stream.stop();
			}
			var vid = jsDom.nodeById("tryon_webcam");
            //jsDom.remove(vid);
			
			if(needToReset==true){
				EventListener.dispatch("RESET_VIEW_DEFAULT", this);
			}
            EventListener.dispatch("WEBCAM_CLOSED",this);	
           
		}else{
            var videoDiv = jsDom.nodeById("tryon_webcam");
            jsDom.remove(videoDiv);
            EventListener.dispatch("WEBCAM_CLOSED",this);
           }
	};

	function resetCam() {
		//vid = null;
        stream = null;
		EventListener.removeEventListener("WEBCAM_CLOSE", closeCam, _webcam);
		EventListener.removeEventListener("WEBCAM_TAKE_PICTURE", takePicture, _webcam);
	};

    function camDenied(){
         var videoDiv = jsDom.nodeById("tryon_webcam");
         jsDom.remove(videoDiv);
         startFlashCamera();
    };
	function scaleToFit(srcwidth, srcheight, targetwidth, targetheight, fLetterBox) {
	    var result = { width: 0, height: 0, fScaleToTargetWidth: true };
	    if ((srcwidth <= 0) || (srcheight <= 0) || (targetwidth <= 0) || (targetheight <= 0)) {
	        return result;
	    };
	    // scale to the target width
	    var scaleX1 = targetwidth;
	    var scaleY1 = (srcheight * targetwidth) / srcwidth;
	    // scale to the target height
	    var scaleX2 = (srcwidth * targetheight) / srcheight;
	    var scaleY2 = targetheight;
	    // now figure out which one we should use
	    var fScaleOnWidth = (scaleX2 > targetwidth);
	    if (fScaleOnWidth) {
	        fScaleOnWidth = fLetterBox;
	    }
	    else {
	       fScaleOnWidth = !fLetterBox;
	    }
	    if (fScaleOnWidth) {
	        result.width = Math.floor(scaleX1);
	        result.height = Math.floor(scaleY1);
	        result.fScaleToTargetWidth = true;
	    }
	    else {
	        result.width = Math.floor(scaleX2);
	        result.height = Math.floor(scaleY2);
	        result.fScaleToTargetWidth = false;
	    }
	    result.targetleft = Math.floor((targetwidth - result.width) / 2);
	    result.targettop = Math.floor((targetheight - result.height) / 2);
	    return result;
	};

	function disabledEventPropagation(event) {
	 
	   if (event.stopPropagation){
	       event.stopPropagation();
	   }
	   else if(window.event){
	      window.event.cancelBubble=true;
	   }
	};

    function destroyAdditional(){
        stream = null;
        EventListener.removeEventListener("WEBCAM_CLOSE", closeCam, _webcam);
        EventListener.removeEventListener("WEBCAM_TAKE_PICTURE", takePicture, _webcam);
    };
	_webcam.setupCam();

};