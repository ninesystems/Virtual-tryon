// Used to save the image, grab data and save give back to the save view., its a private class for saving image for all the sharing and save plugin
var SaveImage = function(){
var previewArea=jsDom.nodeById("mainArea");
    SaveImage.prototype.setupLayout = function () {

    };

    SaveImage.prototype.initSaving = function(){

    	html2canvas([previewArea], {
    	onrendered: function(canvas) {
       	var data  = canvas.toDataURL("image/png");
       	var imgdata=dataURItoBlob(data);
       	SaveToDisk(imgdata, "mytryonlook.png");
		}
   		});
   	 };
    function dataURItoBlob(dataURI) {
		var byteString = atob(dataURI.split(',')[1]);
		var ab = new ArrayBuffer(byteString.length);
		var ia = new Uint8Array(ab);
		for (var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
		}
		return new Blob([ab], { type: 'image/png' });
		}
    function SaveToDisk(blobURL, fileName) {
    var reader = new FileReader();
    reader.readAsDataURL(blobURL);
    reader.onload = function (event) {
      /*window.location.href=event.target.result;*/
       var a = document.createElement('a');
      a.setAttribute('download', 'MyTryOnLook.png');
      a.href = event.target.result;
      a.innerHTML = 'testing';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      
    };
}


};