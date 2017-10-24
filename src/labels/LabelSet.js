(function() {

    function LabelSet(setName) {
        facilis.EventDispatcher.initialize(this);
        this._labelSetName=setName;
		this._labels=null;

    }
    
    LabelSet.LABELSET_LOADED = "labelSetLoaded";
    
    
    var element = facilis.extend(LabelSet, {});
    
    element.loadLabels=function(url) {
        
        var queue = new createjs.LoadQueue(true);
        queue.addEventListener("fileload", this.onVarsLoaded.bind(this));
        queue.loadFile(url);//loadFile({src:url, type:createjs.AbstractLoader.JSON});
        
    }

    element.onVarsLoaded=function(event) {
        this._labels = {};
        var retVars = event.result;
        for (var name in retVars) {
            this._labels[name] = unescape(retVars[name]);
            //trace("name: " + name + " value:" + _labels[name]);
        }
        this.dispatchEvent(new facilis.Event(facilis.LabelSet.LABELSET_LOADED));
    }
    
    element.getLabel=function(name) {
        return (this._labels[name]||("undefined label: "+name));
    }

    
    Object.defineProperty(element, 'labelSetName', {
        get: function() {
            return this._labelSetName;
        }
    });



    facilis.LabelSet = facilis.promote(LabelSet, "Object");
    
}());
