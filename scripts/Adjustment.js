const jsDom = require('./libs/jsDom').default;
const Dragdealer = require('./libs/dragdealer');
export default function Adjustment(myWorkArea){
	var barElement = myWorkArea;
	var settings = settings_tryon;
	var _adjustmentRef = this;
	var adjustmentView = null;
	var sliderNames = ["userImageScale", "userImageRotate", "spacer"];
	var sliders = [];
	var isSmall=false;
	
	function initPlugin() {
			EventListener.addEventListener("ADJUSTMENT_STARTED", setupLayout);	
			EventListener.addEventListener("ALL_DONE", destroyAdjustment);
			EventListener.addEventListener("CHECK_FOR_MOBILE", smallScreenAdjust);
			EventListener.addEventListener("MULTI_DESTROY", removeAdjustmnet);
	};
	function setupLayout(evt){
		EventListener.dispatch("HIDE_RESIZER",this);
		makeSmallerPanel();
	};
	function makeLargePanel(position) {
		isSmall=false;
		adjustmentView = jsDom.createNode("div", {"id":"tryon_adjustment","class":"adjustment", "style":"position:relative;border:1px solid #d3d3d3; display:none;background:#fff; opacity:0.98;width:"+settings.adjustmentPanelWidth+"px;height:"+settings.adjustmentPanelHeight+"px;"}, "", "parent", previewArea);
		var location = position=="right"?1:-1;
		jsDom.css(adjustmentView, {"display":"block", "left":location*settings.panelwidth+"px", "z-index":"10"});

		// View Ready Now add some components //
		for(var k=0; k<sliderNames.length; k++){
			var marginTop = settings.adjustmentPanelHeight/(sliderNames.length * 2);
			if(k==0){
				marginTop = ((settings.adjustmentPanelHeight/(sliderNames.length))-10);
			}
			if(sliderNames[k]=="spacer"){
				var hr = jsDom.createNode("div", {"id":sliderNames[k]}, "", "parent", adjustmentView);
				jsDom.css(hr, {"width":(settings.adjustmentPanelWidth-20)+"px","position":"relative","left":"10px", "right":"10px","marginTop":marginTop+"px","height":"25px", "borderTop":"1px solid "+settings.panelbordercolor});
			}else{
				var LabelSlider = '<span style="margin-top:-30px;font-size:10px;font-family:Arial;color:'+settings.fontcolor+';float:left;">'+settings[sliderNames[k]]+'</span>';
				var slider = jsDom.createNode("div", {"id":"main"+sliderNames[k]}, LabelSlider, "parent", adjustmentView);
				jsDom.css(slider, {"position":"relative", "height":"25px", "marginTop":marginTop+"px", "left":"40px", "right":"40px", "width":(settings.adjustmentPanelWidth-80)+"px"});
				createSlider(sliderNames[k], slider);
				var dragSlider = new Dragdealer(sliderNames[k], {
					x:0.5,
					animationCallback: function(x, y){
						if(typeof eval(this.wrapper.id === "function")){
							eval(this.wrapper.id)(Math.round(x * 100));
						}
					}
				});
				sliders.push(dragSlider);
			}
		}

	};
	function smallScreenAdjust() {
		if(isSmall){
			var okbtn = jsDom.nodeById("tryonok_button");
			if(okbtn){
			    jsDom.css(okbtn,{"position":"absolute","left":"190px","overflow":"visible","margin-left":"0px","z-index":"9999"});
			}
		}

	};
	function createSlider(strId, elem) {
		var slider = jsDom.createNode("div", {"id":strId, "margin-top":"15px"}, "", "parent", elem);
		jsDom.css(slider, {"position":"relative", "height":"1px", "background":settings.panelbordercolor});
		var thumb = jsDom.createNode("div", {"class":"handle"}, "", "parent", slider);
		jsDom.css(thumb, {"position":"absolute", "top":"-13px", "left":"0px", "cursor":"pointer","width":"25px", "height":"25px", "background":settings.chromeColor, "border":"1px solid "+settings.panelbordercolor, "borderRadius":"25px"});
	};
	function createsmallSlider(strId, elem) {
		var slider = jsDom.createNode("div", {"id":strId, "margin-top":"15px"}, "", "parent", elem);
		jsDom.css(slider, {"position":"relative", "height":"1px","width":144+"px","top":"10px","background":settings.panelbordercolor});
		var thumb = jsDom.createNode("div", {"class":"handle"}, "", "parent", slider);
		jsDom.css(thumb, {"position":"absolute", "top":"-13px", "left":"0px", "cursor":"pointer","width":"25px", "height":"25px", "background":settings.chromeColor, "border":"1px solid "+settings.panelbordercolor, "borderRadius":"25px"});
	};

	function makeSmallerPanel(){
		isSmall=true;
		
		var adArea= jsDom.createNode("div", {"id":"smalladjust", "class":"dragdealer","style":"overflow:hidden;"}, "", "parent", barElement,true);
		jsDom.css(adArea, {"width":settings.panelwidth+"px","height":settings.panelheight+"px","bottom":"0px","float":"left", "background":settings.panelcolor+""});
		//var adArea=jsDom.nodeById("adjustArea");
		
		
		adjustmentView = jsDom.createNode("div", {"id":"tryon_adjustment", "class":"handle","style":"opacity:0.98;"}, "", "parent", adArea);
		jsDom.css(adjustmentView, {"display":"block","margin-top":"20px","width":"400%","list-style-type":"none","height":"100%","margin-left":"10px","float":"left", "z-index":"10"});
		for(var k=0; k<sliderNames.length; k++){
			var marginTop = settings.adjustmentPanelHeight/(sliderNames.length * 2);
			if(sliderNames[k]!="spacer"){
				var LabelSlider = '<span style="font-size:12px;margin-top:15px;font-weight:bold;position:relative;bottom:30px;font-family:Arial;color:'+settings.fontcolor+';float:left;">'+settings[sliderNames[k]]+'</span>';
				var slider = jsDom.createNode("div", {"id":"main"+sliderNames[k],"class":"slide"}, LabelSlider, "parent", adjustmentView);
				jsDom.css(slider, {"float":"left","position":"relative","width":"25%"});
				createsmallSlider(sliderNames[k], slider);

				var dragSlider = new Dragdealer(sliderNames[k], {
					x:0.5,
					animationCallback: function(x, y){
						if(typeof eval(this.wrapper.id === "function")){
							eval(this.wrapper.id)(Math.round(x * 100));
						}
					}
				});
				sliders.push(dragSlider);
			}
		}
		var dragAdjust = new Dragdealer('smalladjust', {
		  steps: 4,
		  speed: 0.3,
		  loose: false,
		  requestAnimationFrame: false
		});
	};


	function userImageScale(scale){
        scale += 50;
		EventListener.dispatch("SCALING", this,scale);
	};

	function userImageRotate(scale){
		scale = (scale-50) * 3.6;
		EventListener.dispatch("ROTATE", this,scale);
	};

	function frameScale(scale){
		scale += 20;
		EventListener.dispatch("FRAME_SCALING", this, 3*scale);
	};

	function frameRotate(scale){
		scale = (scale-50) * 3.6;
		EventListener.dispatch("FRAME_ROTATE", this,scale);
	};

	function destroyAdjustment() {
		jsDom.remove(jsDom.nodeById("tryon_adjustment"));
		EventListener.dispatch("ADJUSTMENT_COMPLETE", this);
		var adpanel=jsDom.nodeById('smalladjust');
		if(adpanel){
			jsDom.remove(adpanel);
		}
		//Next line is only for demo//
         EventListener.dispatch("APPLY_FRAME",this,settings_tryon.currentFrame,settings_tryon.tryonActive,"1/5");
	};
	function removeAdjustmnet(){
		EventListener.removeEventListener("ADJUSTMENT_STARTED", setupLayout);
		EventListener.removeEventListener("MULTI_DESTROY", removeAdjustmnet);
	/*	EventListener.removeEventListener("ALL_DONE", destroyAdjustment);
		EventListener.removeEventListener("CHECK_FOR_MOBILE", smallScreenAdjust);*/
		
	}
	function getoffset(el){
		var _x = 0;
	    var _y = 0;
	    while( el && !isNaN( el.offsetLeft ) && !isNaN(el.offsetTop)) {
	        _x += el.offsetLeft - el.scrollLeft;
	        _y += el.offsetTop - el.scrollTop;
	        el = el.offsetParent;
	    }
	    return { "top":_y, "left":_x };
	};
	// auto initiate //
	initPlugin();
};