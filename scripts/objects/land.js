//Creates a land object with state managing functions
MyGame.objects.Land = function(spec) {
    'use strict';

    //Get background ready to render
    let imageReady = false;
    let image = new Image();

    image.onload = function() {
        imageReady = true;
    };

    image.src = spec.imageSrc;

    //Get landing image ready to render
    let landingImageReady = false;
    let landingImage = new Image();

    landingImage.onload = function() {
        landingImageReady = true;
    }
    landingImage.src = spec.imageSrc2;

    //Initialize start/end points and list for landing pads
    let range = new Set();
    let landingPads = [];
    let start = {x: 0, y: Random.nextRange(500, 750)}
    let end = {x: canvas.width, y: Random.nextRange(500, 750)}
    
    //check the entire land array everytime to see
    let canvasParts = canvas.width / spec.numPads;

    //Generate landing pads and add to list
    for (let i = 0; i < spec.numPads; i++) {
        let startX = Random.nextRange((canvasParts * i) + 100, canvasParts * (i + 1) - 100);
        let height = Random.nextRange(400, 750);
        let point = {
            start: {x: startX, y: height},
            end: {x: startX + spec.padSize, y: height}
        }
        landingPads[i] = point;
    }

    //Variable used to determin how many times buildRange recurses
    const REPEAT = 6;
    let roughVar = 1.3;

    //Function to build the land range
    function buildRange(pointA, pointB, occur, rough) {
        //Base Case
        if (occur > REPEAT) {
            return;
        }

        //Compute random height (Divide X values by 2 because grid height is half of grid width)
        let ranNum = (rough * Random.nextGaussian(0, .5)) * Math.abs((pointB.x / 2) - (pointA.x / 2));
        let height = 0.5 * (pointA.y + pointB.y) + ranNum;

        let midpoint = {
            x: (pointA.x + pointB.x) / 2,
            y: height
        }
        //Recursively add points to range starting with left and going to right so numbers are added sorted by x values
        buildRange(pointA, midpoint, occur+1, rough / 1.11);
        range.add(midpoint);
        buildRange(midpoint, pointB, occur+1, rough / 1.11);
    }
    //Add start point to range and buildRange between it and first landing pad
    range.add(start);
    buildRange(start, landingPads[0].start, 0, roughVar);
    range.add(landingPads[0].start);
    //buildRange between all landing pads
    for (let j = 0; j < landingPads.length; j++) {
        range.add(landingPads[j].end);
        if (landingPads[j + 1]) {
            buildRange(landingPads[j].end, landingPads[j+1].start, 0, roughVar);
            range.add(landingPads[j +1].start);
        }
    }
    //buildRange between last landing pad and end point, then add end point to range
    buildRange(landingPads[landingPads.length - 1].end, end, 0, roughVar);
    range.add(end);

    let rangeArray = [...range];
    let api = {
        padSize : spec.padSize,
        get imageReady() { return imageReady; },
        get image() { return image; },
        get landingImage() { return landingImage; },
        get range() { return range; },
        get rangeArray() { return rangeArray; },
        get numPads() { return spec.numPads; },
        get landingPads() { return landingPads; },
        get fillColor() { return spec.fillColor; }
    };

    return api;
}