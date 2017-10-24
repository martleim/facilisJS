(function() {

    function ElementText() {
        this.BaseElement_constructor();
        
        this.textField=null;

        this.setup();
    }
    
    
    
    var element = facilis.extend(ElementText, facilis.BaseElement);

    element.setup = function() {
        
        this.textField = new facilis.Text(" ", "10px Arial", "#000");
        this.addChild(this.textField);
        //clickBlocker = new Sprite();
        //this.addChild(clickBlocker);
        this.text = " ";
        this.text = "";
        
    };
    
    Object.defineProperty(element, 'text', {
        set: function(newValue) { 
            this.textField.text = newValue?newValue:"";
        }
    });
    
    /*element.baseWidth=element.width;
    element.width=null;*/
    Object.defineProperty(element, 'width', {
        get: function() { return this.baseWidth; },
        set: function(newValue) { 
            this.baseWidth = newValue;
            this.textField.lineWidth = newValue;
            this.textField.width = newValue; 
        }
    });
    
    /*element.baseHeight=element.height;
    element.height=null;*/
    Object.defineProperty(element, 'height', {
        get: function() { return this.baseHeight; },
        set: function(newValue) { 
            this.baseHeight = newValue;
            var b = this.textField.getBounds();
            this.textField.y=(newValue-((b)?b.height:0))/2;
            this.textField.height = newValue; 
            //this.textField.lineHeight = 15;
        }
    });
    
    Object.defineProperty(element, 'textAlign', {
        get: function() { return this.textField.textAlign; },
        set: function(newValue) { 
            this.textField.textAlign = newValue; 
        }
    });
    
    
    

    facilis.ElementText = facilis.promote(ElementText, "BaseElement");
    
}());