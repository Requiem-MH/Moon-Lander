//Credit Screen
MyGame.screens['creditScreen'] = (function(game) {
    'use strict';

    function initialize() {
        document.getElementById('creditBackButton').addEventListener(
            'click',
            function() {
                game.showScreen('mainMenuScreen');
            }
        );
    }

    function run() {
        //Doesn't do anything
    }

    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game));