/**
 * Created by Studio on 16/Dec/14.
 */
var Tools = (function() {
    // Private method //
    var getBase64Image = function(img, quality) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");

        //----- origin draw ---
        ctx.imageSmoothingEnabled = true;
        ctx.mozImageSmoothingEnabled = true;
        ctx.oImageSmoothingEnabled = true;
        ctx.webkitImageSmoothingEnabled = true;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        //------ reduced draw ---
        var canvas2 = document.createElement("canvas");
        canvas2.width = img.width * quality;
        canvas2.height = img.height * quality;
        var ctx2 = canvas2.getContext("2d");
        ctx.globalAlpha = 0.5;
        ctx2.imageSmoothingEnabled = true;
        ctx2.mozImageSmoothingEnabled = true;
        ctx2.oImageSmoothingEnabled = true;
        ctx2.webkitImageSmoothingEnabled = true;

        ctx2.drawImage(canvas, 0, 0, img.width * quality, img.height * quality);

        // -- back from reduced draw ---
        ctx.globalCompositeOperation = "overlay";
        ctx.drawImage(canvas2, 0, 0, img.width, img.height);
        return canvas.toDataURL("image/png");

        // return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    };

    // Public method //
    return {
        reduceImage: function (img, quality) {
            return getBase64Image(img, quality);
        }
    }
var getTransformData=function (container,cb){
          var scale=1;
          var fRotation=0;
          var st = window.getComputedStyle(container, null);
          var tr = st.getPropertyValue("-webkit-transform") ||
          st.getPropertyValue("-moz-transform") ||
          st.getPropertyValue("-ms-transform") ||
          st.getPropertyValue("-o-transform") ||
          st.getPropertyValue("transform") ||
          "FAIL";
          if(tr!='none'){
          console.log(tr);
          var values = tr.split('(')[1].split(')')[0].split(',');
          var a = values[0];
          var b = values[1];
          var c = values[2];
          var d = values[3];
          scale = Math.sqrt(a*a + b*b);
          var fScale=scale*100;
          var sin = b/scale;
          var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
          fRotation=angle;
          
          }
          cb(scale,fRotation);
    };

return {
        getTransformdata: function (container,cb) {
            return getTransformData(container,cb);
        }
    }

   
})();


/*Tools.bar(); //FooStatic.barPrivate() called.*/