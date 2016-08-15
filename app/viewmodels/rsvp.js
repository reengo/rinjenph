define(['plugins/http', 'durandal/app', 'knockout'], function (http, app, ko) {
    return {
        settings: {
            instagram: '34530257.58d388b.9bdc1c0cf0f949f086f97943c0734acf',
            facebook: 'CAACEdEose0cBACM26BonVDE5T9ik0HiolI9luRZCmJOjeKbuDKeyHN4i7hao3Maeg7A5UvyAZCeijdPnrNr0lZBHReLK8jfcRCKTfmTA8U8qmX4GkygEMdWKtZB2BvaiFJZBrykiKqdbtX5lbSVkZBZBG63BS9kq2iVBwqC8wP4j1ZAtJuUBwBvgBvu3EUNNKeSKCDKKvU9YlTnNvkfyjZC8unWavSmZBvoyQZD',
            hashtags: [
                'rinjenph',
                'ringjengph',
            ]
        },
        displayName: 'Hashboard',
        profile: ko.observable(''),
        images: ko.observableArray([]),
        facebook: ko.observableArray([]),
        activate: function () {
            //the router's activator calls this function and waits for it to complete before proceeding
            if (this.images().length > 0) {
                return;
            }

            var that = this;

            for(var i =0; i<this.settings.hashtags.length; i++){
                this.getInstagramImages(this.settings.hashtags[i], this.settings.instagram);
            }
            //this.getFacebookImages();
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
        getProfile: function(){
            var that = this;
            $.ajax({
                url:'https://graph.facebook.com/v2.3/me?fields=picture&access_token=' + this.settings.facebook,
                jsonp: "callback", dataType: "jsonp",
                data: { format: "json" },
                success: function( response ) {
                    console.log({'facebook':response.data});
                    that.profile(response.data);
                }

            });
        },
        getFacebookImages: function(){
            var that = this;
            $.ajax({
                url: "https://graph.facebook.com/v2.3/me/photos?limit=5&access_token=" + this.settings.facebook,
                jsonp: "callback", dataType: "jsonp", data: { format: "json"},
                success: function( response ) {
                    console.log({'facebook':response.data});
                    that.facebook(response.data);
                }
            });
        },
        getInstagramImages: function(hashtag, access_token){
            var that = this,
            url = "https://api.instagram.com/v1/tags/" 
                + hashtag 
                + "/media/recent?access_token=" 
                + access_token;

            $.ajax({
                url: url, jsonp: "callback", dataType: "jsonp", 
                data: { format: "json" },
                success: function( response ) {
                    if(response.data){
                        var mapped = $.map(response.data, function(item){
                            var image = item.images.standard_resolution.url;
                            var profile = item.picture;
                            return { user: profile, image: image}
                        });
                        for(var i=0;i<response.data.length;i++){
                            that.images.push(response.data[i]);
                        }
                    }

                }
            });
        }
    };
});