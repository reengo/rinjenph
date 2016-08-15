define(['plugins/http', 'durandal/app', 'knockout'], function (http, app, ko) {
    return {
        activate: function () {
            
        },
        attached: function(){
        },
        select: function(item) {
            item.viewUrl = 'views/detail';
            app.showDialog(item);
        }
        // canDeactivate: function () {
        //     //the router's activator calls this function to see if it can leave the screen
        //     return app.showMessage('Are you sure you want to leave this page?', 'Navigate', ['Yes', 'No']);
        // }
    };
});