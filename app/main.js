requirejs.config({
    paths: {
        'text': '../lib/require/text',
        'durandal':'../lib/durandal/js',
        'plugins' : '../lib/durandal/js/plugins',
        'transitions' : '../lib/durandal/js/transitions',
        'knockout': '../lib/knockout/knockout-3.1.0',
        'bootstrap': '../lib/bootstrap/js/bootstrap',
        'jquery': '../lib/jquery/jquery-1.9.1',
        'facebook': '//connect.facebook.net/en_US/sdk',
        'moment': '../lib/moment/moment',
        'ytplayer': '../lib/ytplayer/jquery.mb.YTPlayer'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: 'jQuery'
       },
       'facebook' : {
            exports: 'FB'
        },
        'parallax' : {
            deps: ['jquery'],
            exports: 'parallax'
        },
        'ytplayer' : {
            deps: ['jquery'],
            exports: 'ytplayer'
        }
    }
});

define(['durandal/system', 'durandal/app', 'durandal/viewLocator', 'jquery', 'facebook', 'bootstrap', 'moment'],  function (system, app, viewLocator, $) {
    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

    app.title = 'Jennifer and Ringo\'s Wedding';

    app.configurePlugins({
        router:true,
        dialog: true
    });

    app.start().then(function() {
        //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
        //Look for partial views in a 'views' folder in the root.
        viewLocator.useConvention();

        //Show the app by setting the root view model for our application with a transition.
        app.setRoot('viewmodels/shell', 'entrance');
    });
});