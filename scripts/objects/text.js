//Create a Text object with state managing functions
MyGame.objects.Text = function(spec) {
    'use strict';
     
    let rotation = 0;
    //Update text rotation
    function updateRotation(howMuch) {
        rotation += howMuch;
    }

    //Update text wording
    function setText(words) {
        spec.text = words;
    }

    //Update text color
    function setColor(color) {
        spec.color = color;
    }

    //Update text
    function update(text, color, outline) {
        spec.text = text;
        spec.color = color;
        if(outline) {
            spec.strokeColor = outline;
        }
    }
    
    let api = {
        updateRotation : updateRotation,
        setText : setText,
        setColor : setColor,
        update : update,
        get rotation() { return rotation; },
        get position() { return spec.position; },
        get text() { return spec.text; },
        get font() { return spec.font; },
        get color() { return spec.color; },
        get strokeColor() { return spec.strokeColor; }
    };

    return api;
}