(function(){
    facilis.game.gameAssetsUrl="gameAssets/";
    facilis.ActivityElement.prototype.showName=function(){
        this.txtName.visible=true;
        this.refreshCache();
    }
    
    facilis.ActivityElement.prototype.hideName=function(){
        this.txtName.visible=false;
        this.refreshCache();
    }
    
    facilis.ActivityElement.prototype.bonus=function(){
        this.shadow = new facilis.Shadow("#AAAAFF", 0, 0, 30);
        
        var tmp=this;
        try{tmp.updateCache();}catch(e){}
        
        setTimeout(function(){
            /*tmp.filters = [];
            var bounds = tmp.wrongFilter.getBounds();
            tmp.cache(-50+bounds.x, -50+bounds.y, 80+tmp._width, 80+tmp._height);*/
            tmp.shadow=null;
            try{tmp.updateCache();}catch(e){}
        },1000);
    }
    
    facilis.ActivityElement.prototype.greenLight=null;
	facilis.ActivityElement.prototype.showCorrect=function(show) {
        if (this.greenLight) {
            this.removeChild(this.greenLight);
            this.greenLight = null;
        }
        if(show){
            this.greenLight = facilis.IconManager.getInstance().getIcon("icons.drop.Permited");
            this.addChild(this.greenLight);
            this.greenLight.x = 7;
            this.greenLight.y = 7;
        }
        try{this.updateCache();}catch(e){}
    }
		
	facilis.ActivityElement.prototype.wrongFilter=null;
	facilis.ActivityElement.prototype.tiltWrong=function() {
        
        /*this.wrongFilter = new createjs.BlurFilter(5, 5, 1);
        this.filters = [this.wrongFilter];
        var bounds = this.wrongFilter.getBounds();
        this.cache(-50+bounds.x, -50+bounds.y, 80+this._width, 80+this._height);*/
        
        this.shadow = new facilis.Shadow("#FF0000", 0, 0, 15);
        
        var tmp=this;
        try{tmp.updateCache();}catch(e){}
        setTimeout(function(){
            /*tmp.filters = [];
            var bounds = tmp.wrongFilter.getBounds();
            tmp.cache(-50+bounds.x, -50+bounds.y, 80+tmp._width, 80+tmp._height);*/
            tmp.shadow=null;
            try{tmp.updateCache();}catch(e){}
        },1000);
        
        /*wrongFilter = new GlowFilter(0xFF0000, 1, 15, 15, 1);
        this.filters = [wrongFilter];
        var t:Timer = new Timer(700, 1);
        var tmp=this;
        t.addEventListener(TimerEvent.TIMER, function(e:TimerEvent) { 
            tmp.filters = [];
        } );
        t.start();*/
        
    }
}
)();