//Renders a Ship Object
MyGame.render.Ship = (function(graphics) {
    'use strict';

    function render(spec) {
        if (spec.engineOn) {
            spec.renderSmoke.render();
            spec.renderFire.render();
        };
        if (spec.imageReady) {
            graphics.drawShip(spec);
        }
    }

    return {
        render : render
    };
}(MyGame.graphics));