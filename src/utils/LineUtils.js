(function() {

    function LineUtils() {
        
    }
    
    LineUtils.dashTo=function(mc,startx, starty, endx, endy, len, gap) {
        var seglength, deltax, deltay, segs, cx, cy;
        seglength = len + gap;
        deltax = endx - startx;
        deltay = endy - starty;
        var delta = Math.sqrt((deltax * deltax) + (deltay * deltay));
        segs = Math.floor(Math.abs(delta / seglength));
        var radians = Math.atan2(deltay,deltax);
        cx = startx;
        cy = starty;
        deltax = Math.cos(radians)*seglength;
        deltay = Math.sin(radians)*seglength;
        for (var n = 0; n < segs; n++) {
            LineUtils.initGraphics(mc);
            mc.graphics.moveTo(cx,cy);
            mc.graphics.lineTo(cx+Math.cos(radians)*len,cy+Math.sin(radians)*len);
            cx += deltax;
            cy += deltay;
        }
        mc.graphics.moveTo(cx,cy);
        delta = Math.sqrt((endx-cx)*(endx-cx)+(endy-cy)*(endy-cy));
        if(delta>len){
            mc.graphics.lineTo(cx+Math.cos(radians)*len,cy+Math.sin(radians)*len);
        } else if(delta>0) {
            mc.graphics.lineTo(cx+Math.cos(radians)*delta,cy+Math.sin(radians)*delta);
        }
        mc.graphics.moveTo(endx,endy);
        mc.addChild(new facilis.Shape(mc.graphics));
    }

    LineUtils.dashDotTo=function(mc,startx, starty, endx, endy, len, gap) {
        var seglength, deltax, deltay, segs, cx, cy;
        seglength = len + gap +1 + gap;
        deltax = endx - startx;
        deltay = endy - starty;
        var delta = Math.sqrt((deltax * deltax) + (deltay * deltay));
        segs = Math.floor(Math.abs(delta / seglength));
        var radians = Math.atan2(deltay,deltax);
        cx = startx;
        cy = starty;
        deltax = Math.cos(radians)*seglength;
        deltay = Math.sin(radians)*seglength;
        for (var n = 0; n < segs; n++) {
            mc.graphics.moveTo(cx,cy);
            mc.graphics.lineTo(cx + Math.cos(radians) * len, cy + Math.sin(radians) * len);
            mc.graphics.moveTo(cx + ((Math.cos(radians) * len) + (Math.cos(radians) * gap)), cy + ((Math.sin(radians) * len) + (Math.sin(radians) * gap)) );
            mc.graphics.lineTo(cx + ((Math.cos(radians) * len) + (Math.cos(radians) * gap))+1, cy + ((Math.sin(radians) * len) + (Math.sin(radians) * gap))+1);
            cx += deltax;
            cy += deltay;
        }
        mc.graphics.moveTo(cx,cy);
        delta = Math.sqrt((endx-cx)*(endx-cx)+(endy-cy)*(endy-cy));
        if(delta>len){
            mc.graphics.lineTo(cx+Math.cos(radians)*len,cy+Math.sin(radians)*len);
        } else if(delta>0) {
            mc.graphics.lineTo(cx+Math.cos(radians)*delta,cy+Math.sin(radians)*delta);
        }
        mc.graphics.moveTo(endx,endy);
        mc.addChild(new facilis.Shape(mc.graphics));
    }


    LineUtils.dashCurveTo=function(mc, sx, sy, ex, ey, cx, cy, len, gap) {
        var dashed = new facilis.DashLine(mc, len, gap);
        dashed.moveTo(sx, sy);
        dashed.curveTo(ex, ey, cx, cy);
    }
    
    LineUtils.initGraphics=function(mc){
        if(!mc.graphics)
            mc.graphics=new facilis.Graphics();
    }
    

    facilis.LineUtils = LineUtils;
    
}());