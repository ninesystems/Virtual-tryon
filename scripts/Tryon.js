var Tryon = function (){
	var settings = settings_tryon;
	var tryonpreview=null;
	var adj =  null;
	var resizer =null;
	var tryonbar = null;
	var activeElem = null;

	// var tryonpreview =null;
	Tryon.prototype.initApp = function(elem,bar){
		setupLayout(elem,bar);
		var alter=new Alternater(elem);
	};

	function setupLayout(elem,bar) {
		activeElem=elem;
		var elements = jsDom.nodeById(elem);
		var key=0;
			var elem  = elements;
			jsDom.css(elem, {"position":"relative"});
			if(settings.debug=="true"){
				jsDom.css(elem, {"border":"1px dashed #f00"});
			}
			tryonpreview = new TryonPreview(elem, key);
			// init plugin with main view.
			adj = new Adjustment(bar, key);
			if(settings.isPanel===true)
			{
			resizer = new Resizer(elem, key);
			}
			//making all instance of tryon-bars as per our css props//
			barElement = jsDom.nodeById(bar);
			bars = barElement;
			/*jsDom.css(bars, {"position":"relative"});
			if(settings.debug=="true"){
				jsDom.css(bars, {"border":"1px dashed #090"});
			}*/
			tryonbar = new TryonBar(bars);
		// Adding filters for using in mozilla //
		var strSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><filter id="contrast"><feGaussianBlur stdDeviation="1.5"/><feComponentTransfer><feFuncR type="discrete" tableValues="0 .5 1 1"/><feFuncG type="discrete" tableValues="0 .5 1"/><feFuncB type="discrete" tableValues="0"/></feComponentTransfer></filter><filter id="brightness"><feComponentTransfer><feFuncR type="linear" slope="4"/><feFuncG type="linear" slope="4"/><feFuncB type="linear" slope="4"/></feComponentTransfer></filter></defs> </svg>';
		var tryonFilters = jsDom.createNode("div", {"id":"tryon_filters"}, strSVG, "parent", document.body);

	};

	/**
	*	Destroy a particular Tryon..
	**/
	Tryon.prototype.destroyByID = function(elemID) {
		var elem = document.getElementById(elemID);
		elem.innerHTML = "";
	};

    /**
	*	Destroy a All Tryon..
	**/
	Tryon.prototype.destroyAll = function() {
		var elements = jsDom.nodeByClass("softsol-tryon");
		for (var i = elements.length - 1; i >= 0; i--) {
			elements[i].innerHTML = "";
		}
		var barElement=jsDom.nodeByClass("softsol-tryon-bar");
		for (var i = barElement.length - 1; i >= 0; i--) {
			barElement[i].innerHTML = "";
		}
		var adjust=jsDom.nodeByClass('adjustment');
		if(adjust){
		for (var i = adjust.length - 1; i >= 0; i--) {
			jsDom.remove(adjust[i]);
		};
		tryonpreview=null;
		adj =  null;
		resizer =null;
		tryonbar = null;
		activeElem = null;
		EventListener.destroyEventListener();
		}
		var filters = jsDom.nodeById("tryon_filters");
		jsDom.remove(filters);
	};
};

function flashNotify(strData) {
    switch (strData){
        case "error":
            EventListener.dispatch("noCamFound", this);
        break;
        case "webcamLoadComplete":
            // means flash loaded and got the camera
        break;
        case "webcamLive":
            EventListener.dispatch("WEBCAM_READY", this);
        break;
        case "webcamDenied":
            EventListener.dispatch("FLASH_CAM_DENIED", this);
            EventListener.dispatch("cameraPermissionDenied", this);
        break;
    }
}

function getBitmap(data_uri, ext){
	EventListener.dispatch("FILE_LOAD_COMPLETE", this, data_uri, ext);
    EventListener.dispatch("ADJUSTMENT_STARTED", this);
}

function LoadingStart(){
	EventListener.dispatch("FILE_LOADING_INIT", this);
}
function IOError(){
	alert("error in loading");
}

String.prototype.toDOM=function(){
  var d=document
     ,i
     ,a=d.createElement("div")
     ,b=d.createDocumentFragment();
  a.innerHTML=this;
  while(i=a.firstChild){b.appendChild(i)};
  return b;
};

export default Tryon;