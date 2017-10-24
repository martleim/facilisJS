(function() {

    GameElements={};
    
    GameElements.drawDummyDiv=function(el){
        var element=$("#"+el)[0];
        GameElements.drawDummyDivToElement(element,"div_"+el);
    }

    GameElements.drawDummyDivToElement=function(element,id){
        var pos=GameElements.getGlobalPosition(element);
        $("<div></div>").attr("id",id).css({"background":"rgba(255,255,255,0)","width":element.getBBox().width+"px","height":element.getBBox().height+"px","position": "absolute","top": pos.y+"px", "left": pos.x+"px"}).appendTo("#notePad");
    }

    GameElements.getGlobalPosition=function(el){
        var root = $("#notePad").find("svg")[0];
        var rec = el;
        var point = root.createSVGPoint();
        var ctm = rec.getCTM();
        return point.matrixTransform(ctm);
    }

    GameElements.setButtonBehavior=function(el){
        $("#"+el)[0].setAttribute("class", "notePadButton");
        $("#div_"+el).css({cursor:"pointer"})
        $("#div_"+el).hover(function() {
            $("#"+el)[0].setAttribute("class", "notePadButton notePadButtonTransition");
        }, function() {
            $("#"+el)[0].setAttribute("class", "notePadButton");
        });
    }

    GameElements.setCheckBehavior=function(el,lbl){
        GameElements.drawDummyDiv(el);
        GameElements.drawDummyDivToElement($("#"+el).find("g[id^='label']")[0],"label_"+el);
        $("#label_"+el).html(facilis.LabelManager.getInstance().getLabel(lbl));
        GameElements.setButtonBehavior(el);
        $("#div_"+el).attr("svgElId",el).attr("checked","false");
        $("#div_"+el).css({"cursor":"pointer"}).click(function() {
          /*$( "#"+el ).find("g[id^='cross']").toggle( "slow", function() {
          });*/
            this.checked=!this.checked;
        });
        
        
        Object.defineProperty($("#div_"+el)[0], 'checked', {
            get: function() { 
                return ($(this).attr("checked")=="true");
            },
            set: function(val) {
                $(this).attr("checked",val+"");
                if(val){
                    $( "#"+$(this).attr("svgElId") ).find("g[id^='cross']").show("slow");
                }else{
                    $( "#"+$(this).attr("svgElId") ).find("g[id^='cross']").hide("slow");
                }
                
            }
        });
        
    }

    GameElements.setTextAreaBehavior=function(el){
        GameElements.drawDummyDiv(el);
        $("#div_"+el).css({"top":"110px","left":"10px","height":"345px","overflow":"auto"});
        $("#div_"+el).html("");
    }
    


    facilis.game.GameElements = GameElements;
    
}());