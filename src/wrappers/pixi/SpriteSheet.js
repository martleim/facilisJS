(function() {

    function SpriteSheet(data) {
        //this.BaseSpriteSheet_constructor(data.images[0]);
        var loader = new PIXI.loaders.Loader();
        loader.add('Icons',"src/assets/Icons.json");
        loader.once('complete',this.onAssetsLoaded.bind(this));
        loader.load();
        this.icons=[];
        return this.icons;
    }
    
    var element = facilis.extend(SpriteSheet, PIXI.SpriteBatch);
    
    element.onAssetsLoaded=function(e,res){
        for(var i in res.Icons.textures)
            this.icons.push(res.Icons.textures[i]);
    }
    
    Object.defineProperty(element,"frameIndexes",
                          {
        set:function(val){
            //this.frames=val;
        },
        get:function(){
            return this.frames;
        }
    });
    
    
    facilis.SpriteSheet = facilis.promote(SpriteSheet, "BaseSpriteSheet");
    
}());