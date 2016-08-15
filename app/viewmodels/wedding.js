define(['plugins/http', 'durandal/app', 'knockout'], function (http, app, ko) {
    return {
        settings: {
            instagram: '34530257.58d388b.9bdc1c0cf0f949f086f97943c0734acf',
            hashtags: [
                'rinjenph',
                'ringjengph'
            ]
        },
        displayName: 'Hashboard',
        profile: ko.observable(''),
        images: ko.observableArray([]),
        facebook: ko.observableArray([]),
        nextUrl: ko.observable(''),
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
            FB.init({
                appId      : '707440189383318',
                version    : 'v2.3'
              });

            FB.getLoginStatus(function(response) {
                if(response.status === 'connected'){
                    console.log('we are in');
                    console.log(response);

                    FB.api(
                        "/me/friends",

                        function (response) {
                          if (response && !response.error) {
                            /* handle the result */
                            console.log({'friends':response});
                          }
                        }
                    );
                }else{
                    FB.login(function(response){
                        if (response.authResponse) {
                         console.log('Welcome!  Fetching your information.... ');
                         FB.api('/me', function(response) {
                           app.showMessage('Hi, <strong>' + response.name + '</strong>. Using your connection to the couple through facebook, we\'ll try to get #rinjenph related photos through your network and add them to the hashboard... <br /><br />So far... we got: '+self.facebook().length+' Photos :D <br /><br />Have a nice day!');
                         });
                       } else {
                         app.showMessage('The site will only use your facebook profile to get links to pictures you posted from the wedding. <br /><br /> Reconsider authorizing? :D');
                       }
                    }, {scope: 'public_profile, email, user_friends'});
                }
            });
          },
        getInstagramImages: function(hashtag, access_token){
            var that = this;
            var url = this.nextUrl() === '' ? "https://api.instagram.com/v1/tags/" 
                + hashtag 
                + "/media/recent?access_token=" 
                + access_token
                : this.nextUrl();

            $.ajax({
                url: url, jsonp: "callback", dataType: "jsonp", 
                data: { format: "json" },
                success: function( response ) {
                    if(response.data){
                        console.log({'instagram':response});
                        for(var i=0;i<response.data.length;i++){
                            if(response.data[i].images.standard_resolution.url){
                                var high = ko.observable( response.data[i].images.standard_resolution.url );
                                var low = ko.observable( response.data[i].images.low_resolution.url );
                                var thumbnail = ko.observable( response.data[i].images.thumbnail.url );
                                var profile = ko.observable( response.data[i].user.profile_picture );
                                var name = ko.observable( response.data[i].user.full_name );
                                var caption = ko.observable( response.data[i].caption.text );
                                var link = ko.observable( response.data[i].link );
                                var created = ko.observable(response.data[i].created_time);
                               
                                that.images.push({ 
                                    user: profile, 
                                    name: name,
                                    image: high,
                                    thumbnail: thumbnail,
                                    low: low,
                                    caption:caption,
                                    link:link,
                                    created:created
                                });
                            } 
                        }

                        if(response.pagination.next_url){
                            that.nextUrl(response.pagination.next_url);
                            that.getInstagramImages();
                        }
                    }
                }
            });
        }
        
    };
});