(function() {

    function SizableElement() {
        this.BaseElement_constructor();
        
        /*this.tickEnabled=false;
        this.tickChildren=false;*/
        
        this.__width =0;
		this.__height  = 0;
		
		this._minWidth  = 0;
		this._minHeight  = 0;
        
        this.cacheThreshold=20;
		
        this.setup();
    }
    
    var element = facilis.extend(SizableElement, facilis.BaseElement);

    element.setup = function() {
        this.addEventListener("changed",this.childrenChanged.bind(this));
    };
    
    element.getRealHeight=function() {
        return parseInt(this.__height);
    };

    element.getRealWidth=function() {
        return parseInt(this.__width);
    };
    
    element.getCachedArea=function() {
        return { x:-this.cacheThreshold,y:-this.cacheThreshold,width:this._width+this.cacheThreshold+50,height:this._height+this.cacheThreshold+50 };
    };
    
    element.setCached=function(cached){
        this._cached=cached;
        this.uncache();
        if(cached){ 
            var a=this.getCachedArea();
            this.cache(a.x,a.y,a.width,a.height);
        }
        this.refreshCache();
    };
    
    element.refreshCache=function(){
        if(this._cached){
            this.updateCache();
		}
    };
    
    element.childrenChanged=function(e){
        this.refreshCache();
    };

    Object.defineProperty(element, '_height', {
        get: function() { return this.__height; },
        set: function(newValue) { this.__height = parseInt(newValue);}
    });
    
    Object.defineProperty(element, '_width', {
        get: function() { return this.__width; },
        set: function(newValue) { this.__width = parseInt(newValue);}
    });
    
    Object.defineProperty(element, 'minHeight', {
        get: function() { return this._minHeight; },
        set: function(newValue) { this._minHeight = parseInt(newValue); }
    });
    
    Object.defineProperty(element, 'minWidth', {
        get: function() { return this._minWidth; },
        set: function(newValue) { this._minWidth = parseInt(newValue); }
    });

    
    facilis.SizableElement = facilis.promote(SizableElement, "BaseElement");
    
}());