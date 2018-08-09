var ImageButton = function(name, imagePath){
	
	ImageButton.prototype.makeButton = function(name, imagePath) {
		if(name==null || name == ""){
			return;
		}
		if(name=="browse"){
			this.makeBrowseButton(imagePath);
		}else{
			this.makeSimpleButton(name, imagePath);
		}

	};

	ImageButton.prototype.makeBrowseButton = function(imagePath) {
		var strBrowseButton = '<label style="display:block; overflow:hidden; cursor:pointer"><input type="file" class="file" /></label>';
		
	};

	ImageButton.prototype.makeSimpleButton = function(name, imagePath) {
		// here will return the simple button string;
	};


};