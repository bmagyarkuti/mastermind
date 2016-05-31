let createGamePersistence = function (model, token) {
    let gameModel = model;
    console.log('Token:', token);
    let AjaxToken = token;

    let successfullySavedEvent = createEvent();
    let couldNotSaveEvent = createEvent();

    let init = function() {
        model.gameLostEvent.addListener(saveGameAjax);
        model.gameWonEvent.addListener(saveGameAjax);
    };

    let saveGameAjax = function({results}) {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': token
            }
        });

        $.ajax("ajax/postResults", {
            type: 'POST',
            dataType: 'JSON',
            data: results
        }).done(function(data) {
            if (data.success) {
                successfullySavedEvent.notify(data.stats);
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