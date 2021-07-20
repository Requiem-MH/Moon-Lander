//Help Screen
MyGame.screens['helpScreen'] = (function(game) {
    'use strict';
    let interval = 0;

    //Function used to if user wants to change controls
    function getKeyPress(id) {
        let changedValue = false;
        let button = document.getElementById(id);
        let oldValue = button.value;

        //Changes input value if called
        let changeButtonValue = function(e) {
            button.value = e.key;
            button.innerHTML = e.key;
            changedValue = true;
        }

        //Add listener when user click on key change button
        button.addEventListener(
            "keyup", 
            changeButtonValue
        );

        //After 3 seconds, if no input is changed it reverts back to old input
        window.setInterval(function() {
            button.removeEventListener( 
                "keyup",
                changeButtonValue
            );
            if (changedValue === false) {
                button.value = oldValue;
                button.innerHTML = oldValue;
            }
        }, 3000);
    }

    function initialize() {
        document.getElementById('helpBackButton').addEventListener(
            'click',
            function() {
                game.showScreen('mainMenuScreen');
            }
        );
        document.getElementById('thrust').addEventListener(
            'click',
            function() {
                document.getElementById('thrust').innerHTML = "Awaiting Input";
                getKeyPress('thrust');
            }
        );
        document.getElementById('leftTilt').addEventListener(
            'click',
            function() {
                getKeyPress('leftTilt');
            }
        );
        document.getElementById('rightTilt').addEventListener(
            'click',
            function() {
                getKeyPress('rightTilt');
            }
        );
    }

    function run() {
        //Doesn't do anything
    }

    return {
        getKeyPress : getKeyPress,
        initialize : initialize,
        run : run
    };
}(MyGame.game));