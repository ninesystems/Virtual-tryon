// Used to save the View to desktop or at server //
var SaveView = function(myWorkArea){
	var previewArea = myWorkArea;
	var settings = settings_tryon;
	var _saveRef = this;
	
	SaveView.prototype.initPlugin = function() {
		EventListener.addEventListener("SAVE_PREVIEW", this.savetheImage);
	};

	SaveView.prototype.savetheImage = function(evt) {
		
	};
	// auto intiate //
	this.initPlugin();
};