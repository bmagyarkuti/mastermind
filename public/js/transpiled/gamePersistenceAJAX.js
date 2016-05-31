'use strict';

var createGamePersistence = function createGamePersistence(model, token) {
    var gameModel = model;
    var AjaxToken = token;

    var successfullySavedEvent = createEvent();
    var couldNotSaveEvent = createEvent();

    var init = function init() {
        model.gameLostEvent.addListener(saveGameAjax);
        model.gameWonEvent.addListener(saveGameAjax);
    };

    var saveGameAjax = function saveGameAjax(_ref) {
        var results = _ref.results;

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': token
            }
        });

        $.ajax("ajax/postResults", {
            type: 'POST',
            dataType: 'JSON',
            data: results
        }).done(function (data) {
            if (data.success) {
                successfullySavedEvent.notify(data.stats);
            } else {
                couldNotSaveEvent.notify();
            }
        }).fail(function () {
            couldNotSaveEvent.notify();
        });
    };

    init();

    return {
        successfullySavedEvent: successfullySavedEvent,
        couldNotSaveEvent: couldNotSaveEvent
    };
};