(function() {

    function AbstractRule() {
        this.BaseElement_constructor();
        
        //private//

        this.setup();
    }
	
	AbstractRule.RULE_LODADED 			= "onRuleLoaded";
		
    //static public//
    
    
    var element = facilis.extend(AbstractRule, facilis.BaseElement);
	
	element.init=function(){}
	element.validate=function(els) { return false; }
	element.getPossible=function(el) { return null; }

    
    /*
        element.BaseClassSetup=element.setup;
    */
    element.setup = function() {
        //this.BaseClassSetup();
    } ;


    facilis.validation.AbstractRule = facilis.promote(AbstractRule, "BaseElement");
    
}());