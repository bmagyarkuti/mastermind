/**
 * Created by barna on 31/05/16.
 */
$(document).ready(function () {
    let gameModel = createGameModel();
    let gameUI = createGameUI(gameModel);
    let persistence = createGamePersistence(gameModel, gameUI.mineAjaxToken());

    $('button#submitButton').click(function (e) {
        e.preventDefault();
        gameUI.onSubmitButtonClicked();
    });

    persistence.successfullySavedEvent.addListener(function(stats) {
        gameUI.showSuccessResponse(stats);
    });

    persistence.couldNotSaveEvent.addListener(function() {
        gameUI.showFailureResponse();
    })
});