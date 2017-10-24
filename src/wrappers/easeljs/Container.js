(function() {

    function Container() {
        this.BaseContainer_constructor();
    }
    
    var element = facilis.extend(Container, createjs.Container);
    
    element.setMask=function(m){
        this.mask=m;
    }
    
    element.baseAddChild=element.addChild;
    element.addChild=function(el,bypassUpdateCache){
        this.baseAddChild(el);
		if(!bypassUpdateCache)
			try{this.updateCache();}catch(e){}
        
		this.dispatchEvent(new facilis.Event("changed",true));
    }
    
	element.baseRemoveChild=element.removeChild;
    element.removeChild=function(el,bypassUpdateCache){
        this.baseRemoveChild(el);
		if(!bypassUpdateCache)
			try{this.updateCache();}catch(e){}
        
		this.dispatchEvent(new facilis.Event("changed",true));
    }
	
	
    facilis.Container = facilis.promote(Container, "BaseContainer");
    
}());