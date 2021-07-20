//Function to make a level
function levelMaker(objects, identifier, numberPads, padSize) {
    'use strict';

    let random = Random.nextRange(1, 3);
    let background;
    if (random === 1) {
        background = 'assets/images/level1Background.png';
    } else {
        background = 'assets/images/level2Background.png'
    }

    let id = identifier;
    let name = "Level " + id;
    let land = objects.Land({
        imageSrc: background,
        imageSrc2: 'assets/images/flag.png',
        numPads: numberPads,
        padSize: padSize,
        fillColor: 'lightgrey'
    });

    let ship = objects.Ship({
        imageSrc: 'assets/images/ship.png',
        center: { x: 50, y: 50 },
        size: { width: 20, height: 20 },
        velocity: { x: 0.5, y: 0 },
        circle: {
            center: {x: 50, y: 50},
            radius: 7
        },
        angle: 4.71,
        thrust: .01,
        fuel: 50,
        engineOn: false
    });

    let api = {
        id : id,
        name : name,
        land : land,
        ship : ship
    };

    return api;
}