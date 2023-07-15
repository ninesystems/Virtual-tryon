const jsDom = require('./libs/jsDom').default;
const TryonPreview = require("./TryonPreview").default;
const Adjustment = require("./Adjustment").default;
const Resizer = require("./Resizer").default;
const TryonBar = require("./TryonBar").default;

const Tryon = {
	settings:null,
	tryonpreview:null,
	adj:null,
	resizer:null,
	tryonbar:null,
	activeElem:null,

	initApp:function (elem, bar) {
		this.settings = window.settings_tryon;
		this.setupLayout(elem, bar);
	},
	setupLayout:function(elem, bar) {
		this.activeElem = elem;
		var elements = jsDom.nodeById(elem);
		var key = 0;
		var elem = elements;
		jsDom.css(elem, { "position": "relative" });
		if (this.settings.debug == "true") {
			jsDom.css(elem, { "border": "1px dashed #f00" });
		}
		this.tryonpreview = new TryonPreview(elem, key);
		// init plugin with main view.
		this.adj = new Adjustment(bar, key);
		if (this.settings.isPanel === true) {
			this.resizer = new Resizer(elem, key);
		}
		//making all instance of tryon-bars as per our css props//
		const barElement = jsDom.nodeById(bar);
		const bars = barElement;
		this.tryonbar = new TryonBar(bars);
		// Adding filters for using in mozilla //
		var strSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><filter id="contrast"><feGaussianBlur stdDeviation="1.5"/><feComponentTransfer><feFuncR type="discrete" tableValues="0 .5 1 1"/><feFuncG type="discrete" tableValues="0 .5 1"/><feFuncB type="discrete" tableValues="0"/></feComponentTransfer></filter><filter id="brightness"><feComponentTransfer><feFuncR type="linear" slope="4"/><feFuncG type="linear" slope="4"/><feFuncB type="linear" slope="4"/></feComponentTransfer></filter></defs> </svg>';
		var tryonFilters = jsDom.createNode("div", { "id": "tryon_filters" }, strSVG, "parent", document.body);

	},

	/**
	*	Destroy a particular Tryon..
	**/
	destroyByID:function (elemID) {
		var elem = document.getElementById(elemID);
		elem.innerHTML = "";
	},

	/**
	*	Destroy a All Tryon..
	**/
	destroyAll:function () {
		var elements = jsDom.nodeByClass("softsol-tryon");
		for (var i = elements.length - 1; i >= 0; i--) {
			elements[i].innerHTML = "";
		}
		const barElement = jsDom.nodeByClass("softsol-tryon-bar");
		for (var i = barElement.length - 1; i >= 0; i--) {
			barElement[i].innerHTML = "";
		}
		var adjust = jsDom.nodeByClass('adjustment');
		if (adjust) {
			for (var i = adjust.length - 1; i >= 0; i--) {
				jsDom.remove(adjust[i]);
			};
			this.tryonpreview = null;
			this.adj = null;
			this.resizer = null;
			this.tryonbar = null;
			this.activeElem = null;
			EventListener.destroyEventListener();
		}
		var filters = jsDom.nodeById("tryon_filters");
		jsDom.remove(filters);
	},
};
/*
function getBitmap(data_uri, ext) {
	EventListener.dispatch("FILE_LOAD_COMPLETE", this, data_uri, ext);
	EventListener.dispatch("ADJUSTMENT_STARTED", this);
}

function LoadingStart() {
	EventListener.dispatch("FILE_LOADING_INIT", this);
}
function IOError() {
	alert("error in loading");
}
*/
String.prototype.toDOM = function () {
	var d = document
		, i
		, a = d.createElement("div")
		, b = d.createDocumentFragment();
	a.innerHTML = this;
	while (i = a.firstChild) { b.appendChild(i) };
	return b;
};
export default Tryon;