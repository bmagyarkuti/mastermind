let createGamePersistence = function (model) {
    let gameModel = model;
    let successfullySavedEvent = createEvent();
    let couldNotSaveEvent = createEvent();

    let init = function() {
        model.gameLostEvent.addListener(saveGameAjax);
        model.gameWonEvent.addListener(function() {});
    };

    let saveGameAjax = function({results}) {
        $.ajax("ajax/postResults", {
            type: 'POST',
            dataType: 'JSON',
            data: results
        }).done(function(data) {
            if (data.success) {
                successfullySavedEvent.notify();
            } else {
                couldNotSaveEvent.notify();
            }
        }).fail(function() {
            couldNotSaveEvent.notify();
        });
    };

    init();

    return {
        successfullySavedEvent : successfullySavedEvent,
        couldNotSaveEvent : couldNotSaveEvent
    };
};