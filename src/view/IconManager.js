(function() {

    function IconManager() {
        
        if (!IconManager.allowInstantiation) {
            throw new Error("Error: Instantiation failed: Use SingletonDemo.getInstance() instead of new.");
        }

        this.url=facilis.View.getInstance().rootPath+"assets/Icons.png";
        this.icons=null;
        
        this.setup();
    }
    
    IconManager._instance=null;
    IconManager.allowInstantiation=false;
    
    IconManager.getInstance=function(){
        if (IconManager._instance == null) {
            IconManager.allowInstantiation = true;
            IconManager._instance = new facilis.IconManager();
            IconManager.allowInstantiation = false;
        }
        return IconManager._instance;
    }
    
    
    var element = facilis.extend(IconManager, {});
    
    /*
        element.BaseClassSetup=element.setup;
    */
    element.setup = function() {
        
        var frames=[];
        IconManager.frameIndexes={};
        var count=0;
        for(var i in IconManager.defs.frames){
            var f=IconManager.defs.frames[i].frame;
            frames.push([f.x,f.y,f.w,f.h]);
            IconManager.frameIndexes[i]=count;
            count++;
        }
        
        
        var data = {
            images: [this.url],
            frames: frames,//{width:20, height:20},
            /*animations: {
                stand:0,
                run:[1,5],
                jump:[6,8,"run"]
            }*/
        };
        this.icons = new facilis.SpriteSheet(data);
        
        /*
        var loader = new createjs.LoadQueue();
        loader.addEventListener("fileload", this.loaded.bind(this));
        loader.loadFile(this.url);*/

        
    };
    
    /*element.loaded=function(e){
        this.icons=e.result.children[0].children;
    }*/
    
    element.getIcon=function(n) {
        var name=n;
        var icon = null;
        if(this.icons){
            name=name.split(".");
            name=name[name.length-1];
            icon = new facilis.Sprite(this.icons);
            if(IconManager.frameIndexes[name]){
                icon.gotoAndStop(IconManager.frameIndexes[name]);
            }else{
                console.log("Error no existe el icono : "+name);
                //throw new Error("Error no existe el icono : "+name);
                icon.gotoAndStop(0);
            }
        }

        return icon;
    }
    
    
    
    
    IconManager.defs={"frames": {

"AdhocProcess":
{
	"frame": {"x":0,"y":0,"w":21,"h":21},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":21,"h":21},
	"sourceSize": {"w":21,"h":21}
},
"Cancel":
{
	"frame": {"x":23,"y":0,"w":17,"h":17},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":17,"h":17},
	"sourceSize": {"w":17,"h":17}
},
"Compensation":
{
	"frame": {"x":42,"y":0,"w":15,"h":17},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":15,"h":17},
	"sourceSize": {"w":15,"h":17}
},
"ComplexGateway":
{
	"frame": {"x":59,"y":0,"w":18,"h":18},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":18,"h":18},
	"sourceSize": {"w":18,"h":18}
},
"Conditional":
{
	"frame": {"x":79,"y":0,"w":17,"h":17},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":17,"h":17},
	"sourceSize": {"w":17,"h":17}
},
"DataInput":
{
	"frame": {"x":98,"y":0,"w":22,"h":22},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":22,"h":22},
	"sourceSize": {"w":22,"h":22}
},
"DataOutput":
{
	"frame": {"x":122,"y":0,"w":22,"h":22},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":22,"h":22},
	"sourceSize": {"w":22,"h":22}
},
"EmbeddedProcess":
{
	"frame": {"x":146,"y":0,"w":21,"h":21},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":21,"h":21},
	"sourceSize": {"w":21,"h":21}
},
"Error":
{
	"frame": {"x":169,"y":0,"w":19,"h":20},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":19,"h":20},
	"sourceSize": {"w":19,"h":20}
},
"ErrorFill":
{
	"frame": {"x":190,"y":0,"w":19,"h":20},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":19,"h":20},
	"sourceSize": {"w":19,"h":20}
},
"ErrorNoFill":
{
	"frame": {"x":211,"y":0,"w":19,"h":20},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":19,"h":20},
	"sourceSize": {"w":19,"h":20}
},
"EventBasedGateway":
{
	"frame": {"x":232,"y":0,"w":20,"h":21},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":20,"h":21},
	"sourceSize": {"w":20,"h":21}
},
"ExclusiveGateway":
{
	"frame": {"x":0,"y":24,"w":15,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":15,"h":16},
	"sourceSize": {"w":15,"h":16}
},
"InclusiveGateway":
{
	"frame": {"x":17,"y":24,"w":20,"h":20},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":20,"h":20},
	"sourceSize": {"w":20,"h":20}
},
"Link":
{
	"frame": {"x":39,"y":24,"w":13,"h":17},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":13,"h":17},
	"sourceSize": {"w":13,"h":17}
},
"Message":
{
	"frame": {"x":54,"y":24,"w":18,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":18,"h":16},
	"sourceSize": {"w":18,"h":16}
},
"MessageFilled":
{
	"frame": {"x":74,"y":24,"w":17,"h":15},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":17,"h":15},
	"sourceSize": {"w":17,"h":15}
},
"Multiple":
{
	"frame": {"x":93,"y":24,"w":21,"h":19},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":21,"h":19},
	"sourceSize": {"w":21,"h":19}
},
"MultipleFilled":
{
	"frame": {"x":116,"y":24,"w":21,"h":19},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":21,"h":19},
	"sourceSize": {"w":21,"h":19}
},
"ParallelGateway":
{
	"frame": {"x":139,"y":24,"w":17,"h":18},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":17,"h":18},
	"sourceSize": {"w":17,"h":18}
},
"Permited":
{
	"frame": {"x":158,"y":24,"w":18,"h":18},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":18,"h":18},
	"sourceSize": {"w":18,"h":18}
},
"ReferenceProcess":
{
	"frame": {"x":178,"y":24,"w":21,"h":21},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":21,"h":21},
	"sourceSize": {"w":21,"h":21}
},
"ReusableProcess":
{
	"frame": {"x":201,"y":24,"w":21,"h":21},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":21,"h":21},
	"sourceSize": {"w":21,"h":21}
},
"Signal":
{
	"frame": {"x":224,"y":24,"w":17,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":17,"h":16},
	"sourceSize": {"w":17,"h":16}
},
"SignalFilled":
{
	"frame": {"x":0,"y":47,"w":17,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":17,"h":16},
	"sourceSize": {"w":17,"h":16}
},
"TaskBusinessRule":
{
	"frame": {"x":19,"y":47,"w":21,"h":22},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":21,"h":22},
	"sourceSize": {"w":21,"h":22}
},
"TaskManual":
{
	"frame": {"x":42,"y":47,"w":21,"h":21},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":21,"h":21},
	"sourceSize": {"w":21,"h":21}
},
"TaskReceive":
{
	"frame": {"x":65,"y":47,"w":21,"h":21},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":21,"h":21},
	"sourceSize": {"w":21,"h":21}
},
"TaskReference":
{
	"frame": {"x":178,"y":24,"w":21,"h":21},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":21,"h":21},
	"sourceSize": {"w":21,"h":21}
},
"TaskScript":
{
	"frame": {"x":88,"y":47,"w":21,"h":21},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":21,"h":21},
	"sourceSize": {"w":21,"h":21}
},
"TaskSend":
{
	"frame": {"x":111,"y":47,"w":21,"h":21},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":21,"h":21},
	"sourceSize": {"w":21,"h":21}
},
"TaskService":
{
	"frame": {"x":134,"y":47,"w":21,"h":21},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":21,"h":21},
	"sourceSize": {"w":21,"h":21}
},
"TaskUser":
{
	"frame": {"x":157,"y":47,"w":21,"h":22},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":21,"h":22},
	"sourceSize": {"w":21,"h":22}
},
"Terminate":
{
	"frame": {"x":180,"y":47,"w":14,"h":15},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":14,"h":15},
	"sourceSize": {"w":14,"h":15}
},
"Timer":
{
	"frame": {"x":196,"y":47,"w":19,"h":19},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":19,"h":19},
	"sourceSize": {"w":19,"h":19}
}},
"meta": {
	"app": "Adobe Flash Professional",
	"version": "14.1.0.96",
	"image": "incons2.png",
	"format": "RGBA8888",
	"size": {"w":256,"h":256},
	"scale": "1"
}
};
    

    facilis.IconManager = facilis.promote(IconManager, "Object");
    
}());