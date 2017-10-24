(function() {

    function LaneView() {
        this.AbstractView_constructor();
        
        if (!LaneView.allowInstantiation) {
            throw new Error("Error: Instantiation failed: Use SingletonDemo.getInstance() instead of new.");
        }
    }
    
    LaneView._instance=null;
    LaneView.allowInstantiation=false;
    LaneView.getInstance=function(){
        if (LaneView._instance == null) {
            LaneView.allowInstantiation = true;
            LaneView._instance = new facilis.LaneView();
            LaneView._instance.appendMe();
            LaneView.allowInstantiation = false;
        }
        return LaneView._instance;
    }
    
    
    var element = facilis.extend(LaneView, facilis.AbstractView);
    
    element.AbstractViewSetup=element.setup;
    element.setup = function() {
        this.AbstractViewSetup();
    };
    
    element.appendMe=function() {
        facilis.View.getInstance()._stage.addChild(LaneView._instance);
    }

    element.getExportData=function(){ 
        var els = [];
        for (var i = 0; i<this.elements.length; i++) {
            var el = this.elements[i].getExportData();
            if (el) {
                els.push(el);
            }
        }
        return els;
    }

    

    facilis.LaneView = facilis.promote(LaneView, "AbstractView");
    
}());