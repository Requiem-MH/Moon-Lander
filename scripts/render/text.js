//Renders a Text Object
MyGame.render.Text = (function(graphics) {
    'use strict';

    function render(spec) {
        graphics.drawText(spec);
    }

    return {
        render: render
    };
    
}(MyGame.graphics));