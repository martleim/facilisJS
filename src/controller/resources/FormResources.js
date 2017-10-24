(function() {

    function FormResources() {
        this.AbstractResourceController_constructor();
        
        if (!FormResources.allowInstantiation) {
            throw new Error("Error: Instantiation failed: Use SingletonDemo.getInstance() instead of new.");
        }
        
        this.frmIdMap={};
		this.filteredResources=[];
        this.modified = false;

    }
    
    FormResources._instance=null;
    FormResources.allowInstantiation=false;
    FormResources.getInstance=function(){
        if (FormResources._instance == null) {
            FormResources.allowInstantiation = true;
            FormResources._instance = new facilis.controller.FormResources();
            FormResources.allowInstantiation = false;
        }
        return FormResources._instance;
    }
    
    
    var element = facilis.extend(FormResources, facilis.controller.AbstractResourceController);
    
    element.baseAddResource=element.addResource;
    element.addResource=function(res, id) {
        var res = this.baseAddResource(res, id);

        modified = true;

        return res;
    }


    element.checkExists=function(name) {
        var frms = this.getResources();
        for (var i = 0; i < frms.length; i++ ) {
            var form = frms[i];
            if (name==form.children[1].getAttribute("value")) {
                return true;
            }
        }
        return false;
    }

    element.getExistingId=function(name) {
        var frms = this.getResources();
        for (var i = 0; i < frms.length; i++ ) {
            var form = frms[i];
            if (name == form.children[1].getAttribute("value")) {					
                //return form.children[1].getAttribute("resourceId");
                return i;
            }
        }
        return 0;
    }		

    element.getFilteredResources=function() {

        if (this.frmIdMap == null || modified) {

            this.frmIdMap =  {};
            modified = false;

            var toErase = new Array();
            var frms = this.resources.getValues();

            for (var i = 0; i < frms.length; i++ ) {

                var xml_length = frms[i].toString().length;
                var node  = frms[i].children[0];
                var frmId = node.attributes["value"];
                var frmName =  frms[i].children[1].attributes["value"];				

                //Buscar desde i+1 los formularios que tienen el mismo node.frmName
                for (var j = i + 1; j < frms.length; j++) {
                    var nodeAux = frms[j].children[0];					
                    if (frms[j].children[1].attributes["value"] == frmName) {						
                        if(frms[j].toString().length <= frms[i].toString().length) {
                            //Encontre un repetido de menor tamaño
                            toErase.push(j);
                            this.frmIdMap[nodeAux.attributes["value"]] = frmId;
                        } else {
                            //Tengo que borrar el original
                            if (toErase.indexOf(i) < 0) {
                                toErase.push(i);
                                this.frmIdMap[frmId] = nodeAux.attributes["value"];
                            }
                        }
                    }
                }
            }				

            var toErase2 = new Array();
            for (i = 0; i < toErase.length; i++ ) {
                if (toErase2.length == 0) {
                    toErase2.push(toErase[i]);
                } else {
                    var dont_add = false;
                    for (j = 0; j < toErase2.length; j++) {
                        if (toErase[i] < toErase2[j])
                            break;
                        if (toErase[i] == toErase2[j]) {
                            dont_add = true;
                            break;
                        }
                    }
                    if (dont_add)
                        continue;
                    if (j == toErase2.length) {
                        toErase2.push(toErase[i]);
                    } else {
                        //Mover elementos para adelante
                        toErase2.splice(j, 0, toErase[i]);
                    }
                }
            }				
            toErase2.reverse();

            for (i = 0; i < toErase2.length; i++ ) {
                if(frms.length > toErase2[i]) {
                    frms.splice(toErase2[i], 1);
                    //FormResources.getInstance().removeResource(toErase2[i]);
                }
            }

            filteredResources = frms;
        }

        //return resources.getValues();
        return filteredResources;
    }

    element.translateFrmId=function(frmId_origin) {

        //Forzamos la carga de this.frmIdMap
        FormResources.getInstance().getFilteredResources();

        var frmId_aux = frmId_origin;
        while (this.frmIdMap[frmId_aux]  != undefined) {
            frmId_aux = this.frmIdMap[frmId_aux];
        }

        return frmId_aux;
    }

	element.baseRemoveResource=element.removeResource;
	element.removeResource=function(id) {
		this.modified = true;
		return this.baseRemoveResource(id);
	}

    facilis.controller.FormResources = facilis.promote(FormResources, "AbstractResourceController");
    
}());