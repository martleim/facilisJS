(function() {

    function TaskElement() {
        this.ActivityElement_constructor();
        
    }
    
    //static public//
    
    
    var element = facilis.extend(TaskElement, facilis.ActivityElement);
    
    element.ActivityElementSetup=element.setup;
    element.setup = function() {
        this.ActivityElementSetup();
        
        this._hitArea=new facilis.BaseElement();
        this.typeIcon=new facilis.BaseElement();
		
		
		this.sizable = false;
		this.taskType = "";
		this.loopType = "";
		
        
        if(!this._hitArea.graphics)
            this._hitArea.graphics=new facilis.Graphics();

        //this._hitArea.graphics.beginFill("rgba(0,33,0,.5)");
        
        this._hitArea.graphics.lineStyle(4,"rgba(0,33,0,.01)");
        this._hitArea.graphics.drawRoundRect(3, 3, this._width - 6, this._height - 6, this.radius, this.radius);
        
        //this._hitArea.graphics.endFill();
        //this._hitArea.graphics.drawRoundRect(4, 4, this._width - 8, this._height - 8, this.radius, this.radius);
        
        this._hitArea.mouseEnabled=false;
        
        this.addChild(this._hitArea);
        //this.hitArea = this._hitArea;
        this._hitArea.addShape(new facilis.Shape(this._hitArea.graphics));
        
    };
    
    
    
    element.typeChange=function(type) {
        this.taskType = type;
        var icon = "";

        switch (type){
        case "Send":
        icon = "icons.taskType.TaskSend";
        break;
        case "Receive":
        icon = "icons.taskType.TaskReceive";
        break;
        case "User":
        icon = "icons.taskType.TaskUser";
        break;
        case "Script":
        icon = "icons.taskType.TaskScript";
        break;
        case "Manual":
        icon = "icons.taskType.TaskManual";
        break;
        case "Reference":
        icon = "icons.taskType.TaskReference";
        break;
        case "Service":
        icon = "icons.taskType.TaskService";
        break;
        }

        if(this.typeIcon){
            this.removeTopIcon(this.typeIcon);
            this.typeIcon = null;
        }
        if(icon!=""){
            this.typeIcon = facilis.IconManager.getInstance().getIcon(icon);//(LibraryManager.getInstance().getInstancedObject(icon)) as MovieClip;
            this.addTopIcon(this.typeIcon);
        }

        //this.setAttachedEventType();

    }


    element.setAttachedEventType=function() {
        var data = (this.parent).getData();
        var els = (this.parent).getContents();
        if (this.taskType == "") {
            if (data) {
                this.taskType = data.taskType;
            }
        }
        var disabledTo = false;
        //if (taskType == "User" || taskType == "Receive" || taskType == "Service") {
        if (this.taskType == "Send" || this.taskType == "Receive" || this.taskType == "Service" || this.taskType == "Script") {
            this.disabledTo = true;
        }
		console.log("FIX DISABLED TO MIDDLEVENT");
        for (var i = 0; i < els.length; i++ ) {
            if ((els[i]).elementType == "middleevent") {
                this.setDisableTypeTo((els[i]), "Message", disabledTo + "");
                //setDisableTypeTo((els[i]), "Message", "false");
                this.setDisableTypeTo((els[i]), "Timer", "false");
                this.setSingleMessage(els[i], "false");
                if (this.startType == "Message"){
                    this.setDisableTypeTo((els[i]), "Message", "true");
                    this.setSingleMessage(els[i], "true");
                }else if (this.startType == "Timer"){
                    //setDisableTypeTo((els[i]), "Timer", "true");
                    //setSingleMessage(els[i], "true");
                }
            }
        }
    }

    element.setMultiInMsgs=function(multi) {
        this.loopType = multi;
        this.setInMsgsTo();
    }

    element.setStartType=function(type) {
        this.setFirstTask("true");
        this.startType = type;
        this.setInMsgsTo();
        this.setAttachedEventType();
    }

    element.setFirstTask=function(to) {
        this.startTask = ((to + "") == "true");
        var firsttask;
        var data = (this.parent).getData();
        if(data){
            data = data.firstChild;
            for (var i = 0; i < data.children.length; i++ ) {
                if (data.children[i].attributes.name == "firsttask") {
                    firsttask = data.children[i];
                    break;
                }
            }
            if(firsttask){
                firsttask.attributes.value = to;
            }
            if ((to + "") == "false") {
                this.startType = "";
                this.setDisableType("Send", false);
                this.setDisableType("Script", false);
            }else {
                this.setDisableType("Send", true);
                this.setDisableType("Script", true);
            }
            this.setInMsgsTo();
            this.setOutMsgsTo();
        }
    }

    element.setOutMsgsTo=function() {
        var d = (this.parent).getData();
        if (d) {
            d = d.firstChild;
            for (var i = 0; i < d.children.length; i++ ) {
                if (d.children[i].attributes.name == "user" || d.children[i].attributes.name == "service" ) {
                    var msgs = d.children[i].firstChild;
                    for (var u = 0; u < msgs.children.length; u++ ) {
                        if (msgs.children[u].attributes.name == "outmessageref") {
                            msgs.children[u].attributes.disabled = startTask.toString();
                        }
                    }
                }
            }
        }
    }

    element.setInMsgsTo=function() {
        var to = false;
        if (this.startType == "Message" || this.loopType == "MultiInstance") {
            to = true;
        }
        var d = (this.parent).getData();
        this.setDisableType("Receive", to+"");
        this.setDisableType("Service", to+"");

        if (d) {
            d = d.firstChild;
            for (var i = 0; i < d.children.length; i++ ) {
                if (d.children[i].attributes.name == "user") {
                    var msgs = d.children[i].firstChild;
                    for (var u = 0; u < msgs.children.length; u++ ) {
                        if (msgs.children[u].attributes.name == "inmessageref") {
                            msgs.children[u].attributes.disabled = to.toString();
                        }
                        /*if (msgs.children[u].attributes.name == "outmessageref") {
                            msgs.children[u].attributes.disabled = to.toString();
                        }*/
                    }
                }
            }
            //View.getInstance().unselectAll();
            //View.getInstance().select(this.parent);
        }
    }

    element.setDisableType=function(type, to) {
        var d = (this.parent).getData();
        if (d) {
            d = d.firstChild;
            var selectedVal;
            var change;
            for (var i = 0; i < d.children.length; i++ ) {
                if (d.children[i].attributes.name == "taskType") {
                    var values = d.children[i].firstChild;
                    for (var v = 0; v < values.children.length; v++ ) {
                        if (values.children[v].attributes.value == type) {
                            values.children[v].attributes.disabled = to.toString();
                        }
                        if (!selectedVal && values.children[v].attributes.disabled != "true") {
                            selectedVal = values.children[v];
                        }
                    }
                    if (to=="true" && (d.children[i].attributes.value == type )) { 
                        d.children[i].attributes.value = selectedVal.attributes.value;
                    }else {
                        selectedVal = null;
                    }
                }
            }

            if (selectedVal) {
                typeChange(selectedVal.attributes.value);
                if(selectedVal.attributes.enable){
                    var enable = selectedVal.attributes.enable.split(",");
                    var toEn = {};
                    for (var en = 0; en < enable.length; en++ ) {
                        toEn[enable[en]] = true;
                    }
                    setDisabledTo(toEn,false);
                }
                if(selectedVal.attributes.disable){
                    var disable = selectedVal.attributes.disable.split(",");
                    var toDi = {};
                    for (var di = 0; di < disable.length; di++ ) {
                        toDi[disable[di]] = true;
                    }
                    setDisabledTo(toDi,true);
                }
            }

        }
    }


    element.setDisabledTo=function(types, to, data) {
        if (!data) {
            data = (this.parent).getData();
        }
        for (var i = 0; i < data.children.length; i++ ) {
            if (types[data.children[i].attributes.name]) {
                data.children[i].attributes.disabled = to.toString();
            }
            setDisabledTo(types,to,data.children[i]);
        }
    }

    element.setColor=function(col) {
        if (col && col != "") {
            if (col.indexOf("#") == 0 && col.length==7) {
                //col = col.split("#")[1];
                //this.color = parseInt(col, 16);
				this.color = col;
            }
        }else {
            this.color = "#EBF4FF";
        }
        this.redrawCube();
    }
    
    


    facilis.TaskElement = facilis.promote(TaskElement, "ActivityElement");
    
}());