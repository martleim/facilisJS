(function() {

    function MultiSelect() {
        this.BaseElement_constructor();
        
        //private//

        this.setup();
    }
    
    //static public//
    
    
    var element = facilis.extend(MultiSelect, facilis.BaseElement);
    
    
    element.setup = function() {
        //this.BaseClassSetup();
    };
    
    element.onAddedToStage=function(e) {
        this.removeEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
        clickableArea.addEventListener(MouseEvent.MOUSE_DOWN, onmouseDown);
    }

    element.onmouseDown=function(e) {
        if (MultiSelect.MULTISELECT_ENABLED && Key.isDown(Keyboard.SHIFT)) {
            this.dispatchEvent(new Event(MultiSelect.ON_START));
            clickableArea.stage.addEventListener(MouseEvent.MOUSE_MOVE, onmouseMove);
            clickableArea.stage.addEventListener(MouseEvent.MOUSE_UP, onmouseUp);
            startX = this.mouseX;
            startY = this.mouseY;
        }
    }
    element.onmouseMove=function(e) {
        this.graphics.clear();
        this.graphics.beginFill(0xAABBAA, 0);
        this.graphics.lineStyle(1, 0xAABBAA, .6);
        var sX = (startX < this.mouseX)?startX:this.mouseX;
        var sY = (startY < this.mouseY)?startY:this.mouseY;
        var w = Math.abs(startX - this.mouseX)+2;
        var h = Math.abs(startY - this.mouseY) + 2;
        sX -= 2;
        sY -= 2;
        this.graphics.drawRect(sX, sY, w, h);
        _selectionRectangle = new Rectangle(sX, sY, w, h);
        this.graphics.endFill();
    }
    element.onmouseUp=function(e) {
        this.graphics.clear();
        clickableArea.stage.removeEventListener(MouseEvent.MOUSE_MOVE, onmouseMove);
        clickableArea.stage.removeEventListener(MouseEvent.MOUSE_UP, onmouseUp);
        this.dispatchEvent(new Event(MultiSelect.ON_SELECT));
    }
    
    
    Object.defineProperty(element, 'selectionRectangle', {
        get: function() { 
            return this._selectionRectangle;
        },
        set: function(val){
            this._selectionRectangle = rect;
        }
    });



    facilis.MultiSelect = facilis.promote(MultiSelect, "BaseElement");
    
}());