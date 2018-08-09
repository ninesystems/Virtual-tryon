/**
 * Created by Studio on 20/Nov/14.
 */
var Resizer = function(myWorkArea){
    var previewArea = myWorkArea;
    var settings = settings_tryon;
    var _resizerRef = this;
    var resizerView = null;
    var fScale=100;
    var fRotation=0;
    var frameimg='';
    var mirrorMode=0;
    var resizerBtn=["FrameReset","FrameRotateLeft","FrameRotateRight","FrameScaleUp","FrameScaleDown","space","FacebookShare","TwitterShare","SaveImage"];
    var shareObj=new ShareView();
    var frameLeft=0;
    var frameTop=0;
 Resizer.prototype.initPlugin = function() {
        setupLayout();
        EventListener.addEventListener("ALL_DONE", showResizer);
        EventListener.addEventListener("INIT_RESIZER", initResizer);
        EventListener.addEventListener("HIDE_RESIZER", hideResizer);
        EventListener.addEventListener("OLD_RESIZER", showWithOld);
        EventListener.addEventListener("INIT_RESIZER_VAR", initResizerVar);


    };
    function setupLayout(){
        resizerView = jsDom.createNode("div", {"id":"frame_live_resizer", "style":"position:relative; display:none;width:"+settings.resizerPanelWidth+"px;height:"+settings.resizerPanelHeight+"px;"}, "", "parent", previewArea);
        jsDom.css(resizerView, {"display":"block", "top":"5px","left":settings.width+"px" ,"z-index":"11", "textAlign":"center"});
        for (var i = 0; i < resizerBtn.length; i++) {
          if(resizerBtn[i]=="space"){
                jsDom.createNode("hr", {"width":"60%", "style":"border:0;height:1px;margin:5px 8px 15px;background-color:"+settings.bordercolor+";"},"", "parent", resizerView);

                continue;
          }
          makeBtn(resizerBtn[i]);
        }
      };
    function makeBtn(id){
      var title=id+"Title";
      var tool=jsDom.createNode("span", {"class":"hint--right hint--rounded","data-hint":settings[title]},"", "parent", resizerView); 
      var Btn=jsDom.createNode("img", {"src":""+settings[id]+"","id":id,"class":"resizerpanel"},"", "parent", tool); 
      jsDom.css(Btn, {"display":"block","margin-bottom":"2px" ,"cursor":"pointer"});
      Btn.addEventListener("click",resizerAction);
      Btn.addEventListener("touchstart",resizerAction);
    }
    function initResizer(evt,frame,left,top){
      fScale=100;
      fRotation=0;
      frameLeft=left;
      frameTop=top;
      var st = window.getComputedStyle(frame, null);
      var tr = st.getPropertyValue("-webkit-transform") ||
         st.getPropertyValue("-moz-transform") ||
         st.getPropertyValue("-ms-transform") ||
         st.getPropertyValue("-o-transform") ||
         st.getPropertyValue("transform") ||
         "none";
         if(tr!='none'){
          var values = tr.split('(')[1].split(')')[0].split(',');
          var a = values[0];
          var b = values[1];
          var c = values[2];
          var d = values[3];
          var scale = Math.sqrt(a*a + b*b);
          fScale=scale*100;
          var sin = b/scale;
          fRotation=Math.round(Math.atan2(b, a) * (180/Math.PI));
        }

    };
   function initResizerVar(){
     fScale=100;
     fRotation=0;
  };
  function showWithOld(evt,frameLeft,frameTop){
     frameLeft=frameLeft;
     frameTop=frameTop;
     EventListener.dispatch("FRAME_WITH_RESIZER",this,fScale,fRotation,frameLeft,frameTop);
  };
   function resizerAction(){

    var action=this.id;
    switch(action){
      case 'FrameReset':
      EventListener.dispatch("FRAME_RESET",this);
      break;
      case 'FrameRotateLeft':
      fRotation-=5;
      EventListener.dispatch("FRAME_ROTATE_LEFT",this,fScale,fRotation,frameLeft,frameTop);
      break;
      case 'FrameRotateRight':
      fRotation+=5;
      EventListener.dispatch("FRAME_ROTATE_RIGHT",this,fScale,fRotation,frameLeft,frameTop);
      break;
      case 'FrameScaleUp':
      fScale += 10;
      EventListener.dispatch("SCALE_UP",this,fScale,fRotation,frameLeft,frameTop);
      break;
      case 'FrameScaleDown':
      fScale -= 10;
      EventListener.dispatch("SCALE_DOWN",this,fScale,fRotation,frameLeft,frameTop);
      break;
      case 'FacebookShare':
      shareObj.savetheImage("fb");  
      break;
      case 'TwitterShare':
      shareObj.savetheImage("tw");
      break;
      case 'SaveImage':
      shareObj.savetheImage("saveonly");
      break;

    }
    };
  function showResizer(){
       jsDom.css(resizerView,{'display':'block'});
       var frame=jsDom.nodeById("frames");
       var userthumb=jsDom.nodeById("userThumb");
       if(userthumb){
            jsDom.css(userthumb,{'display':'block'});
       }
       if(frame){
       jsDom.css(frame,{'display':'block'});
     }
  };
  function hideResizer(){
       jsDom.css(resizerView,{'display':'none'});
      var frame=jsDom.nodeById("frames");
       var userthumb=jsDom.nodeById("userThumb");
       if(userthumb){
        jsDom.css(userthumb,{'display':'none'});
       }
       if(frame){
       jsDom.css(frame,{'display':'none'});
       }
  };

   function getoffset(el){
        var _x = 0;
        var _y = 0;
        while( el && !isNaN( el.offsetLeft ) && !isNaN(el.offsetTop)) {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        return { "top":_y, "left":_x };
    };
  
    // auto initiate //
    this.initPlugin();
};