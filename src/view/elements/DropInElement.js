(function() {

    function DropInElement() {
        this.SizableElement_constructor();
        
        //private//

        //this.setup();
    }
    
    //static public//
    
    
    var element = facilis.extend(DropInElement, facilis.SizableElement);
    
    element.SizableElementSetup=element.setup;
    element.setup = function() {
        this.SizableElementSetup();
        
        this.innerElements=[];
		this._innerElements=new facilis.BaseElement();
        
        this.addChild(this._innerElements);
        
    };
    
    
    element.addInnerElement=function(el) {
        for (var i = 0; i < this.innerElements.length; i++ ) {
            if (el==this.innerElements[i]) {
                return;
            }
        }
        el.setContainer(this.parent);
        this.innerElements.push(el);
        //_innerElements.addChild(el);
        this.addSubElement(el);
        this.sortInnerElements();
    }

    element.removeInnerElementIndex=function(index) {
        this.innerElements.splice(index, 1);
    }

    element.changeInnerElementPosition=function(index1, index2) {
        var auxSubEls = this.innerElements.slice(0, index1);
        var subElement = this.innerElements[index1];
        var auxSubEls2 = this.innerElements.slice(index1 + 1);

        var auxSubEls3 = [];
        auxSubEls3 = auxSubEls3.concat(auxSubEls, auxSubEls2);

        auxSubEls = auxSubEls3.slice(0, index2);
        auxSubEls2 = auxSubEls3.slice(index2);
        auxSubEls3 = [];
        auxSubEls3 = auxSubEls3.concat(auxSubEls, subElement, auxSubEls2);
        this.innerElements = auxSubEls3;
    }

    element.containsInnerElement=function(el)
    {
        /*for (var i = 0; i < this.innerElements.length; i++ ) {
            if (el==this.innerElements[i]) {
                return true;
            }
        }
        return false;*/
		this.innerElements.indexOf(el)>=0;
    }

    element.addSubElement=function(el) {

    }

    element.getInnerElements=function() {
        return this.innerElements;
    }

    element.sortInnerElements=function(){}

    element.hideAllInner=function() {
        for (var i = 0; i < this.innerElements.length; i++ ) {
            (this.innerElements[i]).visible = false;
        }
    }

    element.showAllInner=function() {
        for (var i = 0; i < this.innerElements.length; i++ ) {
            (this.innerElements[i]).visible = true;
        }
    }



    facilis.DropInElement = facilis.promote(DropInElement, "SizableElement");
    
}());