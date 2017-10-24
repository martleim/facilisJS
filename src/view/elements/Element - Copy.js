(function() {

    function Element(elementClass) {
        this.Sizable_constructor();
        
        this.elementClass=elementClass;
        
        this._sizableEnabled = true;
		
		this.contents=[];
		
		this.container=null;
		this.elementId=null;

        //this.setup();
        this.addEventListener("added",function(e){
            e.target.AddedSetup();
        });
    }
    
    //static public//
    
    
    var element = facilis.extend(Element, facilis.Sizable);
    
    //element.SizableSetup=element.setup;
    element.AddedSetup = function() {
        //this.SizableSetup();
        
        var sizableEl = new this.elementClass();//MovieClip(new (LibraryManager.getInstance().getClass(className) as Class) as MovieClip);
        try{
            this._sizableEnabled = sizableEl.sizable;
        }catch (e) {
            this._sizableEnabled = true;
        }
        this.setSizableElement(sizableEl);
        if(!this._sizableEnabled){
            this.hideSizers();
        }

        this.addEventListener(facilis.Drag.DRAG_EVENT, this.onElementMoved.bind(this));
        this.addEventListener(facilis.Sizable.RESIZE_EVENT, this.onElementMoved.bind(this));
        
		this.addEventListener(facilis.Drag.STOP_EVENT, this.onDrop.bind(this));
        this.addEventListener(facilis.Sizable.RESIZE_EVENT, this.onResizeDrop.bind(this));
        this.addEventListener(facilis.AbstractElement.ELEMENT_OUT, this.onOut.bind(this));

        //this.addEventListener(facilis.Drag.STOP_EVENT, this.onElementMoveEnd.bind(this));
    };
    
    
    
    
    element.testCrash=function(el1, el2) {
        if((el1.elementType=="task" && el2.elementType=="pool")|| (el2.elementType=="task" && el1.elementType=="pool")){
            trace("hitTestMe " + el1.elementType + ": " + el1.getRealWidth() + " " + el1.getRealHeight() +" " + el1.x + " " + el1.y + " ---> " + el2.elementType + ": " + el2.getRealWidth() + " " + el2.getRealHeight() +" " + el2.x + " " + el2.y  );
        }
        if ((el1.x > el2.x && el2.x<(el1.x + el1.getRealWidth())) ||
        (el2.x > el1.x && el1.x<(el2.x + el2.getRealWidth()))){
            if ((el1.y > el2.y && el2.y<(el1.y + el1.getRealHeight())) ||
            (el2.y > el1.y && el1.x<(el2.y + el2.getRealHeight()))) {
                return true;
            }
        }
        return false;
    }

    element.hitTestMe=function(e) {
        var el = (e.target).dispatcher;
        //testCrash(el, this);
        this.resetStart();
        if (this.containsContent(el)) {
            return;
        }
        
        var dropOut = (el.hitTest(this) && (facilis.validation.RuleManager.getInstance().checkDropRule([el, this])));
        var dropIn = (this.hitTest(el) && facilis.validation.RuleManager.getInstance().checkDropRule([this, el]));
        var i;
        if (dropIn ) {
            i = 0;
            this.dispatchEvent(new facilis.Event(facilis.AbstractElement.ELEMENT_DROPIN));
        }else if (el.isInsideMe(this) && dropOut && !this.container) {
            if (!el.containsContent(this)) {
                this.dispatchEvent(new facilis.Event(facilis.AbstractElement.ELEMENT_DROPOUT));
            }
        }
    }

    element.hitTest=function(el) {
        if (el && el != this && el.parent) {
            if (( (!this.getElement().hitArea && this.hitTestObject(el) && !( this.hitTestContents(el)) && this.isInsideMe(el) ) 
            )) {
                return true;
            }else if (this.getElement().hitArea && el.getElement() && el.elementType=="middleevent") {
                return HitTest.complexHitTestObject(this.getElement().hitArea, el.getElement(),10);
            }
        }
        return false;
    }

    element.hitTestContents=function(el) {
        for (var i = 0; i < this.contents.length; i++ ) {
            var content = this.contents[i];
            if (content.hitTest(el)  && (facilis.validation.RuleManager.getInstance().checkDropRule([el, content])) ) {
                return true;
            }
        }
        return false;
    }

    element.isInsideMe=function(el) {
        if (!this.getElement().hitArea) {
            var thisX = this.x - (this.width / 2);
            var thisY = this.y - (this.height / 2);
            var elX = el.x - (el.getRealWidth() / 2);
            var elY = el.y - (el.getRealHeight() / 2);
            var thisP = new facilis.Point(thisX, thisY);
            var elP = new facilis.Point(elX, elY);
            if ((this.width > el.getRealWidth() && this.height > el.getRealHeight()) &&
            ((el.getRealWidth() + elX) < (this.width + thisX) && (el.getRealHeight() + elY) < (this.height + thisY)) &&
            ( elX>thisX && elY>thisY )
            ) {
                return true;
            }
        }
        return false;
    }

    element.remove=function() {
        if(this.parent){
            this.dispatchEvent(new facilis.Event(facilis.AbstractElement.ELEMENT_DELETE));
            if (this.getContainer()) {
                this.getContainer().removeContent(this);
            }
            var toDel = [];
            for (var i = 0; i < this.contents.length; i++ ) {
                if (!isInnerElement(this, this.contents[i])) {
                    toDel.push(this.contents[i]);
                }
            }
            while (toDel.length > 0) {
                toDel[0].remove();
                toDel.splice(0, 1);
            }
            removeInnerElements();
            facilis.View.getInstance().removeAnElement(this);
            this.dispatchEvent(new facilis.Event(facilis.AbstractElement.ELEMENT_DELETED));
        }
    }

    element.removeInnerElements=function() {
        try{
            var dropin = this.getElement();
            var inner = dropin.getInnerElements();
            for (var i = inner.length-1; i > -1; i-- ) {
                inner[i].remove();
            }
        }catch (e) {}
    }

    element.onResizeDrop=function(e) {
        //for (var i = 0; i < contents.length; i++ ) {
        var i = this.contents.length;
        while(i>0) {
            /*if ( !this.hitTest(contents[i]) ) {
                var el = (contents[i]);
                el.setContainer(null);
                el.setAlpha(1);
            }*/
            i--;
            if ( !this.hitTest(this.contents[i]) ) {
                var el = (this.contents[i]);
                //this.contents.splice(0,1);
                if (el) {
                    el.setAlpha(1);
                    el.setContainer(null);
                }
            }
        }
        this.dispatchEvent(new facilis.Event(facilis.AbstractElement.ELEMENT_DROP));
        this.setAlpha(1);
    }

    element.onDrop=function(e) {
        //if (this.movedX != 0 || this.movedY != 0) {
            var siblingHit = false;
            if (this.container) {
                var siblings = this.container.getContents();
                for (var i = 0; i < siblings.length; i++ ) {
                    if ((siblings[i]).hitTest(this)) {
                        siblingHit = true;
                        break;
                    }
                }
            }
            if (!this.container ||
            ( this.container && (!this.container.hitTest(this) || siblingHit))
            //( this.container && (!this.container.isInsideMe(this)) )
            ) {
                this.dispatchEvent(new facilis.Event(facilis.AbstractElement.ELEMENT_DROP));
            }
        //}
        this.setAlpha(1);
    }

    element.isParentContained=function(el) {
        if (this.contains(el)) {
            return true;
        }
    }

    element.isInnerElement=function(el,inner) {
        try {
            if (el) {
                var dropin = el.getElement();
                if ( dropin.containsInnerElement(inner) ) {
                    return true;
                }
            }
        }catch (e) {
        }
        return false;
    }

    element.setContainer=function(el, fromDrop) {
        if (this.container && this.isInnerElement(this.container , this)) {
            return;
        }
        if (this.container != el && !this.containsContent(el) && el != null) {
            if (!facilis.validation.RuleManager.getInstance().getDropRules().validate([el,this])) {
                return;
            }
            if (this.container) {
                this.container.removeContent(this);
                this.container.removeEventListener(facilis.AbstractElement.ELEMENT_MOVED, this.updateFromContainer.bind(this));
                this.container.removeEventListener(facilis.AbstractElement.ELEMENT_DRAG, this.updateFromContainer.bind(this));
                this.container.removeEventListener(facilis.Drag.STOP_EVENT, this.resetAfterContainerMoved.bind(this));
            }
            this.container = el; 
            this.container.addContent(this);
            this.container.addEventListener(facilis.AbstractElement.ELEMENT_MOVED, this.updateFromContainer.bind(this));
            this.container.addEventListener(facilis.AbstractElement.ELEMENT_DRAG, this.updateFromContainer.bind(this));
            this.container.addEventListener(facilis.Drag.STOP_EVENT, this.resetAfterContainerMoved.bind(this));
            if (this.container.parent == this.parent) {
                this.container.setAlpha(1);
            }
        }else if (el == null) {
            if (this.container) {
                this.container.removeContent(this);
                this.container.removeEventListener(facilis.AbstractElement.ELEMENT_MOVED, this.updateFromContainer.bind(this));
                this.container.removeEventListener(facilis.AbstractElement.ELEMENT_MOVED, this.updateFromContainer.bind(this));
                this.container.removeEventListener(facilis.Drag.STOP_EVENT, this.resetAfterContainerMoved.bind(this));
                this.container = el;
            }
        }
		var elTypeName=facilis.getClassName(this.getData()).toLowerCase();
        if (elTypeName == "middleevent") {
            var attached = false;
			if (fromDrop)
				attached = true;
            var lines = facilis.View.getInstance().getLineView().getLinesOf(this);
            if (lines) {
                for (var i = 0; i < lines.length; i++ ) {
                    if ((lines[i]).getStartElement() == el || (lines[i]).getEndElement() == el) {
                        this.setContainer(null);
                        return;
                    }
                }
            }
            if (el && el.getData() && ("task,csubflow".indexOf(facilis.getClassName(el.getData()).toLowerCase()) >=0 ) ) {
                this.getData().attached = true;
                this.attached = true;
            }else {
                this.getData().attached=false;
            }
            this.getElement().setTypeDisabled("Message", "false");
            this.getElement().setTypeDisabled("None", attached.toString());
            this.getElement().setTypeDisabled("Multiple", (!attached).toString());
			this.getElement().setTypeDisabled("Error", (!attached).toString());
            this.getElement().disableLineConditions();
            if (el && el.getData() && ("task,csubflow".indexOf(facilis.getClassName(el.getData()).toLowerCase()) >=0 ) ) {
                el.getElement().setAttachedEventType();
            }
        }
    }

	element.updatingFromContainer=false;
    element.updateFromContainer=function(e) {
		//e.stopPropagation();
        var el = (e.currentTarget);
        if (!this.container) {
            el.removeEventListener(facilis.AbstractElement.ELEMENT_MOVED, this.updateFromContainer);
            el.removeEventListener(facilis.Drag.STOP_EVENT, this.resetAfterContainerMoved);
            if(el.container){
                el.container.removeEventListener(facilis.AbstractElement.ELEMENT_MOVED, this.updateFromContainer);
                el.container.removeEventListener(facilis.Drag.STOP_EVENT, this.resetAfterContainerMoved);
            }
        }else{
            try{
				if(!this.updatingFromContainer){
					this.updatingFromContainer=true;
        			this.resetStart();
				}
				this.moveX(this.container.movedX);
                this.moveY(this.container.movedY);
                this.dispatchEvent(new facilis.Event(facilis.AbstractElement.ELEMENT_DRAG));
            }
            catch (err) {
                try{
                    el.removeEventListener(facilis.AbstractElement.ELEMENT_MOVED, this.updateFromContainer);
                    el.removeEventListener(facilis.Drag.STOP_EVENT, this.resetAfterContainerMoved);
                    if(el.container){
                        el.container.removeEventListener(facilis.AbstractElement.ELEMENT_MOVED, this.updateFromContainer);
                        el.container.removeEventListener(facilis.Drag.STOP_EVENT, this.resetAfterContainerMoved);
                    }
                }
                catch (err) {
                }
            }
        }
		e.stopPropagation();
    }

    element.resetAfterContainerMoved=function(e) {
		this.updatingFromContainer=false;
        this.resetStart();
    }

    element.getContainer=function() {
        return this.container;
    }

    element.addContent=function(el) {
        if (!this.containsContent(el)) {
            this.contents.push(el);
        }
        this.setAlpha(1);
    }

    element.removeContent=function(el) {
        for (var i = 0; i < this.contents.length; i++ ) {
            if ((this.contents[i]) === el) {
                this.contents.splice(i, 1);
                break;
            }
        }
    }

    element.containsContent=function(el) {
		if ( this.contents.indexOf(el)>=0 ) {
			return true;
		}
        for (var i = 0; i < this.contents.length;i++ ) {
			if((this.contents[i]).containsContent(el))
				return true;
        }
        return false;
    }

    element.setAlpha=function(a) {
        if (this) {
            if(this.parent){
                if (!this.container) {
                    this.parent.setChildIndex(this, this.parent.numChildren-1);
                }else if (this.container && (this.parent == this.container.parent)) {
                    this.parent.setChildIndex(this, this.parent.getChildIndex(this.container));
                }else {
                    this.parent.setChildIndex(this, this.parent.numChildren - 1);
                }
            }
            for (var i = 0; i < this.contents.length; i++ ) {
                var el = (this.contents[i]);
                el.setAlpha(a);
            }
            this.alpha = a;
        }
    }

    element.onElementMoved=function(e) {
		e.stopImmediatePropagation();
        this.setAlpha(.5);
        this.dispatchEvent(new facilis.Event(facilis.AbstractElement.ELEMENT_MOVED));
        if (this.container && !this.container.hitTest(this) && !this.isInnerElement(this.container,this)) {
            this.getContainer().removeContent(this);
            this.setContainer(null);
        }
    }

    element.onOut=function(e) {
        if(this.contents.length>0){
            this.setAlpha(1);
        }
    }

    element.getData=function() {
        if (!this.data) {
            this.data = (facilis.ElementAttributeController.getInstance().getElementModel( this.elementType ));//.cloneNode(true);
            this.data.id = this.id;
        }
        delete this.data.containerId;
        if (this.container) {
            this.data.containerId = this.container.getData().id;
        }
        this.data.attached = "";
        var w = this.getElement().width;
        var h = this.getElement().height;
        try {
            var sizable = (this.getElement());
            w=sizable.getRealWidth();
            h=sizable.getRealHeight();
        }
        catch (e) { }
        /*var x = (this.x - (w / 2));
        var y = (this.y - (h / 2));
        this.data.attributes.x = (x > 0)?x:0;
        this.data.attributes.y = (y > 0)?y:0;
        this.data.attributes.width = w;
        this.data.attributes.height = h;

        for (var i = 0; i < this.data.children.length; i++ ) {
            if (this.data.children[i].nodeName=="subElements") {
                this.data.children.splice(i, 1);
            }
        }*/
        return this.data;
    }
    
    Object.defineProperty(element, 'elementId', {
        get: function() { 
            if (!this._elementId) {
                //this._elementId = facilis.View.getInstance().getUniqueId();
            }
            return this._elementId;
        },
        set: function(val){
            this._elementId=val;
        }
    });

    element.resetId=function() {
        this.elementId = facilis.View.getInstance().getUniqueId();
        this.getData().attributes.id = this.id;
    }

    element.setData=function(d) {
        if(d.setViewModel && !this.setModel){
			d.setViewModel(this);
			this.setModel(d);
			d.updateAllBindings();
		}
		this.data = d;
    }

    element.getExportData=function() {
        if (!this.container) {
            return this.getSubExportData();
        }	
        return null;
    }

    element.getSubExportData=function() {
        var node = this.getData().cloneNode(true);
        if (this.contents.length > 0) {
            var children;
            for (var s = 0; s < node.children.length; s++ ) {
                if (node.children[s].nodeName=="subElements") {
                    children = node.children[s];
                }
            }
            if (!children) {
                children = new XMLNode(1, "subElements");
                node.appendChild(children);
            }
            for (var i = 0; i < this.contents.length;i++) {
                children.appendChild((this.contents[i]).getSubExportData());
            }
        }
        return node;
    }

    element.getContents=function(){
        return this.contents;
    }

    element.removeDropEvents=function() {
        this.removeEventListener(facilis.Drag.DRAG_EVENT, this.onElementMoved);
        this.removeEventListener(facilis.Drag.STOP_EVENT, this.onDrop);
        this.removeEventListener(facilis.Sizable.RESIZE_EVENT, this.onElementMoved);
        this.removeEventListener(facilis.Sizable.RESIZE_EVENT, this.onResizeDrop);
        this.removeEventListener(facilis.AbstractElement.ELEMENT_OUT, this.onOut);
    }
    
    element.getIntersectionWidthSegment=function(start,end){
        if(this._sizableElement.getIntersectionWidthSegment){
            return this._sizableElement.getIntersectionWidthSegment(start,end);
        }
        return null;
    }

    //PERFORMANCE FIX
    element.LocalhitTest=function(x,y){
        if(this.hitTest(x,y))
            return true;
        
        var p={};
        this._sizableElement.globalToLocal(x,y,p);
        return this._sizableElement.hitTest(p.x,p.y);
    }
    
    facilis.Element = facilis.promote(Element, "Sizable");
    
}());