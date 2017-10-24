(function() {

    function ScrollContent() {
        this.BaseElement_constructor();
        
        this._content;
        this._scrollBarV;
        this._scrollBarH;
        
        this.isDragging = false;

        this.lastPos = new facilis.Point();
        this.firstPos = new facilis.Point();
        this.firstPanelPos = new facilis.Point();
        this.diff = new facilis.Point();
        this.inertia = new facilis.Point();
        this.min = new facilis.Point();
        this.max = new facilis.Point();

        this.touchX;
        this.touchY;

        this.panelWidth;

        this.panelHeight;

        this.__mask;

        this._minBarAlpha = .2;
        this._barDist = 25;

        this.setup();
    }
    
    ScrollContent.SPACE_SCROLL = false;
		
    var element = facilis.extend(ScrollContent, facilis.BaseElement);
    
    element.setup = function() {
        this._content = new facilis.BaseElement();
        this.addChild(this._content);

        // initialize mask
        this.__mask = new facilis.Shape();
        this.addChild(this.__mask);

        this._scrollBarV=new facilis.BaseElement();
        this._scrollBarH = new facilis.BaseElement();
        this.addChild(this._scrollBarV);
        this.addChild(this._scrollBarH);

        this.setEvents();
    };
    
    element.scrollFactor = 10;
    element.useVertical = true;
    element.useHorizontal = true;    


    element.getContent=function(){
        return this._content;
    }

    element.updateSize=function(w, h) {
        if (w) {
            this.panelWidth = w;
        }else {
            this.panelWidth = facilis.View.getInstance().getStageWidth();
        }
        if (h) {
            panelHeight = h;
        }else {
            panelHeight = facilis.View.getInstance().getStageHeight();
        }
        this.updateMask();
        this.drawScrollBars();
    }

    element.updateMask=function() { 
        this.__mask.graphics.clear();
        this.__mask.graphics.beginFill(0);
        this.__mask.graphics.drawRect(0,0,facilis.View.getInstance().getStageWidth(), facilis.View.getInstance().getStageHeight());
        this.__mask.graphics.endFill();
        this._content.setMask(this.__mask);
    }




    //element.handleAddedToStage(e) {
    element.setEvents=function() {
        this.addEventListener("mousedown", this.handleMouseDown.bind(this));
        //facilis.Ticker.addEventListener("tick", this.handleEnterFrame.bind(this));
        
    }

    /**
     * Listener for mouse movement
     * @param e information for mouse
     */
    element.handleMouseMove=function(e) {
        var _contentWidth = facilis.View.getInstance()._backWidth;//facilis.View.getInstance().getBack().width;
        var _contentHeight = facilis.View.getInstance()._backHeight;//facilis.View.getInstance().getBack().height;

        var totalX = e.localX - this.firstPos.x;
        var totalY = e.localY - this.firstPos.y;

        // movement detection with this.scrollFactor
        if (this.useVertical && Math.abs(totalY) > this.scrollFactor) {
            this.isDragging = true;
        }
        if (this.useHorizontal && Math.abs(totalX) > this.scrollFactor) {
            this.isDragging = true;
        }

        if (this.isDragging) {

            if (this.useVertical) {
                if (totalY < this.min.y) {
                    totalY = this.min.y - Math.sqrt(this.min.y-totalY);
                }
                if (totalY > this.max.y) {
                    totalY = this.max.y + Math.sqrt(totalY - this.max.y);
                }
                this._content.y = this.firstPanelPos.y + totalY;
            }

            if (this.useHorizontal) {
                if (totalX < this.min.x) {
                    totalX = this.min.x - Math.sqrt(this.min.x-totalX);
                }
                if (totalX > this.max.x) {
                    totalX = this.max.x + Math.sqrt(totalX - this.max.x);
                }
                this._content.x = this.firstPanelPos.x + totalX;
            }
        }
    }

    /**
     * Listener for mouse up action
     * @param e information for mouse
     */
    element.handleMouseUp=function(e) {
        //clearInterval(this.intervalReference);
        //facilis.Ticker.removeEventListener("tick", this.handleEnterFrame.bind(this));
            
        var _contentWidth = facilis.View.getInstance()._backWidth;//facilis.View.getInstance().getBack().width;
        var _contentHeight = facilis.View.getInstance()._backHeight;//facilis.View.getInstance().getBack().height;

        if (stage.hasEventListener("pressmove") )	{
            stage.removeEventListener("pressmove", this.handleMouseMove);
        }
        this.isDragging = false;
        // setting this.inertia power
        if (this.useVertical) {
            this.inertia.y = diff.y;
        }
        if (this.useHorizontal) {
            this.inertia.x = diff.x;
        }

        stage.removeEventListener("mouseup", this.handleMouseUp.bind(this));
    }

    /**
     * Listener for mouse down
     * @param e information for mouse
     */
    
    element.intervalReference;
    element.handleMouseDown=function(e) {  
        
        //clearInterval(this.intervalReference);
        var ref=this;
        this.intervalReference=setInterval(function(){
            ref.handleEnterFrame(ref);
        },100);
        /*if (facilis.Ticker.hasEventListener("tick") )	{
            facilis.Ticker.removeEventListener("tick", this.handleEnterFrame.bind(this));
        }
        
        facilis.Ticker.addEventListener("tick", this.handleEnterFrame.bind(this));*/
        //if ((Key.isDown(Keyboard.SPACE) && ScrollContent.SPACE_SCROLL) || !ScrollContent.SPACE_SCROLL) {
            var _contentWidth = facilis.View.getInstance()._backWidth;//facilis.View.getInstance().getBack().width;
            var _contentHeight = facilis.View.getInstance()._backHeight;//facilis.View.getInstance().getBack().height;

            if (!this.stage.hasEventListener("pressmove")) {
                this.stage.addEventListener("pressmove", this.handleMouseMove.bind(this));
                this.stage.addEventListener("mouseup", this.handleMouseUp.bind(this));
            }
            this.inertia.y = 0;
            this.inertia.x = 0;

            this.firstPos.x = e.localX;
            this.firstPos.y = e.localY;

            this.firstPanelPos.x = this._content.x;
            this.firstPanelPos.y = this._content.y;

            this.min.x = Math.min(-this._content.x, -_contentWidth + this.panelWidth - this._content.x);
            this.min.y = Math.min(-this._content.y, -_contentHeight + panelHeight - this._content.y);

            this.max.x = -this._content.x;
            this.max.y = -this._content.y;

            this.drawScrollBars();
        //}
    }

    element.drawScrollBars=function() {
        try{
        var _contentWidth = facilis.View.getInstance().getBack().width;
        var _contentHeight = facilis.View.getInstance().getBack().height;

        _scrollBarV.graphics.clear();
        if (this.useVertical) {
            _scrollBarV.graphics.beginFill(0x888899,1);
            //_scrollBarV.graphics.drawRoundRect(2,0,6, panelHeight * Math.this.max(0, panelHeight / _contentHeight), 8);
            var h = (panelHeight - _barDist) * Math.max(0, panelHeight / _contentHeight);
            _scrollBarV.graphics.drawRoundRect(2,_barDist,6, h, 8);
            _scrollBarV.graphics.endFill();
        }

        _scrollBarH.graphics.clear();
        if (this.useHorizontal) {
            _scrollBarH.graphics.beginFill(0x888899,1);
            //_scrollBarH.graphics.drawRoundRect(0,2, this.panelWidth * Math.max(0, this.panelWidth / _contentWidth), 6, 8);
            var w = (this.panelWidth - _barDist) * Math.max(0, this.panelWidth / _contentWidth);
            _scrollBarH.graphics.drawRoundRect(_barDist,2, w, 6, 8);
            _scrollBarH.graphics.endFill();
        }
        }catch (e){}
    }

    /**
     * Listener for enter frame event
     * @param e event information
     */
    element.handleEnterFrame=function(e) {

        var _contentWidth = facilis.View.getInstance().getBack().width;
        var _contentHeight = facilis.View.getInstance().getBack().height;

        this.diff.y = e.localY - this.lastPos.y;
        this.diff.x = e.localX - this.lastPos.x;

        this.lastPos.y = e.localY;
        this.lastPos.x = e.localX;
        if (!this.isDragging) {

            // movements while non dragging

            if (this.useVertical) {
                if (this._content.y > 0) {
                    this.inertia.y = 0;
                    this._content.y *= 0.8;
                    if (this._content.y < 1) {
                        this._content.y = 0;
                    }
                }
                if (_contentHeight >= this.panelHeight && this._content.y < this.panelHeight - _contentHeight) {
                    this.inertia.y = 0;

                    var goal = this.panelHeight - _contentHeight;
                    this.diff = this.goal - this._content.y;

                    if (this.diff > 1) {
                        this.diff *= 0.2;
                    }
                    this._content.y += this.diff;
                }
                if (_contentHeight < panelHeight && this._content.y < 0) {
                    this.inertia.y = 0;
                    this._content.y *= 0.8;
                    if (this._content.y > -1) {
                        this._content.y = 0;
                    }
                }
                if (Math.abs(this.inertia.y) > 1) {
                    this._content.y += this.inertia.y;
                    this.inertia.y *= 0.95;
                } else {
                    this.inertia.y = 0;
                }
                if (this.inertia.y != 0) {
                    if (this._scrollBarV.alpha < 1) {
                        this._scrollBarV.alpha = Math.min(1, this._scrollBarV.alpha+0.1);
                    }
                    this._scrollBarV.y = this.panelHeight * Math.min(1, (-this._content.y / _contentHeight));
                } else {
                    if (this._scrollBarV.alpha > this._minBarAlpha) {
                        this._scrollBarV.alpha = Math.max(0, this._scrollBarV.alpha-0.1);
                    }
                }
            }
            if (this.useHorizontal) {
                if (this._content.x > 0) {
                    this.inertia.x = 0;
                    this._content.x *= 0.8;
                    if (this._content.x < 1) {
                        this._content.x = 0;
                    }
                }

                if (_contentWidth >= this.panelWidth && this._content.x < this.panelWidth - _contentWidth) {
                    this.inertia.x = 0;

                    goal = this.panelWidth - _contentWidth;
                    diff = goal - this._content.x;

                    if (diff > 1) {
                        diff *= 0.2;
                    }
                    this._content.x += diff;
                }

                if (_contentWidth < this.panelWidth && this._content.x < 0) {
                    this.inertia.x = 0;
                    this._content.x *= 0.8;
                    if (this._content.x > -1) {
                        this._content.x = 0;
                    }
                }

                if (Math.abs(this.inertia.x) > 1) {
                    this._content.x += this.inertia.x;
                    this.inertia.x *= 0.95;
                } else {
                    this.inertia.x = 0;
                }

                if (this.inertia.x != 0) {
                    if (this._scrollBarH.alpha < 1) {
                        this._scrollBarH.alpha = Math.min(1, this._scrollBarH.alpha+0.1);
                    }
                    _scrollBarH.x = this.panelWidth * Math.min(1, (-this._content.x / _contentWidth));
                } else {
                    if (this._scrollBarH.alpha > this._minBarAlpha) {
                        this._scrollBarH.alpha = Math.max(0, this._scrollBarH.alpha-0.1);
                    }
                }
            }

        } else {
            if (this.useVertical) {
                if (this._scrollBarV.alpha < 1) {
                    this._scrollBarV.alpha = Math.min(1, this._scrollBarV.alpha+0.1);
                }
                this._scrollBarV.y = this.panelHeight * Math.min(1, (-this._content.y / _contentHeight));
            }

            if (this.useHorizontal) {
                if (this._scrollBarH.alpha < 1) {
                    this._scrollBarH.alpha = Math.min(1, this._scrollBarH.alpha+0.1);
                }
                this._scrollBarH.x = this.panelWidth * Math.min(1, (-this._content.x / _contentWidth));
            }
        }
    }
    
    
    


    facilis.ScrollContent = facilis.promote(ScrollContent, "BaseElement");
    
}());