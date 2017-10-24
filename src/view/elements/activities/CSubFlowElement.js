(function() {

    function CSubFlowElement() {
        this.FlowElement_constructor();
        
        //private//

    }
    
    //static public//
    
    
    var element = facilis.extend(CSubFlowElement, facilis.FlowElement);
    
    element.FlowElementSetup=element.setup;
    element.setup = function() {
        this.FlowElementSetup();
        
        var className = "icons.activities.CollapsedIcon";
        var icon = facilis.IconManager.getInstance().getIcon(className);
        this.addSubIcon(icon);
        this._hitArea=new facilis.BaseElement();
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
    
    element.setEnableEntity=function(val) {
        var d = (this.parent).getData();
        if(d){
            var bpmn = d.firstChild;
            var apia = d.children[1];
            var subprocesstype = "";
            var skipfirsttask = "";
            for (var i = 0; i < bpmn.children.length; i++ ) {
                if (bpmn.children[i].attributes.name=="subprocesstype") {
                    subprocesstype = bpmn.children[i].attributes.value;
                }
                if (bpmn.children[i].attributes.name=="skipfirsttask") {
                    skipfirsttask = bpmn.children[i].attributes.value;
                }
            }
            var disabled = "true";
            if (skipfirsttask != "true" && subprocesstype == "Reusable") {
                disabled = "false";
            }
            for (var u = 0; u<apia.children.length; u++ ) {
                if (apia.children[u].attributes.name=="entity") {
                    apia.children[u].attributes.disabled = disabled;
                }
            }
            View.getInstance().refreshElementAttributes();
        }
    }

    element.setColor=function(col) {
        if (col && col != "") {
            if (col.indexOf("#") == 0 && col.length==7) {
                col = col.split("#")[1];
                color = parseInt(col, 16);
            }
        }else {
            color = "#EBF4FF";
        }
        redrawCube();
    }



    facilis.CSubFlowElement = facilis.promote(CSubFlowElement, "FlowElement");
    
}());