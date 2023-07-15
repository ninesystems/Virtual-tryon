var ModelGallery = function(myWorkArea){
	var previewArea = myWorkArea;
	var settings = settings_tryon;
	var _galleryRef = this;
	var modelArea = null;
    var leftArrow = null;
    var rightArrow = null;
	var modelsVisual = null;
	var isOpened = false;
    var isBuilded = false;
	/*var intID =0;
	var progress =0;*/
    var isMobile = navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i);
    var buttonsWidth = 0;

	ModelGallery.prototype.initPlugin = function() {
		EventListener.addEventListener("AREA_CLICKED", hideModelsIfOpen);

	};
	ModelGallery.prototype.setupLayout = function() {
		isOpened = true;
        if(isBuilded){
            jsDom.css(modelArea, {"display":"block"});
            if(!isMobile){
            jsDom.css(leftArrow, {"display":"block"});
            jsDom.css(rightArrow, {"display":"block"});
        }
           return;
        }
		panelheight = (parseInt(settings.panelheight)-(2*parseInt(settings.panelborder)));
        if(!isMobile){
            buttonsWidth = 42;
            leftArrow= jsDom.createNode("div", {"id":"leftArrow", "style":"width:20px; color:#3d3d3d; height:"+panelheight+"px; cursor:pointer; font-size:20px; line-height:"+panelheight+"px; float:left;"}, "", "parent", previewArea, true);
            jsDom.html(leftArrow, '&#9654;');
        }
        modelArea = jsDom.createNode("div", {"id":"modelArea", "style":"overflow:hidden; float:left;", "class":"dragdealer"}, "", "parent", previewArea, true);
        jsDom.css(modelArea, {"width":(settings.panelwidth-buttonsWidth)+"px", "height":panelheight+"px", "background":settings.panelcolor+""});
        if(!isMobile){
            rightArrow= jsDom.createNode("div", {"id":"rightArrow", "style":"width:20px;color:#3d3d3d; height:"+panelheight+"px;cursor:pointer; font-size:20px; line-height:"+panelheight+"px; float:left;"}, "", "parent", previewArea, true);
            jsDom.html(rightArrow, '&#9664;')
        }
		drawGallery();
	};

	function drawGallery() {
		modelsVisual = jsDom.createNode("ul", {"id":"modelVisual", "class":"handle", "style":"overflow:hidden;margin:0;padding:0;list-style: none;position:relative;left:0px;height: "+(panelheight)+"px;"}, "", "parent", modelArea);
		var totalModels = settings.modelsimages.split(",");
		var totalWidth = 0;
		var imageLoaded = 0;
		for (var i = 0; i < totalModels.length; i++) {
			var modelThumburl = totalModels[i].toString().trim();
			var modelThumb = jsDom.createNode("li", {"id":"modelThumb"+i, "style":"width:auto;height:"+panelheight+"px;cursor:pointer;background-size:25%; float:left;margin-right:5px"}, "", "parent", modelsVisual);
			var modelimage = jsDom.createNode("img", {"src":modelThumburl, "style":"width:auto;height:"+(panelheight-6)+"px;padding:2px; border:1px solid #d3d3d3;"}, "", "parent", modelThumb);
			modelimage.onload = function(){
				imageLoaded++;
                if(this.width<=50){
                    totalWidth += this.width + 11;
                }else{
                    totalWidth += (42 + 11);
                }

				if(imageLoaded>=totalModels.length){
					makeStript(totalWidth);
				}
			};
		}
        modelsVisual.addEventListener("click", modelChoosed);
	};

	function modelChoosed(evt) {
		var nodeType = evt.target.nodeName;
		var currentModel = evt.target || evt.srcElement;
		if(nodeType=="IMG"){
			var modelURL =  jsDom.getProperty(currentModel, "src");
			EventListener.dispatch("MODEL_CHOOSEN", this, modelURL, "");
            //Next line is only for demo//
            EventListener.dispatch("APPLY_FRAME",this,settings_tryon.currentFrame,settings_tryon.tryonActive,"1/5");
            hideModelsIfOpen();
		}
		
	};
	// All image loaded now making the stript//
	function makeStript(totalWidth){
		jsDom.css(modelsVisual, {"width":totalWidth+"px"});
        isBuilded = true;
        var step =1;
	    var totalModels = settings.modelsimages.split(",");
        var galDrag = new Dragdealer('modelArea', {
                steps: totalModels.length,
                speed: 0.3,
                loose: true,
                requestAnimationFrame: true
        });
        if(!isMobile){
        leftArrow.addEventListener("click", function(){
            if(step>totalModels.length){
                step = totalModels.length;
                return;
            }else{
                step++;
            }
            galDrag.setStep(step);
        });
        rightArrow.addEventListener("click", function(){
            if(step<=1){
                step = 0;
                return;
            }else{
                step--;
            }
            galDrag.setStep(step);
        });
}
	};

	function hideModelsIfOpen(evt) {
		if(isOpened){
			jsDom.css(modelArea, {"display":"none"});
            if(!isMobile)
            {
            jsDom.css(leftArrow, {"display":"none"});
            jsDom.css(rightArrow, {"display":"none"});
           }
            EventListener.dispatch("GALLERY_CLOSED", this);
            isOpened = false;
		}
	};

	// auto intiate //
	this.initPlugin();
};