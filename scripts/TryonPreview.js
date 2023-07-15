const CacheImage = require('./CacheImage').default;
const jsDom = require('./libs/jsDom').default;
const Tools = require('./libs/Tools').default;
const dragObject = require('./DragClass').default;
const WebcamToImage = require('./WebcamToImage').default;


function TryonPreview(myWorkArea) {
	let previewArea = myWorkArea;
	let settings = settings_tryon;
	let _previewRef = this;
	let mainArea = null;
	let webcam = null;
	let cacheImg = new CacheImage();
	let previewImage = null;
	let dragleft = null;
	let dragright = null;
	let frameImage = null;
	let _scaleFactor = 100;
	let _rotation = 0;
	let _frameScaleFactor = 100;
	let _frameRotation = 0;
	let dragImage = null;
	let dragFrame = null;
	let leftImage = null;
	let rightImage = null;
	let isUserImage = false;
	let isModel = false;
	let frameData = "";
	let userImageData = "";
	let cachedImage = false;
	let cachedData = null;
	let _isMirror = false;
	let finalFrame = null;
	let _modelNumber = 0;
	let userImg = null;
	let framemirror = '';
	let cacheframe = " ";
	let isframe = true;
	let rect = "";
	let istrack = true;



	TryonPreview.prototype.setupLayout = function () {

		mainArea = jsDom.createNode("div", { "id": "mainArea" }, "", "parent", previewArea);
		jsDom.css(previewArea, { "width": settings.width + "px", "height": settings.height + "px" });
		jsDom.css(mainArea, { "overflow": "hidden", "position": "absolute", "width": settings.width + "px", "height": settings.height + "px" });
		/*showing preloader for better appearance*/
		showPreloader();

		/*adding listener from different views*/
		EventListener.addEventListener("FILE_LOAD_COMPLETE", loadFileFromURL);
		EventListener.addEventListener("FILE_LOADING_INIT", loadingInit);
		EventListener.addEventListener("MODEL_CHOOSEN", loadImageFromURL);
		EventListener.addEventListener("WEBCAM_OPEN", openCam);
		EventListener.addEventListener("ASK_FOR_CONFIRM", pictureTaken);
		EventListener.addEventListener("RESET_VIEW_DEFAULT", resetViewtoDefault);
		EventListener.addEventListener("WEBCAM_CLOSE", resetViewtoDefault);
		EventListener.addEventListener("WEBCAM_RETAKE", openCam);
		EventListener.addEventListener("ADJUSTMENT_STARTED", adjustmentStarted);
		EventListener.addEventListener("ALL_DONE", startCalculations);

		/*Adding Events for adjustments*/
		EventListener.addEventListener("SCALING", scaleUserImage);
		EventListener.addEventListener("ROTATE", rotateUserImage);
		EventListener.addEventListener("FRAME_SCALING", scaleFrameImage);
		EventListener.addEventListener("FRAME_ROTATE", rotateFrameImage);
		EventListener.addEventListener("APPLY_FRAME", applyFrame);
		EventListener.addEventListener("SCALE_UP", scaleFrameUp);
		EventListener.addEventListener("SCALE_DOWN", scaleFrameDown);
		EventListener.addEventListener("FRAME_ROTATE_LEFT", frameRotateLeft);
		EventListener.addEventListener("FRAME_ROTATE_RIGHT", frameRotateRight);
		EventListener.addEventListener("FRAME_RESET", frameReset);
		EventListener.addEventListener("FRAME_WITH_RESIZER", showWithOldResizer);

		/* getting image from cache */
		cachedData = null;
		cacheImg.getImage(loadImageFromData);


		/* Adding listener if user wants to  the gallery */
		mainArea.addEventListener("click", previewClicked);
		mainArea.addEventListener("touchstart", previewClicked);
	};

	function openCam(evt) {
		jsDom.clearNode(mainArea);
		showPreloader();
		if (webcam != null) {
			webcam.setupCam();
		} else {
			webcam = new WebcamToImage(mainArea);
		}
	};
	function resetViewtoDefault(evt) {
		cacheImg.getImage(loadImageFromData);
	};
	function loadingInit(evt) {
		showPreloader();
	};
	function loadFileFromURL(evt, file, ext) {

		showPreloader();
		if (window.File && window.FileReader && window.FileList && window.Blob) {
			var reader = new FileReader();
			reader.onload = imageLoaded;

			reader.readAsDataURL(file[0]);
			isUserImage = true;
			//EventListener.dispatch("ADJUSTMENT_STARTED",this);
		} else {
			var data = 'data:image/' + ext + ';base64,' + file;
			loadImageFromData(data);
			cacheImage(data);
		}
		if (userImg !== null) {
			jsDom.remove(userImg);
		}
	};
	function imageLoaded(e2) {
		loadImageFromData(e2.target.result);
		cacheImage(e2.target.result);
	};

	function imageLoadingCompelte() {

		jsDom.hide(jsDom.nodeById("imageprelaoder"));
		var w = this.naturalWidth;
		var h = this.naturalHeight;
		var tw = jsDom.getStyle(previewArea, "width", true);
		var th = jsDom.getStyle(previewArea, "height", true);

		var resVal = scaleToFit(w, h, tw, th, false);
		if (resVal) {

			previewImage.width = resVal.width;
			previewImage.height = resVal.height;
			jsDom.css(previewImage, { "left": resVal.targetleft + "px" });
			jsDom.css(previewImage, { "top": resVal.targettop + "px" });
			jsDom.css(previewImage, { "display": "block" });

			EventListener.dispatch("APPLY_FRAME", this, settings_tryon.currentFrame, settings_tryon.tryonActive, "1/5")

			if (cachedImage) {

				jsDom.css(previewImage, { "cssText": cachedData.user });
				frameData = cachedData.frame;
				EventListener.dispatch("APPLY_FRAME", this, settings_tryon.currentFrame, settings_tryon.tryonActive, "1/5");
			}

			if (isUserImage) {

				EventListener.dispatch("ADJUSTMENT_STARTED", _previewRef);
				isUserImage = false;
				return;
			}

		}

	};
	function cacheImage(strImageData) {
		cachedImage = false;
		cacheImg.saveImage(strImageData);
	};
	// load data from storage if not then load the default model //
	function loadImageFromData(objImageData) {


		if (objImageData) {
			var imgToLoad = "";

			if (objImageData.hasOwnProperty("lastused")) {
				if (objImageData.lastused !== "image") {
					cachedImage = false;
					const modelToload = objImageData[objImageData.lastused];
					var arrModels = settings.modelsimages.split(",");
					imgToLoad = arrModels[modelToload];

					_modelNumber = parseInt(objImageData[objImageData.lastused]);
					if (objImageData["image"] !== "") {
						makeThumb(objImageData);
					}
					isModel = true;
					finalFrame = null;

				} else {

					cachedImage = true;
					cachedData = objImageData;

					imgToLoad = objImageData[objImageData.lastused];

					isModel = false;

				}
			} else {

				cachedImage = false;
				imgToLoad = objImageData;

				isModel = false;
			}
			jsDom.clearNode(mainArea);

			showPreloader();

			var img = new Image();
			img.onload = function () {
				var strImageData = Tools.reduceImage(img, 0.6);
				var modelpic = jsDom.nodeById("previewImage");
				jsDom.setAttr(modelpic, { "src": strImageData });
			}
			img.crossOrigin = "Anonymous";
			img.src = imgToLoad;


			previewImage = jsDom.createNode("img", { "id": "previewImage", "src": imgToLoad, "style": "position:absolute;display:none;" }, "", "parent", mainArea);

			previewImage.onload = imageLoadingCompelte;




		} else {

			loadModelByNumber(null);
			isModel = true;
			finalFrame = null;
		}

	};
	// load model by number, if not then load the default model from settings
	function loadModelByNumber(modelNumber) {
		// loading the default model //
		if (!modelNumber) {
			modelNumber = settings.defaultmodel;
		}
		var arrImages = settings.modelsimages.split(",");
		var defaultModelURL = arrImages[parseInt(modelNumber)];
		_modelNumber = modelNumber;
		loadImageFromData(defaultModelURL);
		cacheImage(_modelNumber);
	};

	function loadImageFromURL(evt, strURL) {
		showPreloader();
		loadImageFromData(strURL);
		var arrImages = settings.modelsimages.split(",");
		var modelNumber = 0;
		for (var i = 0; i < arrImages.length; i++) {
			var tempImageName = arrImages[i].split("/");
			var imageName = tempImageName[tempImageName.length - 1];
			if (strURL.indexOf(imageName) > -1) {
				isModel = true;
				_modelNumber = modelNumber = i;
				break;
			}
		}
		cacheImg.getImage(makeThumb);
		cacheImg.saveImage(modelNumber);
	};

	function showPreloader() {
		var preloaderElem = jsDom.createNode("div", { "id": "imageprelaoder", "style": "font-family:Arial;position:absolute;font-size:12px;color:" + settings.fontcolor + ";text-align:center;line-height:" + (parseInt(settings.height) + parseInt(settings.panelheight)) + "px;width:100%;height:100%;background:url('" + settings.preloader + "') no-repeat 50% 50%;" }, settings.loadingmsg, "parent", mainArea);
	};

	function previewClicked(evt) {
		EventListener.dispatch("AREA_CLICKED", this);
	};

	function pictureTaken(evt, imgData, objParam) {
		isModel = false;
		isframe = false;
		jsDom.clearNode(mainArea);
		previewImage = jsDom.createNode("img", { "id": "previewImage", "src": imgData, "style": "position:absolute;display:none;text-align:center;" }, "", "parent", mainArea);
		if (objParam) {
			if (objParam.enhancelight) {
				enhanceLight(previewImage, true);
			}

		}
		showPreloader();
		previewImage.onload = imageLoadingCompelte;


		cacheImage(imgData);
		isUserImage = false;
	};
	function scaleToFit(srcwidth, srcheight, targetwidth, targetheight, fLetterBox) {
		var result = { width: 0, height: 0, fScaleToTargetWidth: true };
		if ((srcwidth <= 0) || (srcheight <= 0) || (targetwidth <= 0) || (targetheight <= 0)) {
			return result;
		}
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

	function swapMirror(elem, isMirror) {
		if (isMirror) {
			_isMirror = isMirror;
			//jsDom.css(elem, {"transform":"rotateY(180deg)", "-webkit-transform":"rotateY(180deg);", "-moz-transform":"rotateY(180deg)"});

		}
	};

	function enhanceLight(elem, isLowLight) {
		if (isLowLight) {
			jsDom.css(elem, { "filter": "url(#brightness)", "-webkit-filter": " brightness(150%)" });
		}
	};

	function adjustmentStarted(evt) {
		if (istrack == false) {
			leftImage = jsDom.createNode("img", { "id": "dummy_left", "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABf0lEQVQ4jZWSP0hCURTGf0dCCISEWiwCI9AoxE1wCF8uIkQtRVttzba4NNTSXGM2tvUHtAhCif5MgdAQb7GGRCRqiCgSBJfT4POBPnrVB5fL4XznO+fe84ELVDWhqgk3Tp9bEjCs++YXXlfXqKrm1Ym8qkZ7+dJTPE/V3OHywKR8/tLFjKUDJJcijEUyInLiEFDVKG/Px6zPXbqOuHWaZGhkQUTuATx2otXMsZst2/FkfJDRCZ9DYDdbptXMdUKP1T3Bk+mnXmnYxMW1OMmlsEOgXmnwZPo72+lMYPD+2nCQf0KbawD0qeqVFdz9WaCNTVU1PCIyA2T+WQyQEZGZjpEKBKeyDkpkOsTGYQCAu4tHzvYeAQhOBYACWE4UkZqqloilA/b+j7Zv8fm9tthL9Qto+2F4vCQiNej2wQCtZpHiftPu1IvZ1RCp5X68/SkR+ewSsEVgh6ppUC4+0PhoAeDze4mlwoxFrq23f7r+jqquWN6vWievqiuuRS5CroXfPpC2JqI4riYAAAAASUVORK5CYII=" }, " ", "parent", mainArea);
			jsDom.css(leftImage, { "left": "40px", "position": "absolute", "top": "70px" });

			rightImage = jsDom.createNode("img", { "id": "dummy_right", "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABzUlEQVQ4jYWTT0hUURTGf2ewseTJWCj0lMEx+/MgxsFFkkQos2uRFQQuZ/qzyIWgmzZBkOTGAoW2EbQKoXBqE21MNxkPImIIH1KWDFmRmTGPIjenxbwm7zx5Hrib833nO9+5516ICFXNqWouilMXBQKpHfBtu2ZUdUbDMaOqmVq+1BSf4UNxitnpIu7Tzwaz55RNdjBNR3pERB6HBFQ1w9qnh1wbmI20OP4kS3PbeRF5Ywr8+fWSicvvKXk+ScciO3ikWrTorlYdJR2Lq3c7pb7hOEAs6N7HcrGJkucDYHc04hxrp7S0BsClm6dJOhYAJc9nudikqn0AseBi8qx/8UN2/Y1NFt3VUL7Czatqpg7IA/3Ad4O0a3c9JwYOc6ArxfTtZ1V3/6Mf2IiJyCgwxb79lgGX18tMDs3z9sUSJ8+lDSx11AZGRGQ0FqTmaDvUalj/ulJx9GDiFVBZI0CiJU5rZwMwB+Yan+O5NpND86GZt8aVW710Zx+JyI1agQRQwHNt7l1f4Oe3TaMw0RLn4lgvTs+CiFz4lzZeYiCUo/zjDu9ef+S3XxHZY8U52J2ice+wiNzfyg8JBCLtwNngABSAgoisRI63nZudvvNfuvW/5I2aJFYAAAAASUVORK5CYII=" }, " ", "parent", mainArea);
			jsDom.css(rightImage, { "left": "145px", "position": "absolute", "top": "70px" });

			dragImage = new dragObject("previewImage");
			//dragFrame = new dragObject("dummy_frame");
			dragleft = new dragObject("dummy_left");
			dragright = new dragObject("dummy_right");
			if (isframe) {

				jsDom.remove(finalFrame);
				isframe = false;

			}
		}
		if (isframe) {

			jsDom.remove(finalFrame);
			isframe = false;

		}
		dragImage = new dragObject("previewImage");


	};
	function scaleUserImage(evt, scalefactor) {

		_scaleFactor = scalefactor;
		setTransform(previewImage, _rotation, scalefactor);
	};

	function rotateUserImage(evt, rotation) {
		_rotation = rotation;
		setTransform(previewImage, rotation, _scaleFactor);
	};

	function scaleFrameImage(evt, frameScalefactor) {
		_frameScaleFactor = frameScalefactor;
		setTransform(frameImage, _frameRotation, frameScalefactor);
	};

	function rotateFrameImage(evt, rotation) {
		_frameRotation = rotation;
		setTransform(frameImage, rotation, _frameScaleFactor);
	};

	function setTransform(elem, fRotation, fScale) {
		var mirrorMode = "0";
		if (_isMirror) {
			//mirrorMode = "180"; old
			mirrorMode = "0";
		}
		jsDom.css(elem, { "-ms-transform": "rotate(" + fRotation + "deg) scale(" + fScale / 100 + ", " + fScale / 100 + ") rotateY(" + mirrorMode + "deg)", "-webkit-transform": "rotate(" + fRotation + "deg) scale(" + fScale / 100 + ", " + fScale / 100 + ") rotateY(" + mirrorMode + "deg)", "transform": "rotate(" + fRotation + "deg) scale(" + fScale / 100 + ", " + fScale / 100 + ") rotateY(" + mirrorMode + "deg)" });
	};
	function getTransformData(container, cb) {
		var scale = 1;
		var fRotation = 0;
		var st = window.getComputedStyle(container, null);
		var tr = st.getPropertyValue("-webkit-transform") ||
			st.getPropertyValue("-moz-transform") ||
			st.getPropertyValue("-ms-transform") ||
			st.getPropertyValue("-o-transform") ||
			st.getPropertyValue("transform") ||
			"FAIL";
		if (tr != 'none') {
			console.log(tr);
			var values = tr.split('(')[1].split(')')[0].split(',');
			var a = values[0];
			var b = values[1];
			var c = values[2];
			var d = values[3];
			scale = Math.sqrt(a * a + b * b);
			var fScale = scale * 100;
			var sin = b / scale;
			var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
			fRotation = angle;

		}
		cb(scale, fRotation);
	};


	function startCalculations() {

		// Calculate the frame width height left top & Save the width, height, left, top of the frame and in the cache//
		if (istrack == false) {
			calculateDimensions();
			destroyAdditional();
		}
		else {
			var data = '';

			var mainimage = jsDom.nodeById("previewImage");
			var canvaswidth = mainimage.width;
			var canvasheight = mainimage.height;
			var canvas = document.createElement('canvas');
			canvas.width = canvaswidth;
			canvas.height = canvasheight;

			var scalefactor = mainimage.naturalHeight / mainimage.height;
			var ctx = canvas.getContext("2d");
			getTransformData(mainimage, function (scale, fRotation) {
				ctx.save();
				ctx.translate(mainimage.width / 2, mainimage.height / 2);
				ctx.rotate(fRotation * Math.PI / 180);
				ctx.scale(scale, scale);
				ctx.drawImage(mainimage, -mainimage.width / 2, -mainimage.height / 2, mainimage.width, mainimage.height);

				data = canvas.toDataURL('image/png');
				var trackimage = new Image();
				trackimage.src = data;
				trackimage.id = "trackingImage";
				trackimage.style.display = "none";
				trackimage.width = canvaswidth;
				trackimage.height = canvasheight;
				jsDom.nodeById('mainArea').appendChild(trackimage);

				trackimage.onload = function () {

					var tracker = new tracking.ObjectTracker(['eye']);
					tracker.setStepSize(1.7);
					tracking.track('#trackingImage', tracker);
					tracker.on('track', function (event) {

						if (event.data.length == 0) {
							istrack = false;
							EventListener.dispatch("ADJUSTMENT_STARTED", this);
						}

						event.data.forEach(function (rect) {
							window.plot(rect.x, rect.y, rect.width, rect.height);
						});
					});
					var i = 0;
					window.plot = function (x, y, w, h) {
						rect = document.createElement('div');
						document.getElementById('mainArea').appendChild(rect);
						if (rect.style)
							rect.id = 'rect' + i;
						rect.style.width = w + 'px';
						rect.style.height = h + 'px';
						rect.style.left = (previewImage.offsetLeft + x) + 'px';
						rect.style.top = (previewImage.offsetTop + y) + 'px';
						rect.style.position = "absolute";
						i++;
						if (i == 2) {
							calculateDimensions();
						}

					};
				};


			})

		}



		// destroy the adjustment functionalists added to the preview area//

	};

	function calculateDimensions() {
		if (istrack == false) {
			var obj = {};
			obj.Lleft = leftImage.style.left.split("px").join('');
			obj.Ltop = leftImage.style.top.split("px").join('');
			obj.Rleft = rightImage.style.left.split("px").join('');
			obj.Rtop = rightImage.style.top.split("px").join('');

			frameData = obj;
			userImageData = previewImage.style.cssText;
			cacheImg.saveFrameData(frameData, userImageData);


		}
		else {
			let eyeleft = jsDom.nodeById('rect0');
			let eyeright = jsDom.nodeById('rect1');
			let obj = {};

			if (parseInt(eyeleft.style.left.split("px").join('')) < parseInt(eyeright.style.left.split("px").join(''))) {
				obj.Lleft = parseInt(parseInt(eyeleft.style.left.split("px").join('')) + parseInt(eyeleft.style.width.split('px').join('')) / 2);
				obj.Ltop = parseInt(parseInt(eyeleft.style.top.split("px").join('')) + parseInt(eyeleft.style.height.split('px').join('')) / 2);
				obj.Rleft = parseInt(parseInt(eyeright.style.left.split("px").join('')) + parseInt(eyeright.style.width.split('px').join('')) / 2);
				obj.Rtop = parseInt(parseInt(eyeright.style.top.split("px").join('')) + parseInt(eyeright.style.height.split('px').join('')) / 2);
			}
			else {
				obj.Lleft = parseInt(parseInt(eyeright.style.left.split("px").join('')) + parseInt(eyeright.style.width.split('px').join('')) / 2);
				obj.Ltop = parseInt(parseInt(eyeright.style.top.split("px").join('')) + parseInt(eyeright.style.height.split('px').join('')) / 2);
				obj.Rleft = parseInt(parseInt(eyeleft.style.left.split("px").join('')) + parseInt(eyeleft.style.width.split('px').join('')) / 2);
				obj.Rtop = parseInt(parseInt(eyeleft.style.top.split("px").join('')) + parseInt(eyeleft.style.height.split('px').join('')) / 2);
			}

			if (jsDom.nodeById('trackingImage')) {
				jsDom.remove(jsDom.nodeById('trackingImage'));
			}
			frameData = obj;
			userImageData = previewImage.style.cssText;

			cacheImg.saveFrameData(frameData, userImageData);

			EventListener.dispatch("APPLY_FRAME", this, settings_tryon.currentFrame, settings_tryon.tryonActive, "1/5")
			destroyAdditional();

		}
	};

	function destroyAdditional() {
		if (istrack == false) {
			istrack = true;
			dragImage.StopListening(true);
			dragleft.StopListening(true);
			dragright.StopListening(true);
			if (leftImage && rightImage) {
				jsDom.remove(leftImage);
				jsDom.remove(rightImage);
				leftImage = null;
				rightImage = null;
			}
			isUserImage = false;
		}
		else {
			dragImage.StopListening(true);
			var eyeleft = jsDom.nodeById('rect0');
			var eyeright = jsDom.nodeById('rect1');

			if (eyeleft && eyeright) {


				jsDom.remove(eyeleft);
				jsDom.remove(eyeright);

				eyeleft = null;
				eyeright = null;
			}
			isUserImage = false;
		}// makeAdjustmentButton();
	};

	function makeAdjustmentButton() {
		var adjustmentButton = jsDom.createNode("div", { "id": "adjustButton", "style": "position: absolute; cursor:pointer; width:18px;height:18px;overflow:hidden; bottom: 5px;left:5px;" }, "", "parent", previewArea);
		jsDom.html(adjustmentButton, '<img src="' + settings.adjustmenticon + '" width="100%" height="100%"/>');
		adjustmentButton.addEventListener("click", function () {
			EventListener.dispatch("ADJUSTMENT_STARTED", _previewRef);
			finalFrame = jsDom.nodeById("frame");
			if (finalFrame != null) {
				jsDom.remove(finalFrame);
			}
			jsDom.remove(this);
		});
		adjustmentButton.addEventListener("touchstart", function () {
			EventListener.dispatch("ADJUSTMENT_STARTED", _previewRef);
			finalFrame = jsDom.nodeById("frame");
			if (finalFrame != null) {
				jsDom.remove(finalFrame);
			}
			jsDom.remove(this);
		})
	};

	function makeThumb(objImageData) {

		if (objImageData["image"] === "") {
			return;
		}
		var userImg = jsDom.nodeById("userThumb");
		if (userImg != null) {
			jsDom.remove(userImg);
		}
		userImg = jsDom.createNode("div", { "id": "userThumb", "style": "position: absolute; overflow:hidden;cursor:pointer; width: 40px; height:auto; bottom: 5px;right: 5px;" }, "", "parent", previewArea);

		jsDom.html(userImg, '<img src="' + objImageData["image"] + '" id="userimage" style="display:none; border:3px solid #fff"/>');
		var userimage = jsDom.nodeById("userimage");
		var scale = userimage.naturalWidth / 30;
		var newHeight = Math.round(userimage.naturalHeight / scale);
		jsDom.css(userimage, { "width": "30px", "height": newHeight + "px", "display": "block" });
		jsDom.setAttr(userimage, { "width": "30", "height": newHeight });

		userImg.addEventListener("click", function () {
			objImageData.lastused = "image";
			loadImageFromData(objImageData);
			cacheImg.saveImage(objImageData["image"]);
			frameData = objImageData['frame'];
			jsDom.remove(this);
		});
		userImg.addEventListener("touchstart", function () {
			objImageData.lastused = "image";
			loadImageFromData(objImageData);

			cacheImg.saveImage(objImageData["image"]);

			frameData = objImageData['frame'];
			jsDom.remove(this);
		});
	};
	function showWithOldResizer(evt, fScale, fRotation, left, top) {
		setframetransform(fScale, fRotation, left, top);
	};
	function scaleFrameUp(evt, fScale, fRotation, left, top) {
		setframetransform(fScale, fRotation, left, top);
	};
	function scaleFrameDown(evt, fScale, fRotation, left, top) {
		setframetransform(fScale, fRotation, left, top);
	};
	function frameRotateLeft(evt, fScale, fRotation, left, top) {
		setframetransform(fScale, fRotation, left, top);
	};
	function frameRotateRight(evt, fScale, fRotation, left, top) {
		setframetransform(fScale, fRotation, left, top);
	};
	function frameReset(evt) {
		finalFrame.style.cssText = framemirror;
		finalFrame.style.display = "block";
		EventListener.dispatch("INIT_RESIZER", this, finalFrame);
	};
	function setframetransform(fScale, fRotation, left, top) {
		if (finalFrame) {
			var mirrorMode = 0;
			jsDom.css(finalFrame, { "display": "block", "left": left, "top": top, "-ms-transform": "rotate(" + fRotation + "deg) scale(" + fScale / 100 + ", " + fScale / 100 + ") rotateY(" + mirrorMode + "deg)", "-webkit-transform": "rotate(" + fRotation + "deg) scale(" + fScale / 100 + ", " + fScale / 100 + ") rotateY(" + mirrorMode + "deg)", "transform": "rotate(" + fRotation + "deg) scale(" + fScale / 100 + ", " + fScale / 100 + ") rotateY(" + mirrorMode + "deg)" });
		}

	}

	function applyFrame(evt, strFrame, tryonID, strFrameYPos) {

		var webarea = jsDom.nodeById('confirmationArea');
		var webcamOpened = jsDom.nodeById('tryon_webcam');


		if (webarea || webcamOpened) {
			return;
		}

		finalFrame = jsDom.nodeById("frame");
		if (finalFrame != null) {
			var oldleft = finalFrame.style.left;
			var oldtop = finalFrame.style.top;

			jsDom.remove(finalFrame);

		}
		strFrame = strFrame.split("http:").join("").split("https:").join("").split("file:/").join("");
		var frameYPos = 5;
		if (strFrameYPos != "") {
			var tempYPos = strFrameYPos.split("/");
			frameYPos = parseInt(tempYPos[1]);
		}
		var frameHeight = 0;
		var img = new Image();
		img.onload = function () {

			var strImageData = Tools.reduceImage(img, 0.6);
			var finalF = jsDom.nodeById("frame");
			jsDom.setAttr(finalF, { "src": strImageData });
		}
		img.crossOrigin = "Anonymous";
		img.src = strFrame;
		if (isModel) {
			/// here is the logic for the model,
			var arrTmpModel = settings.modeldata.split(",");
			var modelData = arrTmpModel[_modelNumber];
			var tempXY = modelData.split(":");
			var framePOSLeft = tempXY[0].split("-");
			var framePOSRight = tempXY[1].split("-");
			var frameWidth = 2.2 * (parseFloat(framePOSRight[0] - parseFloat(framePOSLeft[0])));
			var frameLeft = framePOSLeft[0] - (frameWidth / 3.8);
			var frameTop = framePOSLeft[1];
			finalFrame = jsDom.createNode("img", { "id": "frame", "src": strFrame }, "", "parent", mainArea);
			jsDom.css(finalFrame, { "display": "none", "position": "absolute", "opacity": "0.84", "left": frameLeft + "px", "width": frameWidth + "px" });


			finalFrame.onload = function () {
				var frameNaturalWidth = finalFrame.naturalWidth;
				var frameNaturalHeight = finalFrame.naturalHeight;
				var ratio = frameWidth / frameNaturalWidth;
				frameHeight = frameNaturalHeight * ratio;

				finalFrame.style.imageRendering = "optimizeQuality";
				jsDom.css(finalFrame, { "top": parseFloat(frameTop) - (frameHeight / frameYPos) + "px", "height": frameHeight + "px", "display": "block", "opacity": "0.96" });
				jsDom.setAttr(finalFrame, { "width": frameWidth, "height": frameHeight });
				framemirror = finalFrame.style.cssText;
				EventListener.dispatch("INIT_RESIZER", this, finalFrame, frameLeft, frameTop);
				//EventListener.dispatch("OLD_RESIZER",this);
				dragFrame = new dragObject("frame");
			}
			return;
		}


		else {

			isframe = true;

			var frameWidth = 2.2 * (parseFloat(frameData.Rleft) - parseFloat(frameData.Lleft));
			var frameLeft = (frameData.Lleft) - (frameWidth / 4.4);
			var frameTop = frameData.Ltop;

			finalFrame = jsDom.createNode("img", { "id": "frame", "src": strFrame }, "", "parent", mainArea);
			jsDom.css(finalFrame, { "display": "none", "position": "absolute", "opacity": "0.84", "left": frameLeft + "px", "width": frameWidth + "px" });


			finalFrame.onload = function () {
				var frameNaturalWidth = finalFrame.naturalWidth;
				var frameNaturalHeight = finalFrame.naturalHeight;
				var ratio = frameWidth / frameNaturalWidth;
				frameHeight = frameNaturalHeight * ratio;

				finalFrame.style.imageRendering = "optimizeQuality";
				jsDom.css(finalFrame, { "top": parseFloat(frameTop) - (frameHeight / frameYPos) + "px", "height": frameHeight + "px", "position": "absolute", "display": "block", "opacity": "0.96" });
				jsDom.setAttr(finalFrame, { "width": frameWidth, "height": frameHeight });
				//framemirror=finalFrame.style.cssText;
				EventListener.dispatch("INIT_RESIZER", this, finalFrame, frameLeft, frameTop);
				//EventListener.dispatch("OLD_RESIZER",this);
				dragFrame = new dragObject("frame");

			}


		}
	};
	// auto initiate //
	this.setupLayout();
};

export default TryonPreview;