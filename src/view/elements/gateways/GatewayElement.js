(function() {

    function GatewayElement() {
        this.SizableElement_constructor();
        
        this._icon=null;
		
		this.icons;
		this.typeIcon;
		
		this.gatewayType = "";
		this.executionType = "";
		
		this.txtName=null;
		
		this.FONT_COLOR = "#333333";
		this.FONT_SIZE = "10";
		this.FONT_FACE = "Tahoma";
		
		this.lineWidth						= 1.4;
		this.color							= "#FFEED6";
		this.lineColor						= "#FF9900";

        this.setup();
    }
    
    //static public//
    
    
    var element = facilis.extend(GatewayElement, facilis.SizableElement);
    
    element.SizableElementSetup=element.setup;
    element.setup = function() {
        this.SizableElementSetup();
        
        this.sizable=false;
        
        this._width = 33;
        this._height = 33;
        
        this._icon = new facilis.BaseElement();
        this.icons = new facilis.BaseElement();
        
        this.addChild(this._icon);
        this.addChild(this.icons);

        this.txtName = new facilis.ElementText();
        this.addChild(this.txtName);
        this.redrawCube();
    };
    
    
    element.setSize=function(width, height) {
        this._width = width;
        this._height = height;
        this.redrawCube();
    }
		
    element.redrawCube=function() {
        if(!this._icon.graphics)
            this._icon.graphics=new facilis.Graphics();

        
        this._icon.graphics.lineStyle(this.lineWidth,this.lineColor);
        this._icon.graphics.beginFill(this.color, 1); 
        this._icon.graphics.moveTo(this._width / 2,0);
        this._icon.graphics.lineTo(this._width, this._height / 2);
        this._icon.graphics.lineTo(this._width / 2, this._height);
        this._icon.graphics.lineTo(0, this._height / 2);
        this._icon.graphics.lineTo(this._width / 2, 0);
        this._icon.graphics.endFill();
        this.makeDegree(this._icon,this._height,this._height);
        this._icon.graphics.moveTo(this._width / 2,0);
        this._icon.graphics.lineTo(this._width, this._height / 2);
        this._icon.graphics.lineTo(this._width / 2, this._height);
        this._icon.graphics.lineTo(0,this._height / 2);
        this._icon.graphics.lineTo(this._width / 2, 0);
        this._icon.graphics.endFill();
        this._icon.addShape(new facilis.Shape(this._icon.graphics));

        this.alignText();
        
        this.setCached(true);
    }
    
    element.getCachedArea=function() {
        var h=this._height+this.cacheThreshold+50;
        h+=200;
        return { x:-this.cacheThreshold,y:-this.cacheThreshold,width:this._width+this.cacheThreshold+50,height:h };
    };

    element.typeChange=function(type) {        
		var icon = "";
        switch (type){
        case "Event":
        icon = "icons.gatewayType.EventBasedGateway";
        break;
        case "Data":
        icon = "icons.gatewayType.ExclusiveGateway";
        break;
        case "Exclusive":
        icon = "icons.gatewayType.ExclusiveGateway";
        break;
        case "Inclusive":
        icon = "icons.gatewayType.InclusiveGateway";
        break;
        case "Complex":
        icon = "icons.gatewayType.ComplexGateway";
        break;
        case "Parallel":
        icon = "icons.gatewayType.ParallelGateway";
        break;
        }
        if(this.typeIcon){
            this.icons.removeChild(this.typeIcon);
            this.typeIcon = null;
        }
        if(icon!=""){
            this.typeIcon = facilis.IconManager.getInstance().getIcon(icon);
            this.icons.addChild(this.typeIcon);
        }
        
        this.positionIcon();
		/*if (this.type == "Inclusive") {
			this.icons.x += 0.5;
			this.icons.y += 0.5;
		} else if (this.type == "Event") {
			this.icons.width += 1;
			this.icons.height += 1;
			this.icons.x += 0.5;
			this.icons.y += 0.5;
		}*/
		
        this.setExecutionOrder();
        this.setReadonlyExpression();
		element.refreshCache();
    }

    element.positionIcon=function() {
		element.refreshCache();
        this.icons.x = 7;//(this._width / 2)-(this.icons.getBounds().width / 2);
        this.icons.y = 7;//(this._height / 2)-(this.icons.getBounds().height / 2);
		element.refreshCache();
        
    }

    element.setName=function(name) {
        this.txtName.text = name;
        this.alignText();
    }

    element.alignText=function() {
        this.txtName.textAlign="center";
        this.txtName.y = this._height ;
        this.txtName.width = (this._width * 2);
         
        this.txtName.lineWidth = (this._width * 2);
        //this.txtName.height = (this._height*2);
        
        this.txtName.x = (this._width/2);
    }

    element.setDependencyProps=function(type) {
        var parent = this.parent;
        gatewayType = type;
        if (type == "Exclusive") {
            var d = (parent).getData().firstChildNode;
            for (var e = 0; e < d.children.length; e++ ) {
                if (d.children[e]=="exclusivetype") {
                    type = d.children[e].getAttribute("value");
                    break;
                }
            }
        }
        var lines = facilis.View.getInstance().getLineView().getLinesStartingIn(parent);
        for (var i = 0; i < lines.length; i++ ) {
            if ((lines[i]).elementType == "sflow") {
                var data = getConditiontype(  (lines[i]).getData() ).firstChildNode;
                enableAll(data);
                if (type == "Inclusive" || type == "Data") {
                    disableValue(data, "None");
                }
                if (type != "Data") {
                    disableValue(data, "Default");
                }
                if ((type != "Inclusive" && type != "Data") || type == "Complex") {
                    disableValue(data, "Expression");
                }
            }
        }
        updateExecution();
    }

    element.setExecutionType=function(type) {
        executionType = type;
        //setExecutionOrder();
    }
    
    element.t=null;
    element.updateExecution=function(action) {
        action=(action||"add");
        var d = (this.parent).getData();
        if (d) {
            for (var u = 0; u < d.children.length; u++ ) {
                var data = d.children[u];
                for (var i = 0; i < data.children.length; i++ ) {
                    if (data.children[i].getAttribute("name") == "executiontype") {
                        executionType = data.children[i].getAttribute("value");
                    }
                    if (data.children[i].getAttribute("name") == "gatewaytype") {
                        gatewayType = data.children[i].getAttribute("value");
                    }
                }
            }
            setExecutionOrder(action);
            //checkMiddleEvents(action);
            if(!t || (t && !t.running)){
                t = new Timer(300, 1);
                t.addEventListener(TimerEvent.TIMER, onTimer);
                t.start();
            }
        }
    }

    element.onTimer=function(e) {
        checkMiddleEvents();
    }

    element.setExecutionOrder=function(action) {
        action=(action||"add");
        var disabled = "true";
        if (this.gatewayType == "Exclusive" && this.executionType == "Automatic") {
            disabled = "false";
        }
        var parent = this.parent;
        var lines = facilis.View.getInstance().getLineView().getLinesStartingIn(parent);
        var i = 0;
        var countSflow = 0;
        var data;
        for (i = 0; i < lines.length; i++ ) {
            data =   (lines[i]).getData();
            if (data.getAttribute("name") == "sflow") {
                countSflow++;
            }
        }
        i = 0;
        if (action == "remove") {
            countSflow--;
        }
        if (countSflow == 1) {
            disabled = "true";
        }
        for (i = 0; i < lines.length; i++ ) {
            data =   (lines[i]).getData();
            if (data.getAttribute("name") == "sflow") {
                //data =   data.children[1]
                data =   data.children[0];
                for (var u = 0; u < data.children.length; u++ ) {
                    if (data.children[u].getAttribute("name") == "executionorder") {
                        data.children[u].setAttribute("disabled", disabled);
                    }
                }
                /*data =   data.parentNode.firstChildNode;
                var disableCondition = "true";
                if (lines.length > 1 && gatewayType != "Parallel") {
                    disableCondition = "false";
                }
                for (u = 0; u < data.children.length; u++ ) {
                    if (data.children[u].getAttribute("name") == "conditionexpression") {
                        //data.children[u].setAttribute("disabled", disableCondition);
                    }
                    if (data.children[u].getAttribute("name") == "conditiontype") {
                            data.children[u].setAttribute("disabled", disableCondition);
                    }
                }*/
            }
        }
        this.setReadonlyExpression();
    }

    element.getConditiontype=function(data) {
        for (var i = 0; i < data.firstChildNode.children.length; i++ ) {
            if (data.firstChildNode.children[i].getAttribute("name") == "conditiontype") {
                return data.firstChildNode.children[i];
            }
        }
        return null;
    }

    element.disableValue=function(node, value) {
        for (var i = 0; i < node.children.length; i++ ) {
            if (node.children[i].getAttribute("value") == value) {
                node.children[i].setAttribute("disabled", "true");
            }
        }
    }

    element.enableAll=function(node) {
        for (var i = 0; i < node.children.length; i++ ) {
            node.children[i].setAttribute("disabled", "false");
        }
    }

    element.setReadonlyExpression=function(action) {
        action=(action||"add");
        var lines = facilis.View.getInstance().getLineView().getLinesStartingIn(this.parent);
			var ro = false;
			var value = "Expression";
			var removeNone = false;
			if (gatewayType == "Exclusive" || gatewayType == "Inclusive") {
				//ro = true; -> Se agrega tipo de asociaciÃ³n Default
				//ro = false;
				/* No puede ser None, Solo condition o default
				if (lines.length == 1 || (lines.length == 2 && action == "remove")) {
					value = "None";
				}
				*/
				removeNone = true;
			} else if (gatewayType == "Parallel" || gatewayType == "Event") {
				ro = true;
				value = "None";
			}
			
			for (var i = 0; i < lines.length; i++ ) {
				var data =   (lines[i]).getData();
				if (data && data.getAttribute("name") == "sflow") {
					data = data.firstChildNode;
					for (var u = 0; u < data.children.length; u++ ) {
						if (data.children[u].getAttribute("name") == "conditiontype") {
							data.children[u].setAttribute("readonly", ro ? "true" : "false");
							data.children[u].setAttribute("type", ro ? "text" : "combo");
							//data.children[u].setAttribute("value", ro ? value : "None");
							//value = data.children[u].getAttribute("value");
							if(ro) {
								data.children[u].setAttribute("value", value);
							} else {
								if (removeNone && data.children[u].getAttribute("value") == "None")
									data.children[u].setAttribute("value", value);
								value = data.children[u].getAttribute("value");
							}
							
							if (removeNone) {
								
								for (var u2 = 0; u2 < data.children[u].children[0].children.length; u2++ ) {
									if (data.children[u].children[0].children[u2].getAttribute("value") == "None") {
										data.children[u].children[0].children[u2].removeNode();
										break;
									}
								}
							}
						}
						if (data.children[u].getAttribute("name") == "conditionexpression") {
							data.children[u].getAttribute("disabled") = (value=="None")?"true":"false";
						}
					}
				}
			}
    }

    element.checkMiddleEvents=function(type) {
        action=(action||"add");
        if(gatewayType=="Parallel"){
            var lines = facilis.View.getInstance().getLineView().getLinesStartingIn(this.parent);
            var setTo = false;
            var i = 0;
            var middleCount = 0;
            if(lines.length>0){
                for (i = 0; i < lines.length; i++ ) {
                    var line = lines[i];
                    var el = line.getEndElement();
                    var elType = el.elementType;
                    if (elType == "middleevent" && lines.length>1) {
                        //middleCount++;
                        //if(middleCount>1){
                            setTo = true;
                            break;
                        //}
                    }
                }
            }
            var typeNodeValues = getGatewayTypeNode().firstChildNode;
            i = 0;
            for (i = 0; i < typeNodeValues.children.length; i++ ) {
                var gType = typeNodeValues.children[i].getAttribute("value");
                if (gType == "Exclusive" || gType == "Inclusive") {
                    typeNodeValues.children[i].setAttribute("disabled", setTo+"");
                }
            }
        }
    }


    element.getGatewayTypeNode=function() {
        var d = (this.parent).getData();
        if (d) {
            for (var u = 0; u < d.children.length; u++ ) {
                var data = d.children[u];
                for (var i = 0; i < data.children.length; i++ ) {
                    if (data.children[i].getAttribute("name") == "gatewaytype") {
                        return data.children[i];
                    }
                }
            }
        }
        return null;
    }
    
    element.getIntersectionWidthSegment=function(s,e){
        
        var start=new facilis.Point(s.x,s.y);
        var end=new facilis.Point(e.x,e.y);
        
        this.globalToLocal(start.x,start.y,start);
        this.globalToLocal(end.x,end.y,end);
        
        var p1=new facilis.Point(this._width / 2,0)
        var p2=new facilis.Point(this._width, this._height / 2)
        var p3=new facilis.Point(this._width / 2, this._height)
        var p4=new facilis.Point(0, this._height / 2)
        
        var ret=(this.FindPointofIntersection(start,end,p1,p2) ||
                this.FindPointofIntersection(start,end,p2,p3) ||
                this.FindPointofIntersection(start,end,p3,p4) ||
                this.FindPointofIntersection(start,end,p4,p1)
                );
       
        
        if(ret){
            this.localToGlobal(ret.x,ret.y,ret);
        }else{
            console.log("failed gatewayelement intersection segment");
        }
       
        
        return ret;
        
    }
    


    facilis.GatewayElement = facilis.promote(GatewayElement, "SizableElement");
    
}());