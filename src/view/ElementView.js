(function() {

    function ElementView() {
        this.AbstractView_constructor();
        
        if (!ElementView.allowInstantiation) {
            throw new Error("Error: Instantiation failed: Use SingletonDemo.getInstance() instead of new.");
        }
    }
    
    ElementView._instance=null;
    ElementView.allowInstantiation=false;
    ElementView.getInstance=function(){
        if (ElementView._instance == null) {
            ElementView.allowInstantiation = true;
            ElementView._instance = new facilis.ElementView();
            ElementView._instance.appendMe();
            ElementView.allowInstantiation = false;
        }
        return ElementView._instance;
    }
    
    
    var element = facilis.extend(ElementView, facilis.AbstractView);
    
    element.AbstractViewSetup=element.setup;
    element.setup = function() {
        this.AbstractViewSetup();
    };
    
    element.appendMe=function() {
        facilis.View.getInstance()._stage.addChild(ElementView._instance);
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

    

    facilis.ElementView = facilis.promote(ElementView, "AbstractView");
    
}());