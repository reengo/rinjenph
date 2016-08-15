define(['plugins/router', 'durandal/app', 'durandal/system', 'jquery'], function (router, app, system, jQuery) {
    return {
        router: router,
        search: function() {
            app.showMessage('Search is not working at the moment...');
        },
        activate: function () {
            router.map([
                { route: 'story', moduleId: 'viewmodels/welcome', nav: true },
                { route: 'friendship', moduleId: 'viewmodels/welcome', nav: true },
                { route: 'proposal', moduleId: 'viewmodels/welcome', nav: true },
                { route: '', title:'Welcome', hash: '/#', moduleId: 'viewmodels/welcome', nav: true },
                { route: 'hashboard', moduleId: 'viewmodels/hashboard', nav: true },
                { route: 'details', moduleId: 'viewmodels/details', nav: true },
                { route: 'thanks', moduleId: 'viewmodels/thanks', nav: true },
                { route: 'privacy', moduleId: 'viewmodels/privacy'}
            ]).buildNavigationModel();

            return router.activate();
        },
        attached: function(){
            $('.navbar').css('display','none');
            //$('section.first').css('height', $(window).height());
            $("html, body").animate({ scrollTop: 0 }, "slow");
            setInterval(function(){
                if($('#titlemarker').length > 0){
                    if($('#titlemarker').offset().top > 0){
                        $('.navbar').fadeOut('slow');
                    }else{
                        $('.navbar').fadeIn('slow');
                    }
                }else{
                    $('.navbar').fadeIn('slow');
                }
            }, 1000);
        },
        scroll: function(){
            console.log('test');
        }
    };
});