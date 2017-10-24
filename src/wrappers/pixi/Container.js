(function() {

    function Container() {
        this.BaseContainer_constructor();
    }
    
    var element = facilis.extend(Container, PIXI.Container);
    
    element.position={};
    
    element.addBaseChild=element.addChild;
    element.addChild=function(el){
        this.addBaseChild(el);
        el.dispatchEvent("added");
    }
    
    element.removeAllChildren=function(){
        while(this.children>0)
            this.removeChild(this.children[0]);
    }
    
    element.setBounds=function(w,h){}
    
    element.localToGlobal=function(pt){
        pt=this.toGlobal(pt);
        return pt;
    }
    
    element.globalToLocal=function(pt){
        pt=this.toLocal(pt);
        return pt;
    }
    
    element.hitTest=function(x,y){
        return ((x>=this.x && x<=this.width+this.x) && (y>=this.y && y<=this.height+this.y));
    }
    
    element.setMask=function(m){
     //   this.mask=m;
    }
	
	element.uncache=function(m){
     //   this.mask=m;
    }
	
	element.cache=function(m){
     //   this.mask=m;
    }
	
	element.updateCache=function(m){
     //   this.mask=m;
    }
    
    Object.defineProperty(element,"mask",{
        get:function(){
            
        },
        set:function(val){}
    });
    
    Object.defineProperty(element,"stage",{
        get:function(){
            var st={
            canvas : {
                width:(window.innerWidth-30),
                height:(window.innerHeight-30)
                }
            }
            return st;
        }
    });
    
    Object.defineProperty(element,"numChildren",{
        get:function(){
            return this.children.length;
        }
    });
    
    facilis.EventDispatcher.initialize(element);
    
    facilis.Container = facilis.promote(Container, "BaseContainer");
    
}());