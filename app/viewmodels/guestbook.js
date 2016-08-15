define(['plugins/http', 'durandal/app', 'knockout', 'facebook'], function (http, app, ko, fb) {
    return {
        settings: {
            hashtags: [
                'rinjenph',
                'ringjengph',
            ]
        },
        displayName: 'Hashboard',
        profile: ko.observable(''),
        images: ko.observableArray([]),
        facebook: ko.observableArray([]),
        fblogin: ko.observable(false),
        activate: function () {
            //the router's activator calls this function and waits for it to complete before proceeding
            if (this.images().length > 0) {
                return;
            }

            var that = this;

            for(var i =0; i<this.settings.hashtags.length; i++){
                //this.getInstagramImages(this.settings.hashtags[i], this.settings.instagram);
            }
        },
        attached: function(){
            var self = this;
            $('.navbar').css('display','block');

            console.log({fb:fb});
            FB.init({
                appId      : '707440189383318',
                version    : 'v2.3'
              });
            FB.getLoginStatus(function(response) {
                if(response.status === 'connected'){
                    console.log('we are in');
                    console.log(response);
                    self.fblogin(true);

                    FB.api(
                        "/me/friends",

                        function (response) {
                            console.log(response);
                          if (response && !response.error) {
                            /* handle the result */
                            console.log({'friends':response});
                          }
                        }
                    );
                }else{
                    FB.login(function(){}, {scope: 'user_friends, user_events, user_abums, user_photos'});
                }
            });
        },
        select: function(item) {
            //the app model allows easy display of modal dialogs by passing a view model
            //views are usually located by convention, but you an specify it as well with viewUrl
            item.viewUrl = 'views/detail';
            app.showDialog(item);
        },
        // canDeactivate: function () {
        //     //the router's activator calls this function to see if it can leave the screen
        //     return app.showMessage('Are you sure you want to leave this page?', 'Navigate', ['Yes', 'No']);
        // }
    };
});