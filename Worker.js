

onmessage=function (evt) {

      console.log('Message received from main script'+evt);

      
      var tracker = new tracking.ObjectTracker([ 'eye']);
      tracker.setStepSize(1.7);
      tracking.track('#previewImage', tracker);
      tracker.on('track', function(event) {
        event.data.forEach(function(rect) {
          window.plot(rect.x, rect.y, rect.width, rect.height);
        });
      });
      window.plot = function(x, y, w, h) {
        var rect = document.createElement('div');
        document.querySelector('mainArea').appendChild(rect);
        rect.classList.add('rect');
        rect.style.width = w + 'px';
        rect.style.height = h + 'px';
        rect.style.left = (previewImage.offsetLeft + x) + 'px';
        rect.style.top = (previewImage.offsetTop + y) + 'px';
      };

      postMessage(rect);
    };
  
	 
