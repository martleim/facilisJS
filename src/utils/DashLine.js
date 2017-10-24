(function() {

    function DashLine(target, onLength, offLength){
        this.element=target;
        if(!this.element.graphics)
            this.element.graphics=new facilis.Graphics();
            
        this.target = this.element.graphics;
        this.isLine = true;
        this.overflow = 0;
        this._curveaccuracy=6;
        this.pen = {x:0, y:0};
        
        //static public//

        this.setDash=function(onLength, offLength) {
            this.onLength = onLength;
            this.offLength = offLength;
            this.dashLength = this.onLength + this.offLength;
        }
        
        this.getDash=function() {
            return [this.onLength, this.offLength];
        }
        
        this.moveTo=function(x, y) {
            this.targetMoveTo(x, y);
        }

        
        this.lineTo=function(x,y) {
            var dx = x-this.pen.x,	dy = y-this.pen.y;
            var a = Math.atan2(dy, dx);
            var ca = Math.cos(a), sa = Math.sin(a);
            var segLength = this.lineLength(dx, dy);
            if (this.overflow){
                if (this.overflow > segLength){
                    if (this.isLine) this.targetLineTo(x, y);
                    else this.targetMoveTo(x, y);
                    this.overflow -= segLength;
                    return;
                }
                if (this.isLine) this.targetLineTo(this.pen.x + ca*this.overflow, this.pen.y + sa*this.overflow);
                else this.targetMoveTo(this.pen.x + ca*this.overflow, this.pen.y + sa*this.overflow);
                segLength -= this.overflow;
                this.overflow = 0;
                this.isLine = !this.isLine;
                if (!segLength) return;
            }
            var fullDashCount = Math.floor(segLength/this.dashLength);
            if (fullDashCount){
                var onx = ca*this.onLength,	ony = sa*this.onLength;
                var offx = ca*this.offLength,	offy = sa*this.offLength;
                for (var i=0; i<fullDashCount; i++){
                    if (this.isLine){
                        this.targetLineTo(this.pen.x+onx, this.pen.y+ony);
                        this.targetMoveTo(this.pen.x+offx, this.pen.y+offy);
                    }else{
                        this.targetMoveTo(this.pen.x+offx, this.pen.y+offy);
                        this.targetLineTo(this.pen.x+onx, this.pen.y+ony);
                    }
                }
                segLength -= this.dashLength*fullDashCount;
            }
            if (this.isLine){
                if (segLength > this.onLength){
                    this.targetLineTo(this.pen.x+ca*this.onLength, this.pen.y+sa*this.onLength);
                    this.targetMoveTo(x, y);
                    this.overflow = this.offLength-(segLength-this.onLength);
                    this.isLine = false;
                }else{
                    this.targetLineTo(x, y);
                    if (segLength == this.onLength){
                        this.overflow = 0;
                        this.isLine = !this.isLine;
                    }else{
                        this.overflow = this.onLength-segLength;
                        this.targetMoveTo(x, y);
                    }
                }
            }else{
                if (segLength > this.offLength){
                    this.targetMoveTo(this.pen.x+ca*this.offLength, this.pen.y+sa*this.offLength);
                    this.targetLineTo(x, y);
                    this.overflow = this.onLength-(segLength-this.offLength);
                    this.isLine = true;
                }else{
                    this.targetMoveTo(x, y);
                    if (segLength == this.offLength){
                        this.overflow = 0;
                        this.isLine = !this.isLine;
                    }else this.overflow = this.offLength-segLength;
                }
            }
            this.update();
        }
        
        this.curveTo=function(cx, cy, x, y) {
            var sx = this.pen.x;
            var sy = this.pen.y;
            var segLength = this.curveLength(sx, sy, cx, cy, x, y);
            var t = 0;
            var t2 = 0;
            var c;
            if (this.overflow){
                if (this.overflow > segLength){
                    if (this.isLine) this.targetCurveTo(cx, cy, x, y);
                    else this.targetMoveTo(x, y);
                    this.overflow -= segLength;
                    return;
                }
                t = this.overflow/segLength;
                c = this.curveSliceUpTo(sx, sy, cx, cy, x, y, t);
                if (this.isLine) this.targetCurveTo(c[2], c[3], c[4], c[5]);
                else this.targetMoveTo(c[4], c[5]);
                this.overflow = 0;
                this.isLine = !this.isLine;
                if (!segLength) return;
            }
            var remainLength = segLength - segLength*t;
            var fullDashCount = Math.floor(remainLength/this.dashLength);
            var ont = this.onLength/segLength;
            var offt = this.offLength/segLength;
            if (fullDashCount){
                for (var i=0; i<fullDashCount; i++){
                    if (this.isLine){
                        t2 = t + ont;
                        c = this.curveSlice(sx, sy, cx, cy, x, y, t, t2);
                        this.targetCurveTo(c[2], c[3], c[4], c[5]);
                        t = t2;
                        t2 = t + offt;
                        c = this.curveSlice(sx, sy, cx, cy, x, y, t, t2);
                        this.targetMoveTo(c[4], c[5]);
                    }else{
                        t2 = t + offt;
                        c = this.curveSlice(sx, sy, cx, cy, x, y, t, t2);
                        this.targetMoveTo(c[4], c[5]);
                        t = t2;
                        t2 = t + ont;
                        c = this.curveSlice(sx, sy, cx, cy, x, y, t, t2);
                        this.targetCurveTo(c[2], c[3], c[4], c[5]);
                    }
                    t = t2;
                }
            }
            remainLength = segLength - segLength*t;
            if (this.isLine){
                if (remainLength > this.onLength){
                    t2 = t + ont;
                    c = this.curveSlice(sx, sy, cx, cy, x, y, t, t2);
                    this.targetCurveTo(c[2], c[3], c[4], c[5]);
                    this.targetMoveTo(x, y);
                    this.overflow = this.offLength-(remainLength-this.onLength);
                    this.isLine = false;
                }else{
                    c = this.curveSliceFrom(sx, sy, cx, cy, x, y, t);
                    this.targetCurveTo(c[2], c[3], c[4], c[5]);
                    if (segLength == this.onLength){
                        this.overflow = 0;
                        this.isLine = !this.isLine;
                    }else{
                        this.overflow = this.onLength-remainLength;
                        this.targetMoveTo(x, y);
                    }
                }
            }else{
                if (remainLength > this.offLength){
                    t2 = t + offt;
                    c = this.curveSlice(sx, sy, cx, cy, x, y, t, t2);
                    this.targetMoveTo(c[4], c[5]);
                    c = this.curveSliceFrom(sx, sy, cx, cy, x, y, t2);
                    this.targetCurveTo(c[2], c[3], c[4], c[5]);

                    this.overflow = this.onLength-(remainLength-this.offLength);
                    this.isLine = true;
                }else{
                    this.targetMoveTo(x, y);
                    if (remainLength == this.offLength){
                        this.overflow = 0;
                        this.isLine = !this.isLine;
                    }else this.overflow = this.offLength-remainLength;
                }
            }
            this.update();
        }
        
        this.clear=function() {
            this.target.clear();
            this.update();
        }

        
        this.lineStyle=function(thickness,rgb,alpha) {
            this.target.lineStyle(thickness,rgb,alpha);
        }
        
        this.beginFill=function(rgb,alpha) {
            this.target.beginFill(rgb,alpha);
        }
        
        this.beginGradientFill=function(fillType,colors,alphas,ratios,matrix) {
            this.target.beginGradientFill(fillType,colors,alphas,ratios,matrix);
        }
        
        this.endFill=function() {
            this.target.endFill();
            this.update();
        }

        
        this.lineLength=function(sx, sy) {
            if(arguments.length>2){
                return Math.sqrt(sx*sx + sy*sy);
            } else {
                var ex = arguments[2];
                var ey = arguments[3];
            }
            var dx = ex - sx;
            var dy = ey - sy;
            return Math.sqrt(dx*dx + dy*dy);
        }
        this.curveLength=function(sx, sy, cx, cy, ex, ey) {
            var total = 0;
            var tx = sx;
            var ty = sy;
            var px, py, t, it, a, b, c;
            var n = arguments[6] != null ? arguments[6] : this._curveaccuracy;
            for (var i = 1; i<=n; i++){
                t = i/n;
                it = 1-t;
                a = it*it; b = 2*t*it; c = t*t;
                px = a*sx + b*cx + c*ex;
                py = a*sy + b*cy + c*ey;
                total += this.lineLength(tx, ty, px, py);
                tx = px;
                ty = py;
            }
            return total;
        }
        
        this.curveSlice=function(sx, sy, cx, cy, ex, ey, t1, t2) {
            if (t1 == 0) return this.curveSliceUpTo(sx, sy, cx, cy, ex, ey, t2);
            else if (t2 == 1) return this.curveSliceFrom(sx, sy, cx, cy, ex, ey, t1);
            var c = this.curveSliceUpTo(sx, sy, cx, cy, ex, ey, t2);
            c.push(t1/t2);
            return this.curveSliceFrom.apply(this, c);
        }
        
        this.curveSliceUpTo=function(sx, sy, cx, cy, ex, ey, t) {
            t=(t||0);
            
            if (t == 0) t = 1;
            if (t != 1) {
                var midx = cx + (ex-cx)*t;
                var midy = cy + (ey-cy)*t;
                cx = sx + (cx-sx)*t;
                cy = sy + (cy-sy)*t;
                ex = cx + (midx-cx)*t;
                ey = cy + (midy-cy)*t;
            }
            return [sx, sy, cx, cy, ex, ey];
        }
        
        this.curveSliceFrom=function(sx, sy, cx, cy, ex, ey, t) {
            t=(t||0);
            
            if (t == 0) t = 1;
            if (t != 1) {
                var midx = sx + (cx-sx)*t;
                var midy = sy + (cy-sy)*t;
                cx = cx + (ex-cx)*t;
                cy = cy + (ey-cy)*t;
                sx = midx + (cx-midx)*t;
                sy = midy + (cy-midy)*t;
            }
            return [sx, sy, cx, cy, ex, ey];
        }

        this.targetMoveTo=function(x, y) {
            this.pen = {x:x, y:y};
            this.target.moveTo(x, y);
            this.update();
        }
        
        this.targetLineTo=function(x, y) {
            if (x == this.pen.x && y == this.pen.y) return;
            this.pen = {x:x, y:y};
            this.target.lineTo(x, y);
            this.update();
        }
        
        this.targetCurveTo=function(cx, cy, x, y) {
            if (cx == x && cy == y && x == this.pen.x && y == this.pen.y) return;
            this.pen = {x:x, y:y};
            this.target.curveTo(cx, cy, x, y);
            this.update();
        }
        
        this.update=function(){
            this.element.removeAllChildren();
            this.element.addChild(new facilis.Shape(this.target.graphics));
        }
        
        this.setDash(onLength, offLength);
    }
    
    facilis.DashLine=DashLine;
    
}());