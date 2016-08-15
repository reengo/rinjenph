define(['plugins/http', 'durandal/app', 'knockout', 'moment'], function (http, app, ko, moment) {
    return {
        settings: {
            endpoint: ko.observable('http://jennifer.ringo.ph/api'),
            hashtags: ko.observableArray([
                'rinjenph',
                'ringjengph',
                'rinjinph'
            ]),
            servePhotos: ko.observable(false)
        },
        displayName: 'Hashboard',
        loaded: ko.observable(false),
        profile: ko.observable(''),
        profiles: ko.observableArray([]),
        images: ko.observableArray([]),
        fbImages: ko.observable(0),
        nextUrl: ko.observable(''),
        newtag: ko.observable(''),
        currentTag: ko.observable(''),
        useFacebook: ko.observable(true),
        igInitLoad:ko.observable(false),
        igError:ko.observable(''),
        fbUser: {
            name: ko.observable(''),
            picture: ko.observable(''),
        },
        activate: function () {
            var self = this;
            //get users
            $.ajax({
                url : this.settings.endpoint() + '/couch/?method=get&doc=users',
                dataType: 'json',
                type : 'GET',
                success : function(response) {
                    if(response.rows){
                        $(response.rows).each(function(i,l){
                            self.fbUser.picture(l.value.picture);
                            self.profiles.push(l.value.picture);
                        });
                    }
                }
              });
            //get photos
            if(self.settings.servePhotos()){
                self.getPhotos();
            }
        },
        getPhotos: function(){
            $.ajax({
                url : this.settings.endpoint() + '/couch/?method=get&doc=photos',
                dataType: 'json',
                type : 'GET',
                success : function(response) {
                    if(response.rows){
                        $(response.rows).each(function(i,l){
                            var data = { 
                                origin:'fb',
                                image: l.value.image,
                                thumbnail: l.value.thumbnail,
                                low: l.value.low,
                                caption:l.value.caption,
                                link: l.value.link,
                                user: l.value.user, 
                                name: l.value.name,
                                created: moment(l.value.created_at).unix
                            }
                            self.fbImages(self.fbImages()+1);
                            self.images.push(data);
                        });
                    }
                }
              });
        },
        select: function(item) {
            item.viewUrl = 'views/detail';
            app.showDialog(item);
        },
        filterUser: function(data){

            $('.ig-posts').fadeOut();
            $('[data-profile="'+data+'"]').fadeIn();

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

            console.log({'loaded':self.loaded()});
            if(!self.loaded()){
                for(var i =0; i<this.settings.hashtags().length; i++){
                    self.igInitLoad(true);
                    this.getInstagramImages(this.settings.hashtags()[i], this.settings.instagram);
                }
                self.loaded(true);
            }

            FB.init({
                appId      : '707440189383318',
                version    : 'v2.3'
              });

            FB.getLoginStatus(function(response) {
                if(response.status === 'connected'){
                    self.getProfile();
                }else{
                    app.showMessage('It would be great if you share your pictures from the event that you personally posted on Facebook. Please login to Facebook and let us do the dirty work :D We will look for posts hashtagged #rinjenph and add it on the board here.... with your permission ofcourse.', 'Contribute Your Pictures', ['Login to Facebook', 'No Thanks...'])
                        .then(function(result){
                            if(result == 'Login to Facebook'){
                                self.fbLogin();
                            }else{
                                app.showMessage('<img src="/img/okay.jpg">', 'Aww... thats too bad..');
                            }
                        });
                }
            });
            
          },
          notify: function(subject, message){
            // $.ajax({
            //   type: 'POST',
            //   url: 'https://mandrillapp.com/api/1.0/messages/send.json',
            //   data: {
            //     'key': 'Ig-CsRsaxFbohsLl0eMcEQ',
            //     'message': {
            //       'from_email': 'me@ringo.ph',
            //       'to': [{
            //             'email': 'me@ringo.ph',
            //             'name': '',
            //             'type': 'to'
            //           }],
            //       'autotext': 'true',
            //       'subject': subject,
            //       'html': JSON.stringify(message)
            //     }
            //   }
            //  });
          },
          getProfile: function(){
            var self = this;
            FB.api(
                "/me",
                function (response) {
                  if (response && !response.error) {
                    self.fbUser.name(response.name);
                    self.notify('User Logged In', response);

                    FB.api(
                        "/me/picture",
                        function (response) {
                          if (response && !response.error && self.profiles().length > 0) {
                            if(self.profiles.indexOf(response.data.url) === -1){
                                self.saveData('New User', {
                                    "type":"user",
                                    "name":self.fbUser.name(), 
                                    "picture":response.data.url
                                });
                                self.fbUser.picture(response.data.url);
                                self.profiles.push(response.data.url);
                            }
                            self.getFacebookImages();
                          }
                        }
                    );
                  }
                }
            );
          },
          fbLogin: function(){
            var self = this;
            FB.login(function(response){
             if (response.authResponse) {
                self.getProfile();                 
               } else {
                 app.showMessage('The site will only use your facebook profile to get links to pictures you posted from the wedding. ', 'Reconsider authorizing? :D', ['Shut Up and Take My Photos', 'No!']).then(function(result){
                    if(result != 'No!'){
                        self.fbLogin();
                    }else{
                        app.showMessage('<img src="/img/okay.jpg">', 'Aww... thats too bad..');
                    }
                    
                 });
               }
            }, {scope: 'public_profile, email, user_friends, user_posts'});    
          },
          saveData: function(type, data){
            var self = this;
            $.ajax({
                url : 'http://reengo.iriscouch.com/rinjen',
                data : JSON.stringify(data),
                contentType : "application/json",
                dataType : 'json',
                type : 'POST',
                success : function(response) {
                    self.notify(type + ' Added', data);
                }
              });
          },
        getFacebookImages: function(){
            var self = this;

            FB.api(
            //"/10153169550275817/photos",
            //'/me/posts?until=1434240000&limit=100&since=1433635200',
            //'/me/photos?fields=images&since=1433635200&limit=100&until=1434240000',
            'me/posts?fields=description,full_picture,picture,link&until=1434240000&limit=100&since=1433635200',
            function (response) {
                $(response.data).each(function(i,l){
                    if(typeof l.description !== 'undefined'){
                        if(l.description.indexOf('#rinjenph')){
                            if(l.full_picture){
                                var data = { 
                                    origin:'fb',
                                    type:'photo',
                                    image: l.full_picture,
                                    thumbnail: l.picture,
                                    low: l.full_picture,
                                    caption:l.description,
                                    link: l.link,
                                    user: self.fbUser.picture(), 
                                    name: self.fbUser.name(),
                                    created: moment(l.created_at).unix
                                }
                                
                                var match = ko.utils.arrayFirst(self.images(), function(item) {
                                    return data.image === item.image;
                                });

                                if (!match) {
                                    self.saveData('New Photo', data);
                                    self.fbImages(self.fbImages()+1);
                                    self.images.push(data);
                                }
                            }
                        }
                    }
                })
                
                app.showMessage('Good to see you again <strong>' + self.fbUser.name() + '</strong>, So far... we found: '+self.fbImages()+' Photos from your facebook profile:D <br><br>Once moderated, we\'ll have it listed here for others to see. Thank you so much for contributing.', 'Photo Contribution');

            });
        },
        updateTags: function(){
            if(this.settings.hashtags.indexOf(this.newtag()) < 0){
                this.settings.hashtags.push(this.newtag());
                this.getInstagramImages(this.newtag(), this.settings.instagram);
            }
        },
        getInstagramImages: function(hashtag, access_token){

            var self = this;
            if(typeof hashtag == 'undefined'){
                var hashtag = self.currentTag()
            }
            var url = this.nextUrl() === '' ? self.settings.endpoint() + "/instagram/?hashtag=" + hashtag : self.settings.endpoint() + '/instagram/?hashtag='+hashtag+'&next=' + this.nextUrl();

            $.ajax({
                url: url,
                dataType: 'json',
                type : 'GET',
                success: function( response ) {
                    if(response.data){
                        for(var i=0;i<response.data.length;i++){
                            if(response.data[i].images.standard_resolution.url){
                                var username = ko.observable( response.data[i].images.username );
                                var high = ko.observable( response.data[i].images.standard_resolution.url );
                                var low = ko.observable( response.data[i].images.low_resolution.url );
                                var thumbnail = ko.observable( response.data[i].images.thumbnail.url );
                                var profile = ko.observable( response.data[i].user.profile_picture );
                                var name = ko.observable( response.data[i].user.full_name );
                                var caption = ko.observable( response.data[i].caption.text );
                                var link = ko.observable( response.data[i].link );
                                var created = ko.observable(response.data[i].created_time);
                                var visible = ko.observable( true );
                               
                                self.images.push({ 
                                    origin: 'ig',
                                    visible: visible,
                                    user: profile, 
                                    username: username,
                                    name: name,
                                    image: high,
                                    thumbnail: thumbnail,
                                    low: low,
                                    caption:caption,
                                    link:link,
                                    created:created
                                });

                                if (self.profiles.indexOf( profile() ) < 0) {
                                  self.profiles.push(profile());
                                }
                            } 
                        }

                        if(typeof response.pagination.next_url !== 'undefined'){
                            if(self.nextUrl() !== response.pagination.next_url){
                                self.nextUrl(response.pagination.next_max_tag_id);
                                self.currentTag(hashtag);
                            }
                        }else{
                            self.nextUrl('');
                        }

                        if(self.igInitLoad){
                            if(self.nextUrl() != '' && self.nextUrl() !== response.pagination.next_url){
                                self.getInstagramImages();
                            }
                            self.igInitLoad(false);
                        }
                    }

                    if(response.meta.error_message){
                        self.igError(response.meta.error_message);
                    }
                }
            });
        }
    };
});