(function() {

    function RuleManager() {
        this.dropRules;
		this.dropInRules;
		this.connectionRules;
		
		this.dropRulesReady = false;
		this.dropInRulesReady = false;
		this.connectionRulesReady = false;
		
    }
	
    RuleManager._instance=null;
    RuleManager.allowInstantiation=false;
    RuleManager.getInstance=function(){
        if (RuleManager._instance == null) {
            RuleManager.allowInstantiation = true;
            RuleManager._instance = new facilis.validation.RuleManager();
			facilis.EventDispatcher.initialize(RuleManager._instance);
            //this._instance.appendMe();
            RuleManager.allowInstantiation = false;
        }
        return RuleManager._instance;
    }
    
    var element = facilis.extend(RuleManager, {});

    element.checkDropRule=function(atts) {
		return this.dropRules.validate(atts);
	}

	element.checkDropInRule=function(atts) {
		return this.dropInRules.validate(atts);
	}

	element.checkConnectRule=function(atts) { 
		return this.connectionRules.validate(atts);
	}

	element.init=function(){

		this.dropRules = new facilis.validation.DropRule();
		this.dropRules.addEventListener(facilis.validation.AbstractRule.RULE_LODADED, this.dropReady.bind(this));
		this.dropInRules = new facilis.validation.DropInRule();
		this.dropInRules.addEventListener(facilis.validation.AbstractRule.RULE_LODADED, this.dropInReady.bind(this));
		this.connectionRules = new facilis.validation.ConnectionRule();
		this.connectionRules.addEventListener(facilis.validation.AbstractRule.RULE_LODADED, this.connectionReady.bind(this));
		
		this.dropInRules.init();
		this.dropRules.init();
		this.connectionRules.init();
	}

	element.getConnectionRules=function() {
		return this.connectionRules;
	}

	element.getDropRules=function() {
		return this.dropRules;
	}

	element.getDropInRules=function() {
		return this.dropInRules;
	}

	element.dropReady=function(e){ 
		this.dropRulesReady = true;
		this.tryRulesReady();
	}

	element.dropInReady=function(e){ 
		this.dropInRulesReady = true;
		this.tryRulesReady();
	}

	element.connectionReady=function(e){
		this.connectionRulesReady = true;
		this.tryRulesReady();
	}

	element.tryRulesReady=function(){
		if (this.dropRulesReady && this.connectionRulesReady && this.dropInRulesReady) {
			this.dispatchEvent(new facilis.Event(facilis.validation.RuleManager.RULES_LOADED));
		}
	}
	
	facilis.validation.RuleManager = facilis.promote(RuleManager, "Object");
    
	facilis.validation.RuleManager.getInstance().init();
}());