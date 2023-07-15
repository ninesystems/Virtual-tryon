export default function CacheImage(){
	var _cache = this;
	var settings = settings_tryon;
	var isBrowserStorage = window.localStorage!==undefined?true:false;
	var storageName = "TryonStore";
	var frameData = "frameData";
	var objData = {};
	
	// Saving the image here//
	CacheImage.prototype.saveImage = function(imageData) {
		if(imageData.length>2){
			_cache.saveUserImage(imageData);
		}else{
			_cache.saveModelused(imageData);
		};
	};

	CacheImage.prototype.saveUserImage = function(imageData){
			objData = {};
			objData.model = "";
			objData.image = imageData;
			objData.lastused = "image";
            objData.frame = "";
            objData.user = "";
			save(objData);
	};
	CacheImage.prototype.lastUsed = function(lastUsedType){
			objData = {};
			objData.lastUsed = lastUsedType;
            save(objData);
	};

	CacheImage.prototype.saveModelused = function(modelNumber) {
		objData = {};
		objData.model = modelNumber;
		objData.image = "";
		objData.lastused = "model";
        objData.frame = "";
        objData.user = "";
		save(objData);
	};

	CacheImage.prototype.getImage = function(callback) {
		if(!callback){
			throw "Try to retrive image without callback! not possible";
			return;
		}
		fetch(callback);
	};

	CacheImage.prototype.saveFrameData = function(strFrameData, strUserImageData) {
		var objData = {};
        objData.model = "";
        objData.image = "";
		objData.frame = strFrameData;
		
		objData.user = strUserImageData;
		objData.lastused = "";
		save(objData);

	};
	
	
	var fetch = function(callback){
		if(isBrowserStorage){
			var objTryonData = localStorage.getItem(storageName);
			//if getting null then will transport null
			var objData = JSON.parse(objTryonData);
			callback(objData);
		}else{
			var storageDevice = jsDom.nodeById("storagedevice");
            // TODO: Need to Fetch data from storage device i.e. flash cookie
		}
	};

	var save = function(objTryonData){
		if(isBrowserStorage){
			var tryonData = JSON.parse(localStorage.getItem(storageName));
			
			if(tryonData){
				objTryonData.model = objTryonData.model===""?tryonData.model:objTryonData.model;
				objTryonData.image = objTryonData.image===""?tryonData.image:objTryonData.image;
				objTryonData.frame = objTryonData.frame===""?tryonData.frame:objTryonData.frame;
				objTryonData.user = objTryonData.user===""?tryonData.user:objTryonData.user;
				objTryonData.lastused = objTryonData.lastused===""?tryonData.lastused:objTryonData.lastused;
			
			}
			localStorage.setItem(storageName, JSON.stringify(objTryonData));
		}
	};
};