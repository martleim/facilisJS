(function() {

    function FlowElement() {
        this.ActivityElement_constructor();
        
        this.transactionIcon;
		this.transaction=false;

    }
    
    //static public//
    
    
    var element = facilis.extend(FlowElement, facilis.ActivityElement);
    
    element.ActivityElementSetup=element.setup;
    element.setup = function() {
        this.transactionIcon = new facilis.BaseElement();
        this.addChild(this.transactionIcon);
        this.ActivityElementSetup();
        this.typeChange("");
    };

    element.transactionChange=function(trans) {
        transaction = (trans == "true");
        this.redrawCube();
    }

    element.typeChange=function(type) {
        //var icon = "icons.processType.EmbeddedProcess";

        var icon = "";
        var current_filters = this.filters;

        if (this.border_filter) {
            var i = current_filters.indexOf(this.border_filter);
            current_filters.splice(i, 1);
            this.filters = current_filters;
        } else {
            this.filters = [];
            this.border_filter = null;
        }

        switch (type){
            case "Reusable":
                //icon = "icons.processType.ReusableProcess";
                var filt = new GlowFilter();
                filt.color = 0x000000;
                filt.blurX = 1.5;
                filt.blurY = 1.5;
                filt.strength = 255;

                //Los filtros no se agregan directamente al array, por convecion de as3					
                current_filters.push(filt);
                this.filters = current_filters;

                this.border_filter = filt;

                break;
            case "Reference":
                //icon = "icons.processType.ReferenceProcess";
                break;
        }

        if (this.typeIcon) {
            this.removeTopIcon(this.typeIcon);
            this.typeIcon = null;
        }
        if (icon != "") {
            this.typeIcon = (LibraryManager.getInstance().getInstancedObject(icon));
            this.addTopIcon(this.typeIcon);
        }
    }

    element.adhocChange=function(adhoc) {
        var icon = "";

        if (this.adhoc == "true") {
            this.icon = "icons.adhoc.AdhocProcess";			
        }

        if (this.adhocIcon) {
            this.removeSubicon(adhocIcon);
            this.adhocIcon = null;
        }

        if (icon != "") {
            adhocIcon = (LibraryManager.getInstance().getInstancedObject(icon));
            this.addSubIcon(adhocIcon);
            adhocIcon.parent.setChildIndex(adhocIcon, 0);
            positionIcons();
        }
    }

    element.redrawCube=function() {
        if(!this._icon.graphics)
           this._icon.graphics=new facilis.Graphics();
        
        if(!this.transactionIcon.graphics)
           this.transactionIcon.graphics=new facilis.Graphics();
           
        this._icon.removeAllChildren();
        this._icon.graphics.clear();
        this._icon.graphics.lineStyle(this.lineWidth,this.lineColor);
        this._icon.graphics.beginFill(this.color); 
        this._icon.graphics.drawRoundRect(0, 0, this._width, this._height, this.radius, this.radius);
        this._icon.graphics.endFill();
        this.makeDegree(this._icon);
        this._icon.graphics.drawRoundRect(0, 0, this._width, this._height, this.radius, this.radius);
        this._icon.graphics.endFill();
        
        this.transactionIcon.removeAllChildren();
        this.transactionIcon.graphics.clear();
        if (this.transaction) {
            this.transactionIcon.graphics.lineStyle(this.lineWidth, this.lineColor); 
            this.transactionIcon.graphics.drawRoundRect(-3, -3, this._width+6, this._height+6, this.radius, this.radius);
            this.transactionIcon.addShape(new facilis.Shape(this.transactionIcon.graphics));
        }
        this._icon.addShape(new facilis.Shape(this._icon.graphics));
        this.positionIcons();
        
        this.setCached(true);
    }

    facilis.FlowElement = facilis.promote(FlowElement, "ActivityElement");
    
}());
