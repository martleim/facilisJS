(function() {

    function StartEventElement() {
        this.EventElement_constructor();
        
        
        this.setup();
    }
    
    //static public//
    
    
    var element = facilis.extend(StartEventElement, facilis.EventElement);
    
    element.EventElementSetup=element.setup;
    element.setup = function() {
        this.EventElementSetup();
        this.lineWidth						= 1.4; //AbstractElement.lineWidth;
        this.color							= "#C9E2BA"; //AbstractElement.color;
        this.lineColor						= "#339900"; //AbstractElement.lineColor;
        this.topColor = this.color;
        this.backColor = this.color;
        this.redrawCube();
    } ;


    element.setFirstTaskType=function(type) {
        //si start es msg la primera no puede ser receive, y sin in si es user o service
        if (type == "") {
            type = eventType;
        }
        if (type == "") {
            var d = (this.parent).getData();
            if (d) {
                d = d.firstChild;
                for (var u = 0; u < d.children.length; u++ ) {
                    if (d.children[u].attributes.name == "eventdetailtype") {
                        type = d.children[u].attributes.value;
                    }
                }
            }
        }
        var lines = View.getInstance().getLineView().getLinesStartingIn(this.parent);
        for (var i = 0; i < lines.length; i++ ) {
            disableConditionexpression((lines[i]));
            var endingElement = ((lines[i]).getEndElement());
            if (endingElement.elementType == "task" || endingElement.elementType == "csubflow") {
                endingElement.getElement().setFirstTask("true");
                endingElement.getElement().setStartType(type);
            }
        }
    }

    element.disableConditionexpression=function(line) {
        var data = line.getData();
        if (data && data.firstChild) {
            data = data.firstChild;
            for (var i = 0; i < data.children.length; i++ ) {
                if (data.children[i].attributes.name == "conditionexpression") {
                    data.children[i].removeNode();
                }
            }
        }
    }

    element.setReadonlyNone=function() {
        var lines = View.getInstance().getLineView().getLinesStartingIn(this.parent);
        for (var i = 0; i < lines.length; i++ ) {
            var data =   (lines[i]).getData();
            if (data && data.attributes.name == "sflow") {
                data = data.firstChild;
                for (var u = 0; u < data.children.length; u++ ) {
                    if (data.children[u].attributes.name == "conditiontype") {
                        data.children[u].attributes.readonly = "true";
                        data.children[u].attributes.type = "text";
                        data.children[u].attributes.value = "None";
                    }
                }
            }
        }
    }
    
    
    facilis.StartEventElement = facilis.promote(StartEventElement, "EventElement");
    
}());