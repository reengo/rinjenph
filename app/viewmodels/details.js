define(['plugins/http', 'durandal/app', 'knockout'], function (http, app, ko) {
    return {
    	displayName: 'Jennifer & Ringo',
        intro: 'A Wedding of Perfect Harmony',
        seeya: 'See You There',
        contactName: ko.observable(''),
        contactEmail: ko.observable(''),
        contactMessage: ko.observable(''),
        alertStyle: ko.observable('info'),
        flash:ko.observable(''),
        sending:ko.observable(false),
        entourage: ko.observableArray([]),
        activate: function () {

        },
        // canDeactivate: function () {
        //     //the router's activator calls this function to see if it can leave the screen
        //     return app.showMessage('Are you sure you want to leave this page?', 'Navigate', ['Yes', 'No']);
        // },
        attached: function(){
        	var that = this;
        	$(document).on('mousewheel DOMMouseScroll MozMousePixelScroll', function(event, delta) {
                that.parallax('#wedding', 4);
                that.parallax('#altar', 4);
                //you could trigger window scroll handler
                $(window).triggerHandler('scroll');
            });
            
            $.ajax({
              type: 'GET',
              url: '/api/entourage',
              dataType: 'json',
              success: function(response){
                if(response){
                    that.entourage(response);
                }
              }
             }).done(function(response) {
               console.log({'entourage':response});
             })
        },
        parallax: function(element, delay){
            if(typeof $(element+'.parallax').offset().top != -1){
                $(element+'.parallax').css('background-position-y', ( $(element+'.parallax').offset().top / delay ) + 'px');
            }
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
                  'html': 'Thank You <strong>' + this.contactName() + '</strong>,<br /><br /> You have just sent an inquiry to Jennifer and Ringo\'s Wedding Orgnaizers. You will get a response the soonest. <br /><br />Your Message: <br /><br />' + this.contactMessage() + '<br /><br />Sincerely,<br /><strong>Jennifer & Ringo</strong><br />wedding couple'
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