(function() {

    function AbstractLane() {
        this.DropInElement_constructor();
        
        this.FONT_COLOR = "#333333";
		this.FONT_SIZE = "10";
		this.FONT_FACE = "Tahoma";

        //this.setup();
    }
    
    //static public//
    
    
    var element = facilis.extend(AbstractLane, facilis.DropInElement);
    
    element.DropInElementSetup=element.setup;
    element.setup = function() {
        this.sizable=true;
        this.DropInElementSetup();
        
        this._width = 300;
        this._height = 160;
        this._icon = new facilis.BaseElement();
        this.addChild(this._icon);

        this.txtName = new facilis.ElementText();
        /*this.txtName.selectable = false;
        this.txtName.multiline = true;
        this.txtName.wordWrap = true;

        var myformat:TextFormat = new TextFormat("Tahoma",10,FONT_COLOR);
        myformat.align = "center";
        txtName.defaultTextFormat=myformat;
        txtName.antiAliasType = AntiAliasType.ADVANCED;
        */
        this.addChild(this.txtName);

        this.redrawCube();
        /*try{
        var tahoma:Class = LibraryManager.getInstance().getClass("fonts.EmbedTahoma") as Class;
        Font.registerFont(tahoma);
        }catch(e){}*/
    };
    
    element.setSize = function(width, height) {
        this._width = width;
        this._height = height;
        this.redrawCube();
        this.alignText();
    }

    element.redrawCube = function() {
        this._icon.removeAllChildren();
        if(!this._icon.graphics)
            this._icon.graphics=new facilis.Graphics();
        
        this._icon.graphics.clear();
        this._icon.graphics.lineStyle(2,"rgb(0,0,0,0)");
        //_icon.graphics.beginFill(0xFFFFFF, 0); 
        this._icon.graphics.drawRect(0, 0, this._width, this._height);
        //_icon.graphics.endFill();
        this._icon.graphics.lineStyle(2,"rgb(0,0,0,.5)");
        facilis.LineUtils.dashTo(this._icon, 0, 0, this._width, 0, 5, 5);
        facilis.LineUtils.dashTo(this._icon, this._width, 0, this._width, this._height, 5, 5);
        facilis.LineUtils.dashTo(this._icon, this._width, this._height, 0, this._height, 5, 5);
        facilis.LineUtils.dashTo(this._icon, 0, this._height, 0, 0, 5, 5);
        
        this._icon.addShape(new facilis.Shape(this._icon.graphics));

        this.alignText();
    }

    element.setName = function(name) {
        this.txtName.text = name;
        this.txtName.embedFonts = true;

        this.alignText();
    }
    element.alignText = function() {
        
        this.txtName.textAlign="center";
        //this.txtName.textBaseline="hanging";
        
        //txtName.autoSize = TextFieldAutoSize.CENTER;
        //txtName.y = (_height / 2) - (txtName.height / 2);
        this.txtName.lineWidth = (this._height);
        
        this.txtName.y = this._height/2;
        this.txtName.width = (this._height);
        this.txtName.height = 30;
        this.txtName.rotation = -90;
        this.txtName.x = 0;
		this.refreshCache();
    }


    facilis.AbstractLane = facilis.promote(AbstractLane, "DropInElement");
    
}());