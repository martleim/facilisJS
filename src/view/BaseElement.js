(function() {

    function BaseElement() {
        this.Container_constructor();
        this.addEventListener("removed",this.onRemove.bind(this));
		this.keepEventsOnRemove=false;
    }
    var element = facilis.extend(BaseElement, facilis.Container);
    facilis.BaseElement = facilis.promote(BaseElement, "Container");
    element.addShape=function(s){
        this.addChild(s);
    };
    
    element.onRemove=function(){
		if(!this.keepEventsOnRemove)
			this.removeAllEventListeners();
    }
    
    element.FindPointofIntersection=function(A, B, E, F/*, asSegment = true, RoundUp = false*/ ){
		
		A=new facilis.Point(A.x,A.y);
		B=new facilis.Point(B.x,B.y);
		E=new facilis.Point(E.x,E.y);
		F=new facilis.Point(F.x,F.y);
		
        var RoundUp=false;
        var asSegment=true;
        

        var a1= B.y-A.y;
        var b1= A.x-B.x;
        var c1= B.x*A.y - A.x*B.y;
        var a2= F.y-E.y;
        var b2= E.x-F.x;
        var c2= F.x*E.y - E.x*F.y;

        var Denominator=a1*b2 - a2*b1;
        if (Denominator == 0) {
            return null;
        }
        var ip = new facilis.Point();
        if (RoundUp)
        {
            ip.x = Math.round((b1 * c2 - b2 * c1) / Denominator);
            ip.y = Math.round((a2 * c1 - a1 * c2) / Denominator);
        }
        else
        {
            ip.x=(b1*c2 - b2*c1)/Denominator;
            ip.y = (a2 * c1 - a1 * c2) / Denominator;
        }		

        if (asSegment)
        {
            if(Math.pow(ip.x - B.x, 2) + Math.pow(ip.y - B.y, 2) > Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2))
            {
               return null;
            }

            if(Math.pow(ip.x - A.x, 2) + Math.pow(ip.y - A.y, 2) > Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2))
            {
               return null;
            }

            if(Math.pow(ip.x - F.x, 2) + Math.pow(ip.y - F.y, 2) > Math.pow(E.x - F.x, 2) + Math.pow(E.y - F.y, 2))
            {
               return null;
            }

            if(Math.pow(ip.x - E.x, 2) + Math.pow(ip.y - E.y, 2) > Math.pow(E.x - F.x, 2) + Math.pow(E.y - F.y, 2))
            {
               return null;
            }
        }
        return ip;
    }
    
    element.makeDegree=function(el,w,h){
        w=w||40;
        h=h||90;
        el.graphics=(el.graphics||new facilis.Graphics());
        el.graphics.beginLinearGradientFill(["rgba(0,0,0,0.15)","rgba(255,255,255,0.01)"],[.3,1],w,h,0,0);
    }
    
    
}());