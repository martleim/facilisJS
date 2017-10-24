(function() {

    function Graphics() {
        this.BaseGraphics_constructor();
        this.moveTo(0,0);
    }
    
    var element = facilis.extend(Graphics, PIXI.Graphics);
    facilis.EventDispatcher.initialize(element);
    
    /*element.baseLineStyle=element.lineStyle;
    element.lineStyle = function( lineWidth, color, alpha ){
        lineWidth=lineWidth||1;
        color=this.parseColor(color);
        alpha=1;
        if(color.length>7){
            alpha=color.substr(8);
            color=color.substr(0,8);
        }
        this.baseLineStyle(lineWidth,color,alpha.toString(10));
    }*/
    
    element.drawRoundRect=function( x , y , width , height , radius, radius2 ){
        radius=(radius+radius2)/2;
        this.moveTo(0,0);
        //this.drawRoundedRect( x , y , width , height , radius );
        this.drawRect( x , y , width , height);
    }
    
    element.curveTo=element.quadraticCurveTo;
    
    element.baseBeginFill=element.beginFill;
    element.beginFill = function(color){
        color=this.parseColor(color);
        var alpha=1;
        if(color.length>7){
            alpha=color.substr(8);
            color=color.substr(0,8);
        }
        
        this.baseBeginFill(color,alpha.toString(10));
    }
	
	element.beginLinearGradientFill=function(c,ca,w,h,x,y){
		this.beginFill(c[0]);
	}
    
    element.parseColor=function(color){
        if(color && color.indexOf("rgb")>=0){
            var a = color.split("(")[1].split(")")[0];
            a = a.split(",");
            var b = a.map(function(x){             
                if(x<1)
                    x=Math.round(255*x);
                
                x = parseInt(x).toString(16);      //Convert to a base16 string
                return (x.length==1) ? "0"+x : x;  //Add zero if we get only one character
            });
            color = "0x"+b.join("");
        }else if(color && color.indexOf("#")>=0){
            color=color.replace("#","0x");
        }else{
            color=0xFFFFFF;
        }
        return color;
    }
    
    facilis.Graphics = facilis.promote(Graphics, "BaseGraphics");
    
}());