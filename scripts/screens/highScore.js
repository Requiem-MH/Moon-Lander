MyGame.screens['highScoreScreen'] = (function(game) {
    'use strict';

    function initialize() {
        document.getElementById('highScoreBackButton').addEventListener(
            'click',
            function() {
                game.showScreen('mainMenuScreen');
            }
        );
    }

    function run() {
        const highScoresList = document.getElementById("highScoresList");
        const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

        //Grabs all high scores and puts them onto high score screen
        highScoresList.innerHTML = highScores.map(
            score => {
                return `<li>${score}</li>`;
            }
        ).join("");
    }

    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game));