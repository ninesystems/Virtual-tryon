package {
	import flash.display.LoaderInfo;
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.events.*;
	import flash.utils.*;
	import flash.media.Camera;
	import flash.media.Video;
	import flash.external.ExternalInterface;
	import flash.net.*;
	import flash.system.Security;
	import flash.system.SecurityPanel;
	import flash.media.Sound;
	import flash.media.SoundChannel;
	import flash.geom.Matrix;
	import mx.utils.Base64Encoder;
	import com.adobe.images.BitString;
	import com.adobe.images.PNGEncoder;
	import com.adobe.images.JPGEncoder;
	import fl.controls.CheckBox;
	import flash.display.BlendMode;

	public class Webcam extends Sprite {
		private var video:Video;
		private var video_width:int;
		private var video_height:int;
		private var dest_width:int;
		private var dest_height:int;
		private var camera:Camera;
		private var bmpdata:BitmapData;
		private var jpeg_quality:int;
		private var image_format:String;
		
		public function Webcam(){
			startCam();
		}
		private function startCam():void{
			
			flash.system.Security.allowDomain("*");
			var dest_width:Number = stage.stageWidth;
			var dest_height:Number = stage.stageHeight;
			jpeg_quality = 80;
			image_format = "jpg";
			stage.scaleMode = StageScaleMode.NO_SCALE;
			// stage.scaleMode = StageScaleMode.EXACT_FIT;
			stage.align = StageAlign.TOP_LEFT;
			// Hack to auto-select iSight camera on Mac (JPEGCam Issue #5, submitted by manuel.gonzalez.noriega)
			// From: http://www.squidder.com/2009/03/09/trick-auto-select-mac-isight-in-flash/
			var cameraIdx:int = -1;
			for (var idx = 0, len = Camera.names.length; idx < len; idx++) {
				if (Camera.names[idx] == "USB Video Class Video") {
					cameraIdx = idx;
					idx = len;
				}
			}
			if (cameraIdx > -1) camera = Camera.getCamera( String(cameraIdx) );
			else camera = Camera.getCamera();
									
			if (camera != null) {
				//camera.addEventListener(ActivityEvent.ACTIVITY, activityHandler);
				camera.addEventListener(StatusEvent.STATUS, activityHandler);
				var vidHeight:Number = stage.stageHeight;
				var change:Number = vidHeight/camera.height;
				var vidWidth:Number = camera.width*change;
				
				video = new Video(vidWidth, vidHeight);
				video.smoothing = true;
				video.attachCamera(camera);
				camera.setQuality(0, 100);
				camera.setKeyFrameInterval(10);
				camera.setMode(640, 480, 30);
				
				// only detect motion once, to determine when camera is "live"
				camera.setMotionLevel( 1 );
				
				video.x = -1*(video.width - stage.stageWidth) / 2;
				video.y = stage.stageHeight / 2 - video.height / 2;
				
				addChildAt(video, 0);
				setupTopPanel();
				
				ExternalInterface.addCallback('_snap', snap);
				ExternalInterface.addCallback('_configure', configure);
				//ExternalInterface.call('flashNotify', 'webcamLoadComplete', true);
			}
			else{
				ExternalInterface.call('flashNotify', "error", "No camera was detected.");
			}
		}
		private function setupTopPanel():void {
			mcTop.chkBoxLowLight.addEventListener(MouseEvent.CLICK, onLowLight);
			mcTop.chkBoxMirror.addEventListener(MouseEvent.CLICK, onMirror);
			//btn.addEventListener(MouseEvent.CLICK, onClick);
		}
		
		private function onClick(evt:MouseEvent):void{
			var btm:Bitmap = new Bitmap(snap());
			this.addChild(btm);
		}
		private function onMirror(e:MouseEvent):void{
			var chk:CheckBox = e.currentTarget as CheckBox;
			if(!chk.selected){
				video.scaleX = 1;
				video.x = (stage.stageWidth -video.width) / 2;
			}else{
				video.scaleX = -1;
				video.x = (stage.stageWidth + (video.width - stage.stageWidth) / 2);
			}
		}
		
		private function onLowLight(evt:MouseEvent):void{
			var chk:CheckBox = evt.currentTarget as CheckBox;
			if(chk.selected){
				video.blendMode = BlendMode.HARDLIGHT;
			}else {
				video.blendMode = BlendMode.NORMAL;
			}
		}
		public function configure(panel:String = SecurityPanel.CAMERA) {
			Security.showSettings(panel);
		}
		private function activityHandler(event:StatusEvent):void {
			if(event.code == "Camera.Muted"){
				ExternalInterface.call('flashNotify', 'webcamDenied', true);
				//startCam();
			}else{
				ExternalInterface.call('flashNotify', 'webcamLive', true);
			}
			// now disable motion detection (may help reduce CPU usage)
			camera.setMotionLevel( 100 );
		}
		
		public function snap(){
			mcTop.visible = false;
			bmpdata = new BitmapData(stage.stageWidth, stage.stageHeight);
			bmpdata.draw( this );
			
			
			var bytes:ByteArray;
			var encoder:JPGEncoder;
			encoder = new JPGEncoder( jpeg_quality );
			bytes = encoder.encode( bmpdata );
			
			var be = new Base64Encoder();
			be.encodeBytes( bytes );
			
			var bstr = be.toString();
			mcTop.visible = true;
			return bstr;
		}
	}
}