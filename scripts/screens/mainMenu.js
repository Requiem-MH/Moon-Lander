MyGame.screens['mainMenuScreen'] = (function(game) {
    'use strict';

    function initialize() {
        //Setup each menu event for the screens
        document.getElementById('newGameButton').addEventListener(
            'click',
            function() {
                //Start a new game and set score to 0 when pressed and display game screen.
                MyGame.screens['gameScreen'].initialize();
                MyGame.score = 0;
                game.showScreen('gameScreen');
            }
        );
        document.getElementById('highScoreButton').addEventListener(
            'click',
            function() {
                game.showScreen('highScoreScreen');
            }
        );
        document.getElementById('helpButton').addEventListener(
            'click',
            function() {
                game.showScreen('helpScreen');
            }
        );
        document.getElementById('creditButton').addEventListener(
            'click',
            function() {
                game.showScreen('creditScreen');
            }
        );
    }

    function run() {
        //Doesn't do anything, just a simple screen
    }

    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game));