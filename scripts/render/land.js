//Renders a Lander Object
MyGame.render.Land= (function(graphics) {
    'use strict';

    function render(spec) {
        if (spec.image) {
            graphics.drawLand(spec);
        }
        
    }

    return {
        render : render
    };
}(MyGame.graphics));