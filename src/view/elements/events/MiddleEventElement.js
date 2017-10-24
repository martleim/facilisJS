(function() {

    function MiddleEventElement() {
        this.EventElement_constructor();
        
        //private//

        this.setup();
    }
    
    //static public//
    
    
    var element = facilis.extend(MiddleEventElement, facilis.EventElement);
    
    element.EventElementSetup=element.setup;
    element.setup = function() {
        this.EventElementSetup();
        
        this.lineWidth						= 1.4; //AbstractElement.lineWidth;
        this.color							= "#F1F0B1"; //AbstractElement.color;
        this.lineColor						= "#FFCC00"; //AbstractElement.lineColor;
        this.topColor = this.color;
        this.backColor = this.color;
        this.topLineAlpha=1;
        this.redrawCube();
    };
    
    
    
    
    
    element.setTypeDisabled=function(type, to) {
        var d = (this.parent).getData();
        if (d) {
			var eventdetailtype=d.eventdetailtype;
			console.log("FIX FOR TYPE DISALBLED");
			return;
            d = d.firstElementChild;
            var values;
            for (var i = 0; i < d.children.length; i++) {
                if (d.children[i].getAttribute("name") == "eventdetailtype") {
                    //var eventdetailtype = d.children[i];
                    values = d.children[i].firstElementChild;
                    break;
                }
            }
            i = 0;
            if (values) {
                var firstNotDis = null;
                for (i = 0; i < values.children.length; i++) {
                    if (values.children[i].getAttribute("value") == type) {
                        values.children[i].setAttribute("disabled", to + "");
                    }else if (firstNotDis == null &&  values.children[i].getAttribute("disabled") != "true") {
                        firstNotDis = values.children[i];
                    }
                }
				if(!facilis.view.View.loading_xpdl) {
					if (values.parentNode.getAttribute("value") == type && to == "true") {
						values.parentNode.setAttribute("value", firstNotDis.getAttribute("value"));
						typeChange(firstNotDis.getAttribute("value"));
					}
				}
            }
        }
    }

    element.setThrowCatchNode=function(to) {
        to = (to + "").toLowerCase();
        var d = (this.parent).getData().firstElementChild;
        var messagecatch;
        var messagethrow;
        var value = "";
        for (var i = 0; i < d.children.length; i++) {
            if (d.children[i].getAttribute("name") == "message") {
                var message = d.children[i].firstElementChild;
                for (var m = 0; m < message.children.length; m++ ) {
                    if (message.children[m].getAttribute("name") == "catchthrow") {
                        message.children[m].setAttribute("disabled", to);
                        value = message.children[m].getAttribute("value");
                    }
                    if (message.children[m].getAttribute("name")=="messagecatch") {
                        messagecatch = message.children[m];
                    }
                    if (message.children[m].getAttribute("name") == "messagethrow") {
                        messagethrow = message.children[m];
                    }
                }
                //d.children[i].setAttribute("disabled", to);
                break;
            }
        }
    }

    element.disableLineConditions=function() {
        var hide = "None";
		console.log("element.disableLineConditions");
		return;
        if ((this.parent).getData().firstElementChild.children[0].getAttribute("value") != "TRUE") {
        //	hide = "CONDITION";
        }
        var lines = facilis.View.getInstance().getLineView().getLinesStartingIn(this.parent);
        for (var l = 0; l < lines.length; l++ ) {
            var d = (lines[l]).getData();
            if (d) {
                d = d.firstElementChild;
                for (var i = 0; i < d.children.length; i++) {
                    if (d.children[i].getAttribute("type")=="text" && d.children[i].getAttribute("name") == "conditiontype") {
                        //d.children[i].setAttribute("hidden", hide);
                        d.children[i].setAttribute("value", hide);
                    }
                }
            }
        }
    }

    element.disableInLineConditions=function() {
        var hide = "None";
		console.log("element.disableInLineConditions");
		return;
        if ((this.parent).getData().firstElementChild.children[0].getAttribute("value") != "TRUE") {
            //hide = "CONDITION";
        }
        var lines = facilis.View.getInstance().getLineView().getLinesEndingIn(this.parent);
        for (var l = 0; l < lines.length; l++ ) {
            var d = (lines[l]).getData();
            if (d) {
                d = d.firstElementChild;
                for (var i = 0; i < d.children.length; i++) {
                    if (d.children[i].getAttribute("name") == "conditiontype") {
                        //d.children[i].setAttribute("hidden", hide);
                        d.children[i].setAttribute("value", hide);
                        d.children[i].setAttribute("readonly", "true");
                        d.children[i].setAttribute("type", "text");
                    }
                }
            }
        }
    }

    element.setReadonlyNone=function() {
        var lines = facilis.View.getInstance().getLineView().getLinesStartingIn(this.parent);
        for (var i = 0; i < lines.length; i++ ) {
            var data =   (lines[i]).getData();
            if (data && facilis.getClassName(data).toLowerCase() == "sflow") {
				if(data.conditiontype!=null)
					data.conditiontype="None";
				
				console.log("SET DISABLED TO CONDITIO NTYPE");
                /*data = data.firstElementChild;
                for (var u = 0; u < data.children.length; u++ ) {
                    if (data.children[u].getAttribute("name") == "conditiontype") {
                        data.children[u].setAttribute("readonly", "true");
                        data.children[u].setAttribute("type", "text");
                        data.children[u].setAttribute("value", "None");
                    }
                }*/
            }
        }
    }
    


    facilis.MiddleEventElement = facilis.promote(MiddleEventElement, "EventElement");
    
}());