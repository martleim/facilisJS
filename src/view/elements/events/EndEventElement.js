(function() {

    function EndEventElement() {
        this.EventElement_constructor();
        
        //private//

        this.setup();
    }
    
    //static public//
    
    
    var element = facilis.extend(EndEventElement, facilis.EventElement);
    
    element.EventElementSetup=element.setup;
    element.setup = function() {
        this.EventElementSetup();
        
        this.lineWidth						= 1.4; //AbstractElement.lineWidth;
        this.color							= "#E9BABA"; //AbstractElement.color;
        this.lineColor						= "#CC0000"; //AbstractElement.lineColor;
        this.topColor = this.color;
        this.backColor = this.color;
        this.topLineAlpha=1;
        this.redrawCube();
    } ;


    facilis.EndEventElement = facilis.promote(EndEventElement, "EventElement");
    
}());