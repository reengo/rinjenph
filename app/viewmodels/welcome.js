define(['plugins/http', 'durandal/app', 'knockout', 'ytplayer'], function (http, app, ko, ytplayer) {
    return {
        displayName: 'A Wedding of Perfect Harmony',
        introTitle: '“And above all these put on Love... <br />which binds everything together in Perfect Harmony”',
        storyTitle: 'Gijena: Fan meets idol',
        storyIntro: 'It all began one fine evening...',
        proposalTitle: 'Conspiracy',
        weddingTitle: 'Perfect Harmony',
        description: 'blah',
        activate: function () {
            //activate
            
            
        },
        attached: function(){
            var that = this;

            $("#welcome").YTPlayer();
            console.log({'testingyt':ytplayer});
            $('.navbar').css('display','none');

            $.getScript( "//platform.instagram.com/en_US/embeds.js", function( data, textStatus, jqxhr ) {
              console.log( data ); // Data returned
              console.log( textStatus ); // Success
              console.log( jqxhr.status ); // 200
              console.log( "Load was performed." );
            });

            var bgpos = 0;
            $('.jeng-rotate,.goi-rotate').on('click', function(){
                bgpos = $(this).css('background-position-x');
                bgpos = bgpos != '0%' ? $(this).css('background-position-x').slice(0, -2) : 0;

                console.log({'yeye': bgpos});

                $(this).css('background-position-x', (Number(bgpos) - 135) + 'px' );
            });

            $(document).on('mousewheel DOMMouseScroll MozMousePixelScroll', function(event, delta) {
                that.parallax('#welcome', 4);
                that.parallax('#intro', 4);
                //that.parallax('#proposal', 4);
               // that.parallax('#story2', 4);

                //you could trigger window scroll handler
                $(window).triggerHandler('scroll');
            });

            $('.zoom img').on('mouseover', function(){
                console.log('hovered');
                $(this).css({
                    '-webkit-transition': 'scale(2)'
                })
            });

            $('.nav-arrow').on({
                mouseover: function(){
                    $(this).css('opacity', 1);
                },
                mouseout: function(){
                    $(this).css('opacity', 0.7);
                },
                click: function(){
                    var target = $(this).attr('href');
                    console.log({'target':target});
                    console.log({'target-offset':$(target).offset().top});
                    $(document.body).animate({
                      scrollTop: 0
                    }, 1000);
                }
            });

            $('[data-toggle="tooltip"]').tooltip();
        },
        select: function(item) {
            item.viewUrl = 'views/profile';
            app.showDialog(item);
        },
        parallax: function(element, delay){
            $(element+'.parallax').css('background-position', '0 ' + ( $(element+'.parallax').offset().top / delay ) + 'px');
        },

        activateBookmark: function(bookmark) {
            var bookmark = $(bookmark, view);
            $(document.body).animate({ scrollTop: bookmark.offset().top });
        }
    };
});