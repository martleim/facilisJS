function WindowManager(){
        if (!WindowManager.allowInstantiation) {
            throw new Error("Error: Instantiation failed: Use SingletonDemo.getInstance() instead of new.");
        }
    
        this.onCloseFunctions={};
	
		this.lastOpenedModalId=null;
        
        this.openModal=function(config){
            var modalId=this.getModalId();
			this.lastOpenedModalId=modalId;
            var modalHTML='<div class="modal" id="'+modalId+'" data-backdrop="static" data-keyboard="false"><div class="modal-dialog"><div class="modal-content"><div class="modal-header">';
            if(!config.closeButton==false)
                modalHTML+='<button type="button" class="close" onclick="facilis.game.WindowManager.getInstance().closeModal(\''+modalId+'\')" data-dismiss="modal" aria-hidden="true">x</button>';
            
            modalHTML+='<h4 class="modal-title">'+(config.title||"")+'</h4></div><div class="modal-body"></div>';
            if(config.footer && config.footer!="")
                modalHTML+='<div class="modal-footer">'+config.footer+'</div>';
                
            /*<div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary">Save changes</button></div>
            */
            modalHTML+='</div></div></div>';
            
			var closeFunction=function(){
				$( '.modal' ).css( 'overflow-y' , 'auto' );
			}
            if(config.onClose){
				var onClose=config.onClose;
				closeFunction=function(){
					onClose();
					$( '.modal' ).css( 'overflow-y' , 'auto' );
				}
			}
			this.onCloseFunctions["closeFunction_"+modalId]=closeFunction;
                
            if(config.contentHTML){
                
            }else if(config.contentUrl){
                var tmp=this;
				var cfg=config;
                $.get(config.contentUrl, null,
                    function(data){
                        $(data.firstChild.outerHTML).appendTo($('#'+modalId).find(".modal-body"));
                        tmp.startModal(modalId);
						if(cfg.onLoad)
							cfg.onLoad($('#'+modalId));
                    },
                    'xml');
            }
            $(modalHTML).appendTo("body");
            var cssOverride={};
            if(config.width)
                cssOverride.width=config.width;
            
            if(config.height)
                cssOverride.height=config.height;
            
            
            $("#"+modalId).find(".modal-dialog").css(cssOverride);
            return $("#"+modalId);
            //( { width:700, height:520, centered:true, content:modal, title:"" } )
        }
        
        this.startModal=function(modalId){
            $('#'+modalId).modal({
                show: true,
                truebackdrop: 'static', 
                keyboard: false
            });
        }
        
        this.closeModal=function(_id){
		    var id=_id;
			var closeFunc=null;
			if(this.onCloseFunctions["closeFunction_"+id]){
				closeFunc=this.onCloseFunctions["closeFunction_"+id];
				this.onCloseFunctions["closeFunction_"+id]=null;
			}					 
            $("#"+id).modal('hide');
            setTimeout(function(){
				$("#"+id).remove();
				if(closeFunc){
					closeFunc();
				}
			},800);
            
        }
        
        this.modalCount=0;
        this.getModalId=function(){
            this.modalCount++;
            return "_modal_"+this.modalCount;
        }
        
    }
    
    WindowManager.allowInstantiation=false;
    WindowManager._instance;
    
    WindowManager.getInstance=function() {
        if (WindowManager._instance == null) {
            WindowManager.allowInstantiation = true;
            WindowManager._instance = new WindowManager();
            WindowManager.allowInstantiation = false;
        }
        return WindowManager._instance;
    }

    facilis.game.WindowManager=WindowManager;