package {
	import flash.display.Sprite;
	import flash.net.SharedObject;
	import flash.external.ExternalInterface;
	/**
	 * ...
	 * @author Seth
	 */
	public class StorageDevice extends Sprite
	{
		private var _so:SharedObject;
		public function StorageDevice():void {
			ExternalInterface.addCallback("getImageFrom", getImageFrom);
			ExternalInterface.addCallback("getImageSettings", getImageSettings);
			ExternalInterface.addCallback("saveImageIn", saveImageIn);
			ExternalInterface.addCallback("saveImageSettings", saveImageSettings);
		}
		/**
		 * Giving back you the image but need to add a listener to it.
		 */
		public function getImageFrom(location:String="models"):String{
			_so = SharedObject.getLocal("models", "/");
			var imageArray:String;
			if (_so.data.img != null)
			{
				imageArray = _so.data.img;
			}
			return imageArray;
		}
		
		public function getImageSettings(location:String="models"):String{
			_so = SharedObject.getLocal("models", "/");
			var strSettings:String;
			if (_so.data.pos != "" && _so.data.pos != null)
			{
				strSettings = _so.data.pos;
			}
			return strSettings;
		}
		/**
		 * Call it when wan tto save the image..
		 * @param	bmpData
		 * @param	objSettings
		 */
		public function saveImageIn(base64String:String, objSettings:Object, location:String="models"):void{	
			_so = SharedObject.getLocal("models", "/");
			_so.data.img = base64String;
			_so.data.pos = objSettings["pos"];
			_so.flush();
		}
		
		/**
		 * Call to save image pupilpositions
		 * @param	objSettings["pos"] = "78-118:108-118";
		 */
		public function saveImageSettings(objSettings:Object, location:String="models"):void{
			_so = SharedObject.getLocal("models", "/");
			_so.data.pos = objSettings["pos"];
			_so.flush();
		}
	}
};
