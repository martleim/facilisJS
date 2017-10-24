angular.module("facilisApp").provider("facilisConfig",
function() {
    var conf = {
        directivesUrl: "app/directives/",
		elementViewsUrl: "app/views/facilis/"
    };

    conf.$get = function () {
        delete conf.$get;
        return conf;
    };

    return conf;
});