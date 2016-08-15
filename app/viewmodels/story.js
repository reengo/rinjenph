define(['plugins/http', 'durandal/app', 'knockout'], function (http, app, ko) {
    return {
        displayName: 'Gijena',
        intro: 'It all began one fine evening...',
        profile: ko.observable(''),
        images: ko.observableArray([]),
        facebook: ko.observableArray([]),
        activate: function () {
            //the router's activator calls this function and waits for it to complete before proceeding
            if (this.images().length > 0) {
                return;
            }
            var that = this;
        },
        select: function(item) {
            //the app model allows easy display of modal dialogs by passing a view model
            //views are usually located by convention, but you an specify it as well with viewUrl
            item.viewUrl = 'views/detail';
            app.showDialog(item);
        }
    };
});