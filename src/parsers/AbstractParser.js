(function() {

    function AbstractParser() {
        //private//

        this.setup();
    }
    
    //static public//
    
    
    var element = facilis.extend(AbstractParser, {});
    
    /*
        element.BaseClassSetup=element.setup;
    */
    element.setup = function() {
        //this.BaseClassSetup();
    } ;


    facilis.parser.AbstractParser = facilis.promote(AbstractParser, "Object");
    
}());