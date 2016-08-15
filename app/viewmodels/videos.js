define(['plugins/http', 'durandal/app', 'knockout'], function (http, app, ko) {
    return {
        settings: {
            instagram: '34530257.58d388b.9bdc1c0cf0f949f086f97943c0734acf',
            hashtags: [
                'rinjenph',
                'ringjengph'
            ]
        },
        displayName: 'Videos',
        activate: function () {
            
        },
        select: function(item) {
            item.viewUrl = 'views/detail';
            app.showDialog(item);
        },
        video: function(item) {
            item.viewUrl = 'views/video';
            app.showDialog(item);
        },
        // canDeactivate: function () {
        //     //the router's activator calls this function to see if it can leave the screen
        //     return app.showMessage('Are you sure you want to leave this page?', 'Navigate', ['Yes', 'No']);
        // }
        attached: function(){
            var self = this;
        }
        
    };
});