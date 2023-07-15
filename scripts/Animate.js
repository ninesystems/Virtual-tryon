function Animate(){};

Animate.animate = function(opts){
	console.log("starting up animation")
    var start = new Date;
    var id = setInterval(function(){
        var timePassed = new Date - start;
        var progress = timePassed / opts.duration
        if(progress > 1){
            progress = 1;
        }
        var delta = opts.delta(progress);
        opts.step(delta);
        if (progress == 1){
            clearInterval(id);
           //opts.callback();
         }
    }, opts.dalay || 17);
};

Animate.move = function(element, to, duration) {
	if(!duration){
		duration = 600;
	};
	Animate.animate({
	    delay: 10,
	    duration: duration || 1000, // 1 sec by default
	    delta: circ,
	    step: function(delta) {
	      element.style.left = to*delta + "px";	    }
	});
};

function circ(progress) {return 1 - Math.sin(Math.acos(progress))};