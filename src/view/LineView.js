(function() {

    function LineView() {
        this.AbstractView_constructor();
        
        if (!LineView.allowInstantiation) {
            throw new Error("Error: Instantiation failed: Use SingletonDemo.getInstance() instead of new.");
        }

    }
    
    LineView._instance=null;
    LineView.allowInstantiation=false;
    LineView.getInstance=function(){
        if (LineView._instance == null) {
            LineView.allowInstantiation = true;
            LineView._instance = new facilis.LineView();
            LineView._instance.appendMe();
            LineView.allowInstantiation = false;
        }
        return LineView._instance;
    }
    
    
    var element = facilis.extend(LineView, facilis.AbstractView);
    
    element.AbstractViewSetup=element.setup;
    element.setup = function() {
        this.AbstractViewSetup();
    };
    
    element.appendMe=function() {
        facilis.View.getInstance()._stage.addChild(LineView._instance);
    }

    element.getExportData=function(){ 
        var els = [];
        for (var i = 0; i<this.elements.length; i++) {
            var el = this.elements[i].getExportData();
            if (el) {
                els.push(el);
            }
        }
        return els;
    }

    
    element.addLine=function(s, e) {
        if (this.isValidLine(s, e)) {
            var line = this.getNewLine(s, e);
            this.addElement(line);
            line.refreshWholeLine();
            return line;
        }
        return null;
    }

    element.getLine=function(s, e) {
        if (this.isValidLine(s, e)) {
            var line = this.getNewLine(s, e);
            line.refreshWholeLine();
            return line;
        }
        return null;
    }

    element.addALine=function(line) {
        if (line) {
            this.addElement(line);
            line.refreshWholeLine();
            return line;
        }
        return null;
    }

    element.getNewLine=function(s, e) {
        if (this.isValidLine(s, e)) {
            var line = new facilis.LineObject(s, e);
            line.addEventListener(facilis.LineObject.VERTEXES_CHANGED, this.dispatchOut.bind(this));
            line.addEventListener(facilis.LineObject.VERTEXES_TO_CHANGE, this.dispatchOut.bind(this));
            return line;
        }
        return null;
    }

    element.isValidLine=function(s, e) {
        if (s==null || e==null) {
            return false;
        }
        for (var i = 0; i < this.elements.length; i++ ) {
            var line = this.elements[i];
            if ( (line.startElement==s && line.lastElement==e) /*||
                (line.startElement==e && line.lastElement==s)*/ ) {
                return false;
            }
        }
        return true;
    }

    element.appendMe=function() {
        facilis.View.getInstance()._stage.addChild(LineView._instance);
    }
    
    element.getLinesOf=function(e) {
        var lines = [];
        for (var i = 0; i < this.elements.length;i++ ) {
            if ( (this.elements[i]).startElement === e ||
            (this.elements[i]).lastElement === e) {
                lines.push(this.elements[i]);
            }
        }
        return lines;
    }

    element.getLinesStartingIn=function(e) {
        var lines = [];
        for (var i = 0; i < this.elements.length;i++ ) {
            if ( (this.elements[i]).startElement === e) {
                lines.push(this.elements[i]);
            }
        }
        return lines;
    }

    element.getLinesEndingIn=function(e) {
        var lines = [];
        for (var i = 0; i < this.elements.length;i++ ) {
            if ( (this.elements[i]).lastElement === e) {
                lines.push(this.elements[i]);
            }
        }
        return lines;
    }
    

    facilis.LineView = facilis.promote(LineView, "AbstractView");
    
}());