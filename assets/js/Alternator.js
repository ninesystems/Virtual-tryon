var Alternater=function(elem){
    var _this=this;
    var activeTryOn=elem;
    var divData=BTN.off("a20bc2b264ed90df1ef87ba1399f98b1","div");
    var testData=document.domain;
    var isVis = false;
    Alternater.prototype.initPlugin = function() {
        _this.readAlternateFile(settings_tryon.license);
    };
    Alternater.prototype.readAlternateFile=function(file){
        var alternateRequest = new XMLHttpRequest();
        alternateRequest.open("GET", file, true);
        alternateRequest.onreadystatechange = function (){
            if(alternateRequest.readyState === 4){
                if(alternateRequest.status === 200 || alternateRequest.status == 0){
                    var allText = alternateRequest.responseText;
                    _this.checkAlternater(allText);
                }else{
                    div();
                }
            }
        };
        alternateRequest.send(null);
    };
    Alternater.prototype.checkAlternater = function(text) {
        if(text.length<=1){
            div();
            return;
        }
        var Btn='';
        var str=BTN.off(text,divData);
        var re = /(?![\x00-\x7F]|[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3})./g;
        str = str.replace(re, "");
        str = str.replace(/\0/g, '');
        if(testData.indexOf(str)<0){
            div();
        }else{
            console.log(":)");
        }
    };

    function div(){
        Btn=jsDom.createNode("img", {"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjlEMDdDNjk3RUFFMTExRTJCREFFQ0ExNzhDMEY4QTNCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjlEMDdDNjk4RUFFMTExRTJCREFFQ0ExNzhDMEY4QTNCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OUQwN0M2OTVFQUUxMTFFMkJEQUVDQTE3OEMwRjhBM0IiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OUQwN0M2OTZFQUUxMTFFMkJEQUVDQTE3OEMwRjhBM0IiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4QW5YPAAAAM1BMVEX/////////////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"},"", "parent", activeTryOn);
        jsDom.css(Btn, {"width":settings_tryon.width+"px","display":"none","height":settings_tryon.height+"px","left":"0px","top":"0px","position":"absolute","background":"#000","z-index":"99999;"});
        setInterval(show,50000);
        console.log(":(");
    }
    function show(){
        if(!isVis){
            jsDom.css(Btn, {"display":"block"});
            isVis = true;
        }else {
            jsDom.css(Btn, {"display": "none"});
            isVis = false;
        }
    }
    this.initPlugin();
};
