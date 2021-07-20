//Game Object

MyGame.game = (function(screens) {
    'use strict';
    
    //Used to change to a new active screen
    function showScreen(id) {

        // Remove the active state from all screens.  There should only be one...
        let active = document.getElementsByClassName('active');
        for (let screen = 0; screen < active.length; screen++) {
            active[screen].classList.remove('active');
        }

        // Tell the screen to start actively running
        screens[id].run();

        // Then, set the new screen to be active
        document.getElementById(id).classList.add('active');
    }

    function initialize() {
        let screen = null;

        // Go through each of the screens and tell them to initialize
        for (screen in screens) {
            if (screens.hasOwnProperty(screen)) {
                screens[screen].initialize();
            }
        }

        // Make the main-menu screen the active one
        showScreen('mainMenuScreen');
    }

    return {
        initialize : initialize,
        showScreen : showScreen
    };
    
}(MyGame.screens));