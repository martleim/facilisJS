(function() {

    function AbstractElement() {
        this.BaseElement_constructor();
        
        //private//

        this.setup();
    }
    
    //static public//
    
    
    var element = facilis.extend(AbstractElement, facilis.BaseElement);
    
    /*
        element.BaseClassSetup=element.setup;
    */
    element.setup = function() {
        //this.BaseClassSetup();
    } ;

    
    

    facilis.AbstractElement = facilis.promote(AbstractElement, "BaseElement");
    
}());