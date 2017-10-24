(function() {

    function MultiDrag() {
        this.Drag_constructor();
		this.draggedElements=[];
		this.elements=[];
		this.toMove=[];
		this.lines=[];
		this.handle=null;
		if (!MultiDrag.allowInstantiation) {
            throw new Error("Error: Instantiation failed: Use SingletonDemo.getInstance() instead of new.");
        }
    }
    
	MultiDrag._instance=null;
    MultiDrag.allowInstantiation=false;
    MultiDrag.getInstance=function(){
        if (facilis.MultiDrag._instance == null) {
            MultiDrag.allowInstantiation = true;
            MultiDrag._instance = new facilis.MultiDrag();
            MultiDrag.allowInstantiation = false;
        }
        return MultiDrag._instance;
    }
    var element = facilis.extend(MultiDrag, facilis.Drag);
    
    element.BaseElementSetup=element.setup;
    element.setup = function() {
        this.BaseElementSetup();
        
    };
	
	element.started=false;
	element.init=function(_stage){
		if(!this.started){
			this.started=true;
			_stage.addChild(this);
		}
	}
	
	element.drag=function(handle,elements){
		if(this.handle==handle)
			return;
			
		this.x=0;
		this.y=0;
		
		this.lastX=0;
		this.lastY=0;
		
		this.resetStart();
		
		this.draggedElements=[];
		this.elements=[];
		this.toMove=[];
		this.lines=[];
		this.handle=null;
	
		this.handle=handle;
		
		this.handleMovedListener=this.handle.addEventListener(facilis.AbstractElement.ELEMENT_MOVED, this.handleMoved.bind(this));
		//this.handle.addEventListener(facilis.AbstractElement.ELEMENT_DRAG, this.updateFromContainer.bind(this));
		this.handleStoppedListener=this.handle.addEventListener(facilis.Drag.STOP_EVENT, this.handleStopped.bind(this));
		
		this.initDraggedElements(elements);
		this.initDraggedLines(facilis.LineView.getInstance().getElements());
	}
	
	element.initDraggedElements=function(elements){
		for(var i=0;i<elements.length;i++){
			if(this.elements.indexOf(elements[i])<0){
				this.elements.push(elements[i]);
				this.draggedElements.push({
					element:elements[i],
					parent:elements[i].parent,
					startx:elements[i].x,
					starty:elements[i].y
				});
				elements[i].keepEventsOnRemove=true;
				this.addChild(elements[i],true);
				elements[i].keepEventsOnRemove=false;
				if(elements[i].contents)
					this.initDraggedElements(elements[i].contents);
					
			}
		}
	}
	
	element.initDraggedLines=function(lines){
		for(var i=0;i<lines.length;i++){
			var startContained=(this.elements.indexOf(lines[i].getStartElement())>=0);
			var endContained=(this.elements.indexOf(lines[i].getEndElement())>=0);
			
			if(startContained && endContained && this.lines.indexOf(lines[i])<0){
				this.elements.push(lines[i]);
				this.lines.push(lines[i]);
				this.draggedElements.push({
					element:lines[i],
					parent:lines[i].parent,
					startx:lines[i].x,
					starty:lines[i].y
				});
				lines[i].keepEventsOnRemove=true;
				this.addChild(lines[i],true);
				lines[i].keepEventsOnRemove=false;
			}else if(startContained || endContained){
				var el=(startContained)?lines[i].getStartElement():lines[i].getEndElement();
				this.toMove.push(el);
			}
		}
	}
	
	element.handleMoved=function(e){
		this.lastX=this.handle.movedX;
		this.lastY=this.handle.movedY;
		this.moveX(this.lastX);
        this.moveY(this.lastY);
		
		for(var i=0;i<this.toMove.length;i++){
			this.toMove[i].dispatchEvent(new facilis.Event(facilis.AbstractElement.ELEMENT_DRAG));
		}
	}
	
	element.handleStopped=function(e){
		
		while(this.draggedElements.length>0){
			var el=this.draggedElements.shift();
			el.element.keepEventsOnRemove=true;
			el.parent.addChild(el.element,true);
			el.element.keepEventsOnRemove=true;
			if(el.element instanceof facilis.Element){
				/*el.element.x=el.x;
				el.element.y=el.y;*/
				/*el.element.moveX(this.lastX);
				el.element.moveY(this.lastY);*/
				
				el.element.x=el.startx+this.lastX;
				el.element.y=el.starty+this.lastY;
				
				//el.element.dispatchEvent(new facilis.Event(facilis.AbstractElement.ELEMENT_DRAG));
			}else if(el.element instanceof facilis.LineObject){
				for(var v=0;v<el.element.lineVertexs.length;v++){
					var vertex=el.element.lineVertexs[v];
					vertex.x+=this.lastX;
					vertex.y+=this.lastY;
				}
			}else{
				//el.element.x=0;
				//el.element.y=0;
				
			}
		}
		this.x=0;
		this.y=0;
		this.resetStart();
		for(var i=0;i<this.lines.length;i++){
			this.lines[i].refreshWholeLine(false);
		}
		
		/*for(var i=0;i<this.elements.length;i++){
			el.element.dispatchEvent(new facilis.Event(facilis.AbstractElement.ELEMENT_MOVED));
		}*/
		
		this.handle.removeEventListener(facilis.AbstractElement.ELEMENT_MOVED, this.handleMovedListener);
		this.handle.removeEventListener(facilis.Drag.STOP_EVENT, this.handleStoppedListener);
		this.removeAllChildren();
		
		this.draggedElements=[];
		this.elements=[];
		this.toMove=[];
		this.lines=[];
		this.handle=null;
	}
    
	facilis.MultiDrag = facilis.promote(MultiDrag, "Drag");
    
}());