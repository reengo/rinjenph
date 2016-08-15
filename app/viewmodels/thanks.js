define(['plugins/http', 'durandal/app', 'knockout'], function (http, app, ko) {
    return {
        displayName: 'Thanks',
        contactName: ko.observable(''),
        contactEmail: ko.observable(''),
        contactMessage: ko.observable(''),
        alertStyle: ko.observable('info'),
        flash:ko.observable(''),
        sending:ko.observable(false),
        activate: function () {
            
        },
        attached: function(){
        },
        select: function(item) {
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
        },
        sendMail: function(){
            var that = this;
            this.sending(true);
            $.ajax({
              type: 'POST',
              url: 'https://mandrillapp.com/api/1.0/messages/send.json',
              data: {
                'key': 'Ig-CsRsaxFbohsLl0eMcEQ',
                'message': {
                  'from_email': 'me@ringo.ph',
                  'to': [
                      {
                        'email': 'me@ringo.ph',
                        'name': '',
                        'type': 'to'
                      },
                      {
                        'email': this.contactEmail(),
                        'name': this.contactName(),
                        'type': 'to'
                      }
                    ],
                  'autotext': 'true',
                  'subject': 'Wedding Details Inquiry',
                  'html': 'Thank you for your feedback <strong>' + this.contactName() + '</strong>,<br /><br /> Jennifer and Ringo will be delighted to read these awesome feedback.. Thank you so much.<br /><br />Your Message: <br /><br />' + this.contactMessage() + '<br /><br />Regards,<br /><strong>Jennifer & Ringo</strong><br />wedding couple'
                }
              }
             }).done(function(response) {
                $(response).each(function(i, el){
                    if(el.status == 'sent'){
                     that.flash('<strong>You have just sent your inquiry...</strong> check your email, chances are, the couple had already responded :D');
                     that.alertStyle('alert-success');
                   }else{
                    that.alertStyle('alert-danger');
                    that.flash('<strong>Tsktsk!</strong> Something went wrong. Please try again later.');
                   }
                });
               that.sending(false);
               
             })
        },
        _sendMail: function(){
            console.log('sent');
            var self = this;

            var name = this.contactName(),
            email = this.contactEmail(),
            subject = 'Rinjen Inquiry',
            msg = this.contactMessage(),
            dataString = 'name=' + name + '&email=' + email + '&subject=' + subject + '&message=' + msg;

            if (this.validateEmail(email) && (msg.length > 1) && (name.length > 1) && (subject.length > 1) ){
                $.ajax({
                    type: "POST",
                    url: "/mail.php",
                    data: dataString,
                    success: function(response){
                        console.log(response);
                        self.flash('<strong>Message Sent!</strong> Thank you for stopping by.');
                        self.alertStyle('alert-success');
                    }
                });
            } else{
                this.alertStyle('alert-danger');
                this.flash('<strong>Oops!</strong> Something went wrong. Please try again later.');
            }

            return false;
        },
        validateEmail: function(emailAddress) {
            var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
            return pattern.test(emailAddress);
        }
    };
});