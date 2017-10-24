(function() {

    function LabelManager() {
        
        if (LabelManager.allowInstantiation) {
            facilis.EventDispatcher.initialize(this);
            this._labelsSets={};
            this._defaultSet="default";

        }else{
            throw new Error("Error: Instantiation failed: Use SingletonDemo.getInstance() instead of new.");
        }
        
    }
    

    
    LabelManager.allowInstantiation=false;
    LabelManager._instance=null;
    LabelManager.LABELS_LOADED = "onLabelsLoaded";
    

    LabelManager.getInstance=function() {
        if (LabelManager._instance == null) {
            LabelManager.allowInstantiation = true;
            LabelManager._instance = new LabelManager();
            LabelManager.allowInstantiation = false;
        }
        return LabelManager._instance;
    }

    var element = facilis.extend(LabelManager, {});
    
    element.loadLabels=function(url,language) {
        language=(language||"default");
        var labelSet = new facilis.LabelSet(language);
        labelSet.addEventListener(facilis.LabelSet.LABELSET_LOADED, this.setLoaded.bind(this));
        labelSet.loadLabels(url);
    }

    element.getLabel=function(name, labelSet) {
        if (!labelSet) {
            labelSet = this._defaultSet;
        }
        if (this._labelsSets[labelSet]) {
            return (this._labelsSets[labelSet]).getLabel(name);
        }
        return "nor found:"+name;
    }

    element.setLoaded=function(event) {
        var labelSet = event.currentTarget;
        this._labelsSets[labelSet.labelSetName]=labelSet;
        this.dispatchEvent(new facilis.Event(facilis.LabelManager.LABELS_LOADED));
    }

    Object.defineProperty(element, 'defaultLabelSet', {
        set: function(val) {
            this._defaultSet=val;
        }
    });
    

    facilis.LabelManager = facilis.promote(LabelManager, "Object");
    
}());