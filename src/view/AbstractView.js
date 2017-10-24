(function() {

    function AbstractView() {
        this.BaseElement_constructor();
        
		this.dispatcherElement=null;

        this.setup();
    }
    
    //static public//
    
    
    var element = facilis.extend(AbstractView, facilis.BaseElement);
    
    element.setup = function() {
        this.elements=[];
        
    };
    
    
    
    element.addElement = function(el) {
        el.appear();
        this.addChild(el);

        el.addEventListener(facilis.AbstractElement.ELEMENT_ADDED,this.dispatchOut.bind(this));
        el.addEventListener(facilis.AbstractElement.ELEMENT_DELETE, this.dispatchOut.bind(this));
        el.addEventListener(facilis.AbstractElement.ELEMENT_DELETED, this.dispatchOut.bind(this));
        el.addEventListener(facilis.AbstractElement.ELEMENT_MOVED, this.dispatchOut.bind(this));
        el.addEventListener(facilis.AbstractElement.ELEMENT_MOVE_END, this.dispatchOut.bind(this));
        el.addEventListener(facilis.AbstractElement.ELEMENT_CLICK, this.dispatchOut.bind(this));
        el.addEventListener(facilis.AbstractElement.ELEMENT_CLICKED, this.dispatchOut.bind(this));
        el.addEventListener(facilis.AbstractElement.ELEMENT_DOUBLE_CLICKED, this.dispatchOut.bind(this));
        el.addEventListener(facilis.AbstractElement.ELEMENT_DROP, this.dispatchOut.bind(this));
        el.addEventListener(facilis.AbstractElement.ELEMENT_DROPIN, this.dispatchOut.bind(this));
        el.addEventListener(facilis.AbstractElement.ELEMENT_DROPOUT, this.dispatchOut.bind(this));
        el.addEventListener(facilis.AbstractElement.ELEMENT_OVER, this.dispatchOut.bind(this));
        el.addEventListener(facilis.AbstractElement.ELEMENT_OUT, this.dispatchOut.bind(this));
        el.addEventListener(facilis.AbstractElement.ELEMENT_DOUBLE_CLICKED, this.dispatchOut.bind(this));
        el.addEventListener(facilis.Sizable.RESIZE_EVENT, this.dispatchOut.bind(this));
        el.addEventListener(facilis.Sizable.RESIZE_COMPLETE_EVENT, this.dispatchOut.bind(this));

        facilis.View.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_DROP, el.hitTestMe.bind(el));

        this.dispatcherElement = el;
        el.dispatchEvent(new facilis.Event(facilis.AbstractElement.ELEMENT_ADDED));

        this.elements.push(el);
    }

    element.removeElement = function(el) {

        el.removeEventListener(facilis.AbstractElement.ELEMENT_ADDED,this.dispatchOut.bind(this));
        el.removeEventListener(facilis.AbstractElement.ELEMENT_DELETE, this.dispatchOut.bind(this));
        el.removeEventListener(facilis.AbstractElement.ELEMENT_DELETED, this.dispatchOut.bind(this));
        el.removeEventListener(facilis.AbstractElement.ELEMENT_MOVED, this.dispatchOut.bind(this));
        el.removeEventListener(facilis.AbstractElement.ELEMENT_MOVE_END, this.dispatchOut.bind(this));
        el.removeEventListener(facilis.AbstractElement.ELEMENT_CLICK, this.dispatchOut.bind(this));
        el.removeEventListener(facilis.AbstractElement.ELEMENT_CLICKED, this.dispatchOut.bind(this));
        el.removeEventListener(facilis.AbstractElement.ELEMENT_DROP, this.dispatchOut.bind(this));
        el.removeEventListener(facilis.AbstractElement.ELEMENT_DROPIN, this.dispatchOut.bind(this));
        el.removeEventListener(facilis.AbstractElement.ELEMENT_DROPOUT, this.dispatchOut.bind(this));
        el.removeEventListener(facilis.AbstractElement.ELEMENT_OVER, this.dispatchOut.bind(this));
        el.removeEventListener(facilis.AbstractElement.ELEMENT_OUT, this.dispatchOut.bind(this));
        el.removeEventListener(facilis.AbstractElement.ELEMENT_DOUBLE_CLICKED,this.dispatchOut.bind(this));
        el.removeEventListener(facilis.Sizable.RESIZE_EVENT, this.dispatchOut.bind(this));
        el.removeEventListener(facilis.Sizable.RESIZE_COMPLETE_EVENT, this.dispatchOut.bind(this));

        facilis.View.getInstance().removeEventListener(facilis.AbstractElement.ELEMENT_DROP, el.hitTestMe);

        //this.removeChild(el);
        el.removeMe();
        for (var i = 0; i < this.elements.length;i++ ) {
            if (this.elements[i]==el) {
                this.elements.splice(i,1);
            }
        }
        this.dispatchEvent(new facilis.Event(facilis.AbstractElement.ELEMENT_DELETED));
    }

    element.dispatchOut = function(e) {
        e.stopPropagation();
        this.dispatcherElement = e.target;
        this.dispatchEvent(new facilis.Event(e.type));
    }

    Object.defineProperty(element, 'dispatcher', {
        get: function() { 
            return this.dispatcherElement;;
        }
    });
    
    element.getElements = function(){
        return this.elements;
    }

    element.getExportData = function(){ 
        return null;
    }

    element.scale = function(ratio) {
        this.scaleX = ratio;
        this.scaleY = ratio;
    }

    element.clearAllElementEvents = function() {
        for (var i = 0; i < this.elements.length; i++ ) {
            var el = this.elements[i];
            el.removeAllEventListeners();
        }
    }

    element.clear = function() {
        while (0 < this.elements.length) {
            var el = this.elements[0];
            this.elements.splice(0, 1);
            el.parent.removeChild(el);
        }
    }
    


    facilis.AbstractView = facilis.promote(AbstractView, "BaseElement");
    
}());