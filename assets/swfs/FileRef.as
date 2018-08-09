package  {
	
	import flash.display.MovieClip;
	import flash.events.MouseEvent;
	import flash.net.FileReference;
	import flash.net.FileFilter;
	import flash.display.BitmapData;   
    import flash.geom.Rectangle;   
    import flash.utils.ByteArray; 
    import flash.events.Event;
    import flash.events.IOErrorEvent;
    import flash.display.Loader;
    import flash.display.DisplayObject;
    import flash.display.Bitmap;
	import flash.geom.Matrix;
	import mx.utils.Base64Encoder;
	import com.adobe.images.BitString;
	import com.adobe.images.PNGEncoder;
	import com.adobe.images.JPGEncoder;
	import flash.external.ExternalInterface;
	
	
	public class FileRef extends MovieClip {
		var mFileReference:FileReference;
		var filter:FileFilter;
		var fileExtension:String="";		
		public function FileRef() {
			startButton();
		}
		
		private function startButton():void{
			btn.addEventListener(MouseEvent.CLICK, onClick);
			btn.buttonMode = true;
			btn.useHandCursor = true;
		}
		
		private function onClick(evt:MouseEvent):void{
			mFileReference=new FileReference();
			mFileReference.addEventListener(Event.SELECT, onFileSelected);
			var imageTypeFilter:FileFilter = new FileFilter("Image Files","*.jpeg; *.jpg;*.gif;*.png");
			//var allTypeFilter:FileFilter = new FileFilter("All Files (*.*)","*.*");
			mFileReference.browse([imageTypeFilter]);
		}
		private function onFileSelected(event:Event):void{
			ExternalInterface.call("LoadingStart");
			mFileReference.addEventListener(Event.COMPLETE, onFileLoaded);
			mFileReference.addEventListener(IOErrorEvent.IO_ERROR, onFileLoadError);
			mFileReference.load();
			btn.visible=false;
			btn.enabled = false;
		}
		
		private function onFileLoaded(event:Event):void{
			var fileReference:FileReference=event.target as FileReference;
			var data:ByteArray=fileReference["data"];
			fileExtension = getExtension(fileReference["name"]);
			mFileReference.removeEventListener(Event.COMPLETE, onFileLoaded);
			mFileReference.removeEventListener(IOErrorEvent.IO_ERROR, onFileLoadError);
			
			var movieClipLoader:Loader=new Loader();
			movieClipLoader.loadBytes(data);
			movieClipLoader.contentLoaderInfo.addEventListener(Event.COMPLETE, onMovieClipLoaderComplete);
		}
		public function getExtension($url:String):String{
			var extension:String = $url.substring($url.lastIndexOf(".")+1, $url.length);
			return extension;
		}
		
		private function onFileLoadError(event:Event):void{
			ExternalInterface.call("IOError");
			btn.visible=true;
			btn.enabled = true;
			mFileReference.removeEventListener(Event.COMPLETE, onFileLoaded);
			mFileReference.removeEventListener(IOErrorEvent.IO_ERROR, onFileLoadError);
		};
		
		private function onMovieClipLoaderComplete(event:Event):void{
			var bmpdata:BitmapData= Bitmap(event.target.content as Bitmap).bitmapData;
			var bytes:ByteArray;
			
			var encoder:JPGEncoder;
			encoder = new JPGEncoder(80);
			bytes = encoder.encode( bmpdata );
			
			var be = new Base64Encoder();
			be.encodeBytes(bytes);
			btn.visible=true;
			btn.enabled = true;
			
			var bstr = be.toString();
			ExternalInterface.call("getBitmap", bstr, fileExtension);
		};
	}
}
