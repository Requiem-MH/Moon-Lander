MyGame.graphics = (function() {
    'use strict';

    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    //Helper function to draw grid on canvas to make it easier to place things
    //Can be called in render function by graphics.drawGrid(context);
    function drawGrid(ctx, minor, major, stroke, fill) { 
        minor = minor || 10;
        major = major || minor * 5;
        stroke = stroke || "#00FF00";
        fill = fill || "#009900";
        ctx.save();
        ctx.strokeStyle = stroke;
        ctx.fillStyle = fill;
        let width = ctx.canvas.width; 
        let height = ctx.canvas.height;
        for(var x = 0; x < width; x += minor) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.lineWidth = (x % major == 0) ? 0.5 : 0.25;
            ctx.stroke();
            if(x % major == 0 ) {
                ctx.fillText(x, x, 10);
            } 
        }
        for(var y = 0; y < height; y += minor) { 
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.lineWidth = (y % major == 0) ? 0.5 : 0.25; 
            ctx.stroke();
            if(y % major == 0 ) {
                ctx.fillText(y, 0, y + 10);
            }
        }
      ctx.restore();
    }

    //Draws a texture to the canvas (Used by particle system)
    function drawTexture(image, center, rotation, size) {
        context.save();

        context.translate(center.x, center.y);
        context.rotate(rotation);
        context.translate(-center.x, -center.y);

        context.drawImage(
            image,
            center.x - size.x / 2,
            center.y - size.y / 2,
            size.x, size.y);

        context.restore();
    }

    //Draws text to canvas
    function drawText(spec) {
        context.save();

        context.font = spec.font;
        context.strokeStyle = spec.strokeColor;
        context.fillStyle = spec.color;
        context.fillText(spec.text, spec.position.x, spec.position.y);
        context.strokeText(spec.text, spec.position.x, spec.position.y);

        context.restore();
    }

    //Draws ship to canvas
    function drawShip(spec) {
        context.save();

        context.translate(spec.center.x, spec.center.y);
        context.rotate(spec.angle);
        context.translate(-spec.center.x, -spec.center.y);

        context.drawImage(
            spec.image,
            spec.center.x - spec.size.width / 2,
            spec.center.y - spec.size.height / 2,
            spec.size.width, spec.size.height);
        
        context.restore();
        spec.setEngine(false);
    }
    
    //Draws land and background
    function drawLand(spec) {
        context.save();
        
        context.drawImage(spec.image, 0, 0, canvas.width, canvas.height);

        context.strokeStyle = 'rgba(0, 0, 0, 1';
        context.fillStyle = spec.fillColor;
        context.lineWidth = 2;
        context.beginPath();
        for (let point of spec.range) {
            context.lineTo(point.x, point.y);
        }
        context.lineTo(canvas.width, canvas.height);
        context.lineTo(0, canvas.height);
        context.closePath();
        context.stroke();
        context.fill();

        for (let point2 of spec.landingPads) {
            context.drawImage(spec.landingImage, point2.start.x + 28, point2.start.y - 24, spec.padSize, 25);
        }
        
        context.restore();
    }

    let api = {
        get canvas() { return canvas; },
        clear: clear,
        drawTexture: drawTexture,
        drawText: drawText,
        drawShip: drawShip,
        drawGrid: drawGrid,
        drawLand: drawLand
    };

    return api;
}());