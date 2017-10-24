var facilis={
    parsers:{
        input:{},
        output:{}
    },
    baseUrl:"src/",
    validation:{},
    documentation:{},
    controller:{},
	model:{},
    game:{},
    extend:function(subclass, superclass) {
        "use strict";
        function o() { this.constructor = subclass; }
        o.prototype = superclass.prototype;
        return (subclass.prototype = new o());
    },
    promote:function(subclass, prefix) {
        "use strict";

        var subP = subclass.prototype, supP = (Object.getPrototypeOf&&Object.getPrototypeOf(subP))||subP.__proto__;
        if (supP) {
            subP[(prefix+="_") + "constructor"] = supP.constructor; // constructor is not always innumerable
            for (var n in supP) {
                if (subP.hasOwnProperty(n) && (typeof supP[n] == "function")) { subP[prefix + n] = supP[n]; }
            }
        }
        return subclass;
    },
    extendProperty:function(classEl,property,getter,setter){
        var descriptor=null;
        
            try{
                descriptor=Object.getOwnPropertyDescriptor(classEl.prototype,property);
            }catch(e){}
        if(descriptor){
            Object.defineProperty(element,property,null);
            Object.defineProperty(element,"_base_"+property,descriptor);
        }
        Object.defineProperty(classEl,property,{get:getter,set:setter});
    },
	getClassName:function(el){
		if(el && el.constructor)
			return el.constructor.name;
	},
	clone:function(src) {

		function mixin(dest, source, copyFunc) {
			var name, s, i, empty = {};
			for(name in source){
				// the (!(name in empty) || empty[name] !== s) condition avoids copying properties in "source"
				// inherited from Object.prototype.	 For example, if dest has a custom toString() method,
				// don't overwrite it with the toString() method that source inherited from Object.prototype
				s = source[name];
				if(!(name in dest) || (dest[name] !== s && (!(name in empty) || empty[name] !== s))){
					dest[name] = copyFunc ? copyFunc(s) : s;
				}
			}
			return dest;
		}

		if(!src || typeof src != "object" || Object.prototype.toString.call(src) === "[object Function]"){
			// null, undefined, any non-object, or function
			return src;	// anything
		}
		if(src.nodeType && "cloneNode" in src){
			// DOM Node
			return src.cloneNode(true); // Node
		}
		if(src instanceof Date){
			// Date
			return new Date(src.getTime());	// Date
		}
		if(src instanceof RegExp){
			// RegExp
			return new RegExp(src);   // RegExp
		}
		var r, i, l;
		if(src instanceof Array){
			// array
			r = [];
			for(i = 0, l = src.length; i < l; ++i){
				if(i in src){
					r.push(facilis.clone(src[i]));
				}
			}
			// we don't clone functions for performance reasons
			//		}else if(d.isFunction(src)){
			//			// function
			//			r = function(){ return src.apply(this, arguments); };
		}else{
			// generic objects
			r = src.constructor ? new src.constructor() : {};
		}
		return mixin(r, src, facilis.clone);
		
	}
};