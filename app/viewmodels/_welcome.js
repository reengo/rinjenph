define(['jquery'], function($) {
    var ctor = function () {
        this.displayName = 'A Wedding of Perfect Harmony';
        this.introTitle = '“And above all these put on Love, <br />which binds everything together in Perfect Harmony”';
        this.storyTitle = 'Gijena: Fan meets idol';
        this.storyIntro = 'It all began one fine evening...';
        this.proposalTitle = 'Conspiracy';
        this.weddingTitle = 'Perfect Harmony';
        this.description = 'blah';
        this.features = [
            'test',
            'test2',
            'test3'
        ];
        $('.navbar').css('display','none');
    };

    return ctor;
});

ko.bindingHandlers.script = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        console.log('haha');
        var scriptName = ko.utils.unwrapObservable(valueAccessor());
        $(element).html("<script src='" + scriptName + "'></script>");
    }
};