(function() {

    function ActivityElement() {
        this.SizableElement_constructor();
        
        //this.setup();
    }
    
    var element = facilis.extend(ActivityElement, facilis.SizableElement);
    
    element.radius = 12;
    
    element.SizableElementSetup=element.setup;
    element.setup = function() {
        this.SizableElementSetup();
        this._width = 90;
        this._height = 60;
        this.iconSize = 20;
        
        this._name="";
        this.startTask = false;
        this.startType = "";

        this.lineWidth						= 1.4; //AbstractElement.lineWidth;
        this.color							= "#EBF4FF"; //AbstractElement.color;
        this.lineColor						= "rgba(0,0,0,.4)";//"#000000"; //AbstractElement.lineColor;
        
        this._icon = new facilis.BaseElement();
        this.subIcons = new facilis.BaseElement();
        this.topIcons = new facilis.BaseElement();
        
        this.addChild(this._icon);
        this.addChild(this.topIcons);
        this.addChild(this.subIcons);
        
        this.txtName = new facilis.ElementText();
        this.txtName.text="Default Task";
        this.txtName.width=this._width;
        
        /*txtName.autoSize = TextFieldAutoSize.CENTER;
        txtName.selectable = false;
        txtName.multiline = true;
        txtName.wordWrap = true;*/
        this.addChild(this.txtName);

        /*var myformat:TextFormat = new TextFormat();
        myformat.color = FONT_COLOR;
        myformat.size = FONT_SIZE;
        myformat.font = FONT_FACE;
        myformat.align = "center";
        txtName.defaultTextFormat = myformat;

        txtBlocker = new MovieClip();
        this.addChild(txtBlocker);*/    
        
        /*var tmp=function(e){
            e.currentTarget.removeEventListener("tick",tmp);
            e.currentTarget.redrawCube();
        };
        
        this.addEventListener("tick",tmp);*/
        this.redrawCube();
        
        
    }

    element.setSize=function(width, height){
        _width = width;
        _height = height;
        this.redrawCube();
    }

    element.redrawCube=function() {
        if(!this._icon.graphics)
           this._icon.graphics=new facilis.Graphics();
           
        this._icon.removeAllChildren();
        this._icon.graphics.clear();
        
        this._icon.graphics.lineStyle(this.lineWidth,this.lineColor);
        this._icon.graphics.beginFill(this.color);
        this._icon.graphics.drawRoundRect(0, 0, this._width, this._height, this.radius, this.radius);
        this._icon.graphics.endFill();

        this._icon.addShape(new facilis.Shape(this._icon.graphics));
        
        this.makeDegree(this._icon);
        this._icon.graphics.drawRoundRect(0, 0, this._width, this._height, this.radius, this.radius);
        this._icon.graphics.endFill();
        this.positionIcons();
        this.txtName.width = this._width;
        this.txtName.height = this._height;
        /*txtBlocker.graphics.beginFill(0xFFFFFF, 0);
        txtBlocker.graphics.drawRoundRect(0, 0, _width, _height, radius, radius);
        txtBlocker.graphics.endFill();*/
        
        this.setCached(true);
    }

    element.positionIcons=function() {
        for (var i = 0; i < this.topIcons.numChildren;i++ ) {
            //this.topIcons.getChildAt(i).x = (this.iconSize + 1) * ( -i);
			this.topIcons.getChildAt(i).x = (this.iconSize + 1) * ( i);
        }
        i = (this.subIcons.numChildren - 1);
        for (i = (this.subIcons.numChildren - 1); i >= 0; i-- ) {
           this.subIcons.getChildAt(i).x = (this.iconSize + 1) * ( i);
        }
        this.subIcons.y = this._height - this.iconSize;
        if(this.subIcons.numChildren>0)
            this.subIcons.x = (this._width - (this.subIcons.numChildren*this.iconSize)) / 2;
        
        this.topIcons.y = 5;
        //if(this.topIcons.getBounds().width)
        //this.topIcons.x = (this._width - ((this.iconSize + 1)*this.topIcons.numChildren)) - 5;
		this.topIcons.x = 2;
        
        this.alignText();
    }

    element.addSubIcon=function(icon) {
        if (icon == null) {
            return;
        }
        this.subIcons.addChild(icon);
        icon.parent.swapChildren(icon, icon.parent.getChildAt(0));
        this.positionIcons();
    }

    element.addTopIcon=function(icon) {
        if (icon == null) {
            return;
        }
        this.topIcons.addChild(icon);
        this.positionIcons();
    }

    element.removeSubicon=function(icon) {
        if (icon && icon.parent==this.subIcons) {
            this.subIcons.removeChild(icon);
            this.positionIcons();
        }
        icon = null;
    }

    element.removeTopIcon=function(icon) {
        if (icon && icon.parent==this.topIcons) {
            this.topIcons.removeChild(icon);
            this.positionIcons();
        }
        icon = null;
    }

    element.loopTypeChange=function(loopType) {
        var icon = "";

        switch (loopType){
        case "Standard":
        icon = "icons.loopType.StandardLoop";
        break;
        case "MultiInstance":
        icon = "icons.loopType.MultiInstanceLoop";
        break;
        }

        if(this.loopIcon){
            this.removeSubicon(this.loopIcon);
            this.loopIcon = null;
        }
        if(icon!=""){
            this.loopIcon = facilis.IconManager.getInstance().getIcon(icon);
            this.addSubIcon(this.loopIcon);
        }
    }
    element.typeChange=function(type) {

    }

    element.setName=function(name) {
        this._name = name;
        this.txtName.text = name;
        this.alignText();
    }

    element.setNameText=function(name) {
        this.txtName.text = name;
        this.alignText();        
    }

    element.getName=function(name) {
        return this._name;
    }

    element.alignText=function() {
        this.txtName.textAlign="center";
        //this.txtName.textBaseline="hanging";
        
        //txtName.autoSize = TextFieldAutoSize.CENTER;
        //txtName.y = (_height / 2) - (txtName.height / 2);
        this.txtName.width = (this._width);
        this.txtName.lineWidth = (this._width);
        this.txtName.height = (this._height);
        this.txtName.x=this._width/2;
        var h = this._height - (((this.topIcons.height > 0)?17:0) + ((this.subIcons.height > 0)?10:0));
        /*if ((this.txtName.height+this.txtName.y) > h) {
            //txtName.autoSize = TextFieldAutoSize.NONE;
            this.txtName.height = h;
            this.txtName.y = 0;
        }
        if (this.txtName.y < 17 && (this.topIcons.height > 0)) {
            this.txtName.y = 17;
        }*/
		this.refreshCache();
    }

    element.setDependencyProps=function(type) {
        var parent = this.parent;
        var lines = View.getInstance().getLineView().getLinesStartingIn(parent);
        for (var i = 0; i < lines.length; i++ ) {
            /*if ((lines[i] as AbstractElement).elementType == "sflow") {
                var data = getConditiontype(  (lines[i] as AbstractElement).getData() ).firstChild;
                enableAll(data);
                if (type != "Task" && type != "Sub-Process") {
                    disableValue(data, "Expression");
                }
            }*/
        }
    }

    element.getConditiontype=function(data) {
        for (var i = 0; i < data.firstChildNode.children.length; i++ ) {
            if (data.firstChildNode.children[i].attributes.name == "conditiontype") {
                return data.firstChildNode.children[i];
            }
        }
        return null;
    }

    element.disableValue=function(node, value) {
        for (var i = 0; i < node.children.length; i++ ) {
            if (node.children[i].attributes.value == value) {
                node.children[i].attributes.disabled = "true";
            }
        }
    }

    element.enableAll=function(node) {
        for (var i = 0; i < node.children.length; i++ ) {
            node.children[i].attributes.disabled = "false";
        }
    }

    element.setAttachedEventType=function() {
        /*var data = (this.parent as Element).getData().firstChild;
        var els = (this.parent as Element).getContents();
        for (var i = 0; i < els.length; i++ ) {
            if ((els[i] as Element).elementType == "middleevent") {
                setDisableTypeTo((els[i] as Element), "Message", "false");
                setDisableTypeTo((els[i] as Element), "Timer", "false");
                setSingleMessage(els[i], "false");
                if (startType == "Message"){
                    setDisableTypeTo((els[i] as Element), "Message", "true");
                    setSingleMessage(els[i], "true");
                }else if (startType == "Timer"){
                    setDisableTypeTo((els[i] as Element), "Timer", "true");
                    //setSingleMessage(els[i], "true");
                }
            }
        }*/
    }

    element.setDisableTypeTo=function(el, type, to) {
        el.getElement().setTypeDisabled(type, to);
    }

    element.setFirstTask=function(to) {
        /*try{
        startTask = ((to + "") == "true");
        var firsttask;
        var data = (this.parent as AbstractElement).getData();
        if(data){
            data = data.firstChild;
            for (var i = 0; i < data.children.length; i++ ) {
                if (data.children[i].attributes.name == "firsttask") {
                    firsttask = data.children[i];
                    break;
                }
            }
            if ((to + "") == "false") {
                startType = "";
            }
            if(firsttask){
                firsttask.attributes.value = to;
            }
        }
        setAttachedEventType();
        }catch (e) {
            trace(e);
        }*/
    }

    element.setStartType=function(type) {
        setFirstTask("true");
        startType = type;
        setAttachedEventType();
    }

    element.setSingleMessage=function(el,to) {
        var data = el.getData();
		if (data.trigger) {
			data.trigger.multiple.multmessagecatch.single=to;
			data.trigger.multiple.multmessagethrow.single=to;
		}
    }

    element.getIntersectionWidthSegment=function(s,e){
        var start=new facilis.Point(s.x,s.y);
        var end=new facilis.Point(e.x,e.y);
        
        this.globalToLocal(start.x,start.y,start);
        this.globalToLocal(end.x,end.y,end);
        
        var ret=(this.FindPointofIntersection(start,end,new facilis.Point(0,0),new facilis.Point(this._width,0)) ||
                this.FindPointofIntersection(start,end,new facilis.Point(this._width,0),new facilis.Point(this._width,this._height)) ||
                this.FindPointofIntersection(start,end,new facilis.Point(this._width,this._height),new facilis.Point(0,this._height)) ||
                this.FindPointofIntersection(start,end,new facilis.Point(0,this._height),new facilis.Point(0,0))
                );
        
        if(ret){
            this.localToGlobal(ret.x,ret.y,ret);
        }else{
            console.log("failed activityelement intersection segment");
        }
        return ret;
        
    }

	element.hitAreaHitTest=function(el){
		var x1=(this.parent.x+this.x);
		var y1=(this.parent.y+this.y);
		var w1=this._width;
		var h1=this._height;
		
		var border=6;
		var x2=(this.parent.x+this.x)+border;
		var y2=(this.parent.y+this.y)+border;
		var w2=this._width-border;
		var h2=this._height-border;
		
		var x3=(el.parent.x+el.x);
		var y3=(el.parent.y+el.y);
		var w3=el._width;
		var h3=el._height;
		
		return ( (x1 <= x3+w3 && x3 <= x1+w1 && y1 <= y3+h3 && y3 <= y1+h1) && !(x2 <= x3 && x3+w3 <= x2+w2 && y2 <= y3 && y3+h3 <= y2+h2) );
		
		return ( (x1 <= x2+w2 && x2 <= x1+w1 && y1 <= y2+h2 && y2 <= y1+h1)
				&& !( x2 >= x3 + w3 || (x2) + w2 <= x3 || y2 >= y3 + h3 || (y2) + h2 <= y3 ) );
	}
    

    facilis.ActivityElement = facilis.promote(ActivityElement, "SizableElement");
    
}());