'use strict';

/**
 * Created by Barna Magyarkuti on 31/05/16.
 *
 * Dependencies:
 *
 * *gameEvent.js
 * *gameModel.js
 * *gamePersistenceAJAX.js
 * *gameUI.js
 *
 */
$(document).ready(function () {
    var gameModel = createGameModel();
    var gameUI = createGameUI(gameModel);
    var persistence = createGamePersistence(gameModel, gameUI.mineAjaxToken());

    gameUI.inputsToBootstrapDropdowns();

    $('button#submitButton').click(function (e) {
        e.preventDefault();
        gameUI.onSubmitButtonClicked();
    });

    $('a#newGame').click(function (e) {
        e.preventDefault();
        gameUI.startNewGame();
    });

    persistence.successfullySavedEvent.addListener(function (stats) {
        gameUI.showSuccessResponse(stats);
    });

    persistence.couldNotSaveEvent.addListener(function () {
        gameUI.showFailureResponse();
    });
});