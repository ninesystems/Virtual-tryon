const jsDom = require('./libs/jsDom').default;
const ModelGallery = require('./ModelGallery').default;

export default function TryonBar(myBarArea){
	var barArea = myBarArea;
	var settings = settings_tryon;
	var totalButtons = 0;
	var arrButtonSerial=[];
	var arrButtons = [];
	var _barObject = this;
     // Used to make model gallery panel
	var modelGal = null;
    // Used to make webcam panel
	var webcamArea= null;
    // uSed to make the adjustment done bar//
	var adjustArea =null;
    // Used tp make confirmation bar, do you need to use the same picture which we shoot now or need to retake
	var confirmationArea = null;
    // Used for the main buttons//
    var mainPanelArea = null;
    // cam will be ready by getting event //
    var isCamReady = false;
    var hasFlash='';
    var isMobile = navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i);
	TryonBar.prototype.setupLayout = function(){
		arrButtonSerial=[];
        if(settings.isPanel===true)
		{
			
        jsDom.css(barArea, {"-webkit-touch-callout": "none", "-webkit-user-select":"none", "-khtml-user-select":"none","-moz-user-select":"none","-ms-user-select":"none","user-select":"none"})
		jsDom.css(barArea, {"width":(parseInt(settings.panelwidth)-(2*parseInt(settings.panelborder)))+"px", "height":(parseInt(settings.panelheight)-(2*parseInt(settings.panelborder)))+"px", "background":settings.panelcolor+""});
		//jsDom.setBGOpacity(barArea, parseInt(settings.panelalpha));
		//hasFlash = (typeof navigator.plugins == "undefined" || navigator.plugins.length == 0) ? !!(new ActiveXObject("ShockwaveFlash.ShockwaveFlash")) : navigator.plugins["Shockwave Flash"];
		
		}
		else{
			settings.panelwidth=settings.width;
			jsDom.css(barArea, {"-webkit-touch-callout": "none", "-webkit-user-select":"none", "-khtml-user-select":"none","-moz-user-select":"none","-ms-user-select":"none","user-select":"none"})
		jsDom.css(barArea, {"width":(parseInt(settings.panelwidth)-(2*parseInt(settings.panelborder)))+"px", "height":(parseInt(settings.panelheight)-(2*parseInt(settings.panelborder)))+"px", "background":settings.panelcolor+""});
		
		}
		jsDom.css(barArea,{"position":"relative"});
       jsDom.setBGOpacity(barArea, parseInt(settings.panelalpha));
		if(settings.panellocation=="inside"){
			jsDom.css(barArea, {"bottom":settings.panelheight+"px"});
		}
		/*jsDom.css(barArea, {"border":"solid "+settings.panelbordercolor+" "+settings.panelborder+"px"});*/
		// setting up the model gallery thing, must be activated on tryon start//
		modelGal = new ModelGallery(barArea);
		//Base ready, now time to add buttons//
		
		addButtons(isMobile);
		EventListener.addEventListener("RESET_VIEW_DEFAULT", resetViewtoDefault);
        EventListener.addEventListener("WEBCAM_READY", camReady);
        EventListener.addEventListener("ADJUSTMENT_STARTED", SwapToAdjustBar);
        EventListener.addEventListener("WEBCAM_CLOSED", camClosed);
        EventListener.addEventListener("GALLERY_CLOSED", galleryClosed);
      };

    function camReady(){
        isCamReady = true;
    };

    function camClosed(){
        isCamReady = false;
    };
	function addButtons(isMobile) {
        mainPanelArea = jsDom.createNode("div", {"id":"mainPanelArea"}, "", "parent", barArea, true);
                        jsDom.css(mainPanelArea,{"position":"absolute","left":"-9px"});
		var buttons = settings.buttons.split(",");
		var btntooltip=settings.buttonstooltip.split(",");
		buttons.reverse();
		btntooltip.reverse();
		if(isMobile){
			buttons.splice(1,1);

		}
		totalButtons = buttons.length;
		for (var i = buttons.length - 1; i >= 0; i--) {
			var nameValueButton = buttons[i].split("*");
			var btn=btntooltip[i].split("*");
			arrButtonSerial.push(nameValueButton[0]);
			if(nameValueButton[0]=="browse"){

				makeBrowseButton(nameValueButton[1], btn[1], addToBar);
			}else{
				if(settings.isShowTitleWithIcon){
					makeImgBtnTooltip(nameValueButton[0],nameValueButton[1],btn[1],addToBar,true);
				}
				else{
					makeImageButton(nameValueButton[0], nameValueButton[1],i,addToBar);
				}
				
			}
			
		};
	};
	function makeImgBtnTooltip(name, imageSrc, text, callback){
	
		var strButton = '';
		var img = new Image();
		img.onload = function(){
			const labelHeight = parseInt(settings.fontSize);
                this.width  += labelHeight;
                this.height  += labelHeight;
			var leftMargin = ((parseInt(settings.panelwidth)+(parseInt(settings.panelborder)*2)) / totalButtons)/2;// - (this.width)/2;
			var topMargin = (parseInt(settings.panelheight) - this.height)/2;
			/*strButton='<label for="tryon'+name+'" class="tool">'+text+'</label>';*/
			strButton ='<label id="tryon'+name+'" style="display:block;line-height:1;font-size:'+settings.fontSize+'px; float:left; margin-top:'+topMargin+'px; margin-left:'+leftMargin+'px; overflow:hidden; cursor:pointer; width:'+this.width+'px;height:'+this.height+'px;background-image:url('+imageSrc+');background-position:center top;z-index:9999;background-repeat:no-repeat;"><span style="top:25px; position:relative; display:block; text-align:center">'+text+'</span></label>'
			if(callback){callback(strButton, name)};
		};
		img.src = imageSrc;
	};
	function addToBar(strButton, buttonName) {
		var btnElem= strButton.toDOM();
		arrButtons[buttonName]= btnElem;
		var button = Object.keys(arrButtons).length;
		if(button>=totalButtons){
			for(var k=0;k< arrButtonSerial.length; k++){
				jsDom.append(mainPanelArea, arrButtons[arrButtonSerial[k]]);
				// Lost this here, this is refering to window now//
				addClickAction(arrButtonSerial[k], _barObject);
			};
		}
	};

	function makeBrowseButton(imageSrc,text,callback){
		
		
		var strButton = '';
		var img = new Image();
		img.onload = function(){
			var leftMargin = ((parseInt(settings.panelwidth)+(parseInt(settings.panelborder)*2)) / totalButtons)/2;
            var labelHeight = 0;
            if(settings.isShowTitleWithIcon){
                labelHeight = parseInt(settings.fontSize);
                this.width  += labelHeight;
                this.height  += labelHeight;
            }
            var topMargin = (parseInt(settings.panelheight) - this.height)/2;

			if (window.File && window.FileReader && window.FileList && window.Blob) {
				strButton ='<label style="display:block; float:left;line-height:1; font-size:'+settings.fontSize+'px; margin-top:'+topMargin+'px; margin-left:'+leftMargin+'px; overflow:hidden; cursor:pointer; width:'+this.width+'px;height:'+this.height+'px;background-image:url('+imageSrc+');background-position:center top; background-repeat:no-repeat;"><input type="file" id="tryonbrowse'+'" size="2" style="position:relative;margin:0; cursor:pointer; height:'+(this.height-labelHeight)+'px;width: '+this.width+'px;opacity: 0;-moz-opacity: 0;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);" accept="image/*" /><span style="top:25px; display:block; text-align:center">'+text+'</span></label>'
			}
			if(callback){callback(strButton, "browse")};
		};
		img.src = imageSrc;
	};

	function makeImageButton(name, imageSrc, position, callback,tooltip){
		var strButton = '';
		var img = new Image();
		img.onload = function(){
			if(name=='ok_button'){
				var leftMargin = ((parseInt(settings.panelwidth)+(parseInt(settings.panelborder)*2)) / totalButtons)/2- (this.width)/2;// - (this.width)/2;
			
			}
			else{
			var leftMargin = ((parseInt(settings.panelwidth)+(parseInt(settings.panelborder)*2)) / totalButtons)/2 - (this.width)/2;
			
			}
			var topMargin = (parseInt(settings.panelheight) - this.height)/2;
			if(tooltip){
				
			    strButton ='<label id="tryon'+name+'" style="display:block;line-height:1; float:left; margin-top:'+topMargin+'px; margin-left:'+leftMargin+'px; overflow:hidden; cursor:pointer; width:'+this.width+'px;height:'+this.height+'px;background-image:url('+imageSrc+');"></label>';
			}
			else{
				
			    strButton ='<label id="tryon'+name+'" style="display:block;line-height:1; float:left; margin-top:'+topMargin+'px; margin-left:'+leftMargin+'px; overflow:hidden; cursor:pointer; width:'+this.width+'px;height:'+this.height+'px;background-image:url('+imageSrc+');"></label>';
			
			}

			if(callback){callback(strButton, name)};
		};
		img.src = imageSrc;
	};
	function addClickAction(btnName) {
        var elem = jsDom.nodeById("tryon"+btnName);
        // Need to leave the _barReferace here as that change the referance
		if(btnName=="browse"){
			if(window.FileReader && window.FileList && window.Blob){
				elem.addEventListener("change", function(evt){
                    dispatchButtonEvent(evt);
                });
			}
		}else{
                
			elem.addEventListener("click", function(evt){
                dispatchButtonEvent(evt);
            });
                if(!isMobile){
                	
            	elem.addEventListener("touchstart", function(evt){
                dispatchButtonEvent(evt);
            });
            }
		}
	};

	function dispatchButtonEvent(evt){
        // rebuilding the refrace//
		var btnId = evt.target.id.split("tryon").join("");

		switch(btnId){
			case "browse":
				EventListener.dispatch("FILE_LOAD_COMPLETE", this, evt.target.files, "");
			break;
			case "modelgallery":
                jsDom.css(mainPanelArea, {"display":"none"});
				modelGal.setupLayout();
			break;
			case "webcam":
				EventListener.dispatch("WEBCAM_OPEN", this);
				SwapToCamBar();
			break;
			case "take_pic":
                if(isCamReady){
                    EventListener.dispatch("WEBCAM_TAKE_PICTURE", this);
                    SwapToRetakeBar();
                }else{
                    EventListener.dispatch("requestAllowCamera", this);
                }
			break;
			case "close_cam":
                if(isCamReady){
                    EventListener.dispatch("WEBCAM_CLOSE", this);
                    SwapToBar();
                }else{
                    EventListener.dispatch("requestAllowCamera", this);
                }
			break;
			case "use_pic":
				EventListener.dispatch("ADJUSTMENT_STARTED", this);
                 
			break;
			case "retake":
				EventListener.dispatch("WEBCAM_RETAKE", this);
				SwapToCamBar();
			break;
			case "ok_button":

				EventListener.dispatch("ALL_DONE", this);
				SwapToBar();
			break;
		};
	};

    function getBarID(){
        return this.id;
    }
	function SwapToCamBar() {
        jsDom.css(mainPanelArea, {"display":"none"});
		// Styling Done - Now add some action//
		var panelheight = (parseInt(settings.panelheight)-(2*parseInt(settings.panelborder)));
		webcamArea = jsDom.createNode("div", {"id":"webcambarArea", "style":"overflow:hidden;"}, "", "parent", barArea, true);
		jsDom.css(webcamArea, {"width":settings.panelwidth+"px", "height":panelheight+"px", "background":settings.panelcolor+""});
		// Styling done //
		addWebcamButtons();
	};

	function SwapToAdjustBar() {
		
        jsDom.css(mainPanelArea, {"display":"none"});
       
		// Styling Done - Now add some action//
		var panelheight = (parseInt(settings.panelheight)-(2*parseInt(settings.panelborder)));
		adjustArea = jsDom.createNode("div", {"id":"adjustArea", "style":"overflow:hidden;"}, "", "parent", barArea, true);
		jsDom.css(adjustArea, {"width":settings.panelwidth+"px", /*"height":panelheight+"px",*/ "background":settings.panelcolor+""});
		// Styling done //
		totalButtons = 1;

		makeImageButton("ok_button", settings.okbutton, "", addToDoneBar);
	};
	function SwapToBar() {
        jsDom.css(mainPanelArea, {"display":"block"});
   
       
        webcamArea = jsDom.nodeById("webcambarArea");
		if(webcamArea!==null){
			jsDom.remove(webcamArea);
            webcamArea = null;
		}
        if(adjustArea!==null){
            jsDom.remove(adjustArea);
            adjustArea = null;
        }
		if(confirmationArea!==null){
			jsDom.remove(confirmationArea);
            confirmationArea = null;
		}
	};
	function SwapToRetakeBar() {
		jsDom.remove(webcamArea);
		var panelheight = (parseInt(settings.panelheight)-(2*parseInt(settings.panelborder)));
		confirmationArea = jsDom.createNode("div", {"id":"confirmationArea", "style":"overflow:hidden;"}, "", "parent", barArea, true);
		jsDom.css(confirmationArea, {"width":settings.panelwidth+"px", "height":panelheight+"px", "background":settings.panelcolor+""});
		// Styling done //
		addConfirmationbuttons();
	};

	function addWebcamButtons() {
		totalButtons = 2;
		var takepicicon = settings.takepicicon;
		var closebutton = settings.closebutton;
		if(settings.isShowTitleWithIcon){
		makeImgBtnTooltip("take_pic", takepicicon, settings.takepicicontooltip, addToWebcamBar);
		makeImgBtnTooltip("close_cam", closebutton, settings.closebuttontooltip, addToWebcamBar);
		}
		else{
		makeImageButton("take_pic", takepicicon, "", addToWebcamBar);
		makeImageButton("close_cam", closebutton, "", addToWebcamBar);
		}
		
	};

	function addToWebcamBar(strButton, buttonName) {
		if(confirmationArea!==null){
			jsDom.remove(confirmationArea);
            confirmationArea = null;
		}
		var btnElem= strButton.toDOM();
		jsDom.append(webcamArea, btnElem);
		addClickAction(buttonName);
	};

	function resetViewtoDefault(evt) {
		SwapToBar();
	};

	function addConfirmationbuttons(evt) {
		var usepictureicon = settings.usepictureicon;
		var closebutton = settings.closebutton;
		if(settings.isShowTitleWithIcon){
		makeImgBtnTooltip("use_pic", usepictureicon, settings.usepicturetooltip, addToConfirmBar);
		makeImgBtnTooltip("retake", closebutton, settings.discardpicturetooltip, addToConfirmBar);
		}
		else{
		makeImageButton("use_pic", usepictureicon, "", addToConfirmBar);
		makeImageButton("retake", closebutton, "", addToConfirmBar);	
		}
		

	};

	function addToConfirmBar(strButton, buttonName) {
		var btnElem= strButton.toDOM();
		jsDom.append(confirmationArea, btnElem);
		addClickAction(buttonName);
	};

	function addToDoneBar(strButton, buttonName) {
		var btnElem= strButton.toDOM();
		jsDom.append(adjustArea, btnElem);
		addClickAction(buttonName);
		if(confirmationArea!==null){
			jsDom.remove(confirmationArea);
            confirmationArea = null;
		}
		if(buttonName=="ok_button"){
			EventListener.dispatch("CHECK_FOR_MOBILE",this);
		}
	};

    function galleryClosed(){

        SwapToBar();
    }

	// auto intiate //
	this.setupLayout();
};