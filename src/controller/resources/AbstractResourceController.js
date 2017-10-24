(function() {

    function AbstractResourceController() {
        this.setup();
    }
    
    //static public//
    
    
    var element = facilis.extend(AbstractResourceController, {});

    
    element.setup = function() {
        this.resources = {};//new HashMap();
        facilis.View.getInstance().addEventListener(facilis.View.ON_CLEAR, this.toClear.bind(this));
    };
    
    element.resourceId = 0;
		
    element.resources;


    element.addResource=function(res, id) {
        if(id==null){
            id = this.resourceId;
        }else {
            if (id > this.resourceId) {
                this.resourceId = id;
            }
        }
        res.resourceId=id;
        this.resourceId++;
        this.resources[id]=res;
        return res;
    }

    element.removeResource=function(id) {
        return this.resources[id]=null;
    }

    element.getResource=function(id) {
        return this.resources[id];
    }

    element.getResources=function() {
        var res=[];
        for(var i in this.resources)
            res.push(this.resources[i]);
            
        return res;
    }

    element.toClear=function(e) {
        this.resources = {};
    }


    facilis.controller.AbstractResourceController = facilis.promote(AbstractResourceController, "Object");
    
}());