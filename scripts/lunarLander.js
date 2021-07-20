//All code for this project is based of lecture materials, lecture notes, and
//code designs given by Dr. James Dean Mathias

MyGame.screens['gameScreen'] = (function(game, objects, renderer, graphics, input, levels) {
    'use strict';
    //Constant Variables used to 
    let lastTimeStamp;
    let cancelNextRequest = true;
    let myKeyboard = input.Keyboard();
    let GRAVITY = 0.003;
    let waitTimer = 0;
    let score = 0;
    
    //Text color constant variables
    let statusColor = "#FFFFFF"
    let fuelColor = "#FFFFFF"
    let angleColor = "#FFFFFF"
    let speedColor = "#FFFFFF"
    let speedXColor = "#FFFFFF"
    let speedYColor = "#FFFFFF"

    //Variables specific to level
    let id;
    let level;
    let land;
    let ship;
    
    //Displayed upon good landing between levels
    let waitingText = objects.Text({
        text: "Good Landing Pilot!!!",
        font: '50pt Arial',
        color: '#FFFFFF',
        strokeColor: '#000000',
        position: {x: 510, y: 350}
    });

    //Displayed upon good landing between levels
    let countDownText = objects.Text({
        text: "Next Level in 3",
        font: '35pt Arial',
        color: "#FFFFFF",
        strokeColor: '#000000',
        position: {x: 650, y: 450}
    });

    //Displayed upon Game Over
    let gameOverText = objects.Text({
        text: "Crash Landing! Game Over...",
        font: '50pt Arial',
        color: "#FFFFFF",
        strokeColor: '#000000',
        position: {x: 370, y: 400}
    });

    //Displayed upon Game over to show player score
    let scoreText = objects.Text({
        text: "Score: ",
        font: '40pt Arial',
        color: fuelColor,
        strokeColor: '#000000',
        position: {x: 670, y: 450}
    });

    //Ship status texts
    let statusText = objects.Text({
        text: 'Status:',
        font: '15pt Arial',
        color: statusColor,
        strokeColor: statusColor,
        position: {x: 1450, y: 50}
    });

    let fuelText = objects.Text({
        text: 'Fuel: 0 ',
        font: '13pt Arial',
        color: fuelColor,
        strokeColor: fuelColor,
        position: {x: 1465, y: 75}
    });

    let angleText = objects.Text({
        text: 'Angle: 0 \u00B0',
        font: '13pt Arial',
        color: angleColor,
        strokeColor: angleColor,
        position: {x: 1465, y: 100}
    });

    let speedText = objects.Text({
        text: 'Speed:',
        font: '13pt Arial',
        color: speedColor,
        strokeColor: '#FFFFFF',
        position: {x: 1465, y: 125}
    });

    let speedXText = objects.Text({
        text: 'X: 0',
        font: '11pt Arial',
        color: speedXColor,
        strokeColor: speedXColor,
        position: {x: 1480, y: 150}
    });

    let speedYText = objects.Text({
        text: 'Y: 0',
        font: '11pt Arial',
        color: speedYColor,
        strokeColor: speedYColor,
        position: {x: 1480, y: 175}
    });

    //Victory sound
    let victorySound = new sound("assets/sounds/victory.wav");
    //Explosion sound
    let explosionSound = new sound("assets/sounds/explosion2.mp3");

    let explosionFire = MyGame.systems.Explosion({
        center: { x: 0, y: 0 }, 
        angle: 0,
        size: { mean: 50, stdev: 4 },
        speed: { mean: 50, stdev: 25 },
        lifetime: { mean: .5, stdev: .5 }
        },
        graphics);
    
    let explosionSmoke = MyGame.systems.Explosion({
            center: { x: 0, y: 0},
            angle: 0,
            size: { mean: 40, stdev: 4 },
            speed: { mean: 50, stdev: 25 },
            lifetime: { mean: .5, stdev: .2 }
        },
        graphics);

    let renderFire = MyGame.render.ParticleSystem(explosionFire, MyGame.graphics, 'assets/images/fire.png');
    let renderSmoke = MyGame.render.ParticleSystem(explosionSmoke, MyGame.graphics, 'assets/images/smoke-2.png');

    //Update input
    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }

    //Update all game variables
    function update(elapsedTime) {
        //Only go into this is level is active
        if (MyGame.status.includes("Level")) {  //Regular Game Play
            //Update Explosion to be ship is when it wrecks
            explosionFire.setPosition(ship.center.x , ship.center.y);
            explosionSmoke.setPosition(ship.center.x , ship.center.y);

            //Update ship
            ship.update(elapsedTime, GRAVITY);

            //Logic for checking ship angle within 355 - 5 degrees
            let shipAngle = ship.angleDegree();
            if (shipAngle <= 30) {
                shipAngle += 360;
            }

            //Check for collision
            for (let i = 0; i < land.rangeArray.length; i++) {
                if (land.rangeArray[i + 1]) {
                    if (ship.detectCollision(land.rangeArray[i], land.rangeArray[i+1], ship.circle)) {
                        // ship.setVelocity(0, 0);
                        //Colision found, check ship velocity and angle for win
                        if (ship.velocity.x * 10 >= -3 && ship.velocity.x * 10 <= 3 
                            && ship.velocity.y * 10 >= -3 && ship.velocity.y * 10 <= 3
                            && shipAngle >= 354 && shipAngle <= 366) {
                            //if ship velocity and angle are correct, check if on landing pad
                            for (let j = 0; j < land.landingPads.length; j++) {
                                if (MyGame.status !== "Waiting") {
                                    if (ship.center.x > land.landingPads[j].start.x && ship.center.x < land.landingPads[j].end.x) {
                                        //Ship landing on landing pad, level won.
                                        MyGame.status = "Waiting";
                                        ship.thrusterSound.stop();
                                        victorySound.play();
                                        score += Math.round(ship.fuel) * 10;
                                        score += 100;
                                    } else {
                                        // Ship crashed because not on landing pad, change status to crashed
                                        MyGame.status = "Game Over";
                                    }
                                }
                            }
                        } else {
                            //Ship crashed, change status to crashed;
                            MyGame.status = "Game Over";
                        }
                    }
                }
            }

            //Update fuel Color according to ship fuel
            if (ship.fuel < 20) {
                if (ship.fuel < 10) {
                    fuelColor = '#ff0000';
                } else { 
                    fuelColor = '#ffff00';
                }
            } else {
                fuelColor = "#00ff00"
            }

            // Update X Speed Color according to ship movement
            if (ship.velocity.x * 10 >= -2 && ship.velocity.x * 10 <= 2) {
                speedXColor = '#00ff00';
            } else if (ship.velocity.x * 10 >= -4 && ship.velocity.x * 10 <= 4) {
                speedXColor = '#ffff00';
            } else {
                speedXColor = '#ff0000';
            }

            //Update Y Speed Color according to ship movement
            if (ship.velocity.y * 10 >= -2 && ship.velocity.y * 10 <= 2) {
                speedYColor = '#00ff00';
            } else if (ship.velocity.y * 10 >= -40 && ship.velocity.y * 10 <= 4) {
                speedYColor = '#ffff00';
            } else {
                speedYColor = '#ff0000';
            }

            //Update shipAngel color according to ship angle
            if (shipAngle >= 355 && shipAngle <= 365) {
                angleColor = '#00ff00';
            } else if (shipAngle >= 330 && shipAngle <= 390) {
                angleColor = '#ffff00';
            } else {
                angleColor = '#ff0000';
            }

            //Update all Text Items
            statusText.update('Status:', statusColor, statusColor);
            fuelText.update('Fuel: ' + Math.round(ship.fuel), fuelColor, fuelColor);
            angleText.update('Angle: ' + ship.angleDegree() + "\u00B0", angleColor, angleColor);
            speedText.update('Speed: ', speedColor, speedColor);
            speedXText.update('X: ' + Math.round(ship.velocity.x * 10) + ' m/s', speedXColor, speedXColor);
            speedYText.update('Y: ' + Math.round(ship.velocity.y * 10) + ' m/s', speedYColor, speedYColor);
            if (MyGame.status.includes("Game Over")) {
                score += Math.round(ship.fuel) * 10;
                updateHighScore();
            }
        }

        //Player finished level and is awaiting new level
        if (MyGame.status.includes("Waiting")) {  
            //Clear Input so user cannot use input between levels
            myKeyboard.clear();
            waitTimer += elapsedTime;
            countDownText.update("Next Level in " + (3 - Math.round(waitTimer / 1000)), "#FFFFFF");
            //Wait 4 seconds, then start next level
            if (waitTimer / 1000 > 3) {
                initializeNewLevel();
                
                waitTimer = 0;
            }
        }

        //Player Crashed, end the game.
        if (MyGame.status.includes("Game Over")) {
            myKeyboard.clear();
            ship.thrusterSound.stop();
            waitTimer += elapsedTime;
            if (waitTimer / 1000 < 3) {
                explosionSound.play();
                explosionSmoke.update(elapsedTime);
                explosionFire.update(elapsedTime);
            } else {
                cancelNextRequest = true;
            }
        }
    }

    function render() {
        graphics.clear();
        //Render Land
        renderer.Land.render(land);

        //Render Text
        renderer.Text.render(statusText);
        renderer.Text.render(fuelText);
        renderer.Text.render(angleText);
        renderer.Text.render(speedText);
        renderer.Text.render(speedXText);
        renderer.Text.render(speedYText);

        //Render things pertinent to between levels
        if (MyGame.status.includes("Waiting")) {  //Regular Game Play
            renderer.Text.render(waitingText);
            renderer.Text.render(countDownText);
        }

        //Render things pertinent to game over
        if (MyGame.status.includes("Game Over")) {  //Regular Game Play
            if (waitTimer / 1000 < 2) {
                //Only render explosion for 2 seconds
                renderSmoke.render();
                renderFire.render();
            }
            
            renderer.Text.render(gameOverText);
            renderer.Text.render(scoreText);
            
        } else {
            //Render the ship on everything but a game over
            renderer.Ship.render(ship);
        }
    }

    function gameLoop(time) {
        let elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;

        processInput(elapsedTime);
        update(elapsedTime);
        render();

        if (!cancelNextRequest) {
            requestAnimationFrame(gameLoop);
        } else {
            //Wait 5 seconds, then show highscore screen.
            explosionSound.stop();
            waitTimer = 0;
            game.showScreen('highScoreScreen');
            // setTimeout(function(){ game.showScreen('highScoreScreen'); }, 1000);
        }
    }

    //Calculate final score
    function updateHighScore() { 
        let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
        highScores.push(score);
        highScores.sort((a, b) => b - a);
        highScores.splice(5);
        localStorage.setItem("highScores", JSON.stringify(highScores));
        scoreText.update("Score: " + score, "#FFFFFF");
    }

    function initialize() {
        //Initialize updating variables
        lastTimeStamp = performance.now();
        id = 1;
        MyGame.status = "Level 1";
        score = 0;
        //Make new level
        level = levelMaker(objects, id, 2, 50);
        ship = level.ship;
        land = level.land;
        
        //Add level to Game levels so info can be retrieved later
        levels[id] = level;

        let thrust = document.getElementById('thrust').value;
        let leftTilt = document.getElementById('leftTilt').value;
        let rightTilt = document.getElementById('rightTilt').value;

        myKeyboard.register(thrust, ship.moveUp);
        myKeyboard.register(leftTilt, ship.rotateLeft);
        myKeyboard.register(rightTilt, ship.rotateRight);
        myKeyboard.register('Escape', function() {
        //Stop the game loop by canceling the request for next animation frame
        cancelNextRequest = true;
        //Return to the main menu
        game.showScreen('mainMenuScreen');
        });
    }

    function initializeNewLevel() {
        //Update updating variables
        lastTimeStamp = performance.now();
        id += 1;
        MyGame.status = "Level " + id;
        //Shrink the pad size down 10% every 
        let padSize = land.padSize - (land.padSize * .10);
        //Make new level
        level = levelMaker(objects, id, 1, padSize);
        ship = level.ship;
        land = level.land;

        //Add level to Game levels so info can be retrieved later
        levels[id] = level;

        //Get input values user entered in options screen
        let thrust = document.getElementById('thrust').value;
        let leftTilt = document.getElementById('leftTilt').value;
        let rightTilt = document.getElementById('rightTilt').value;

        //Assign input values to ship
        myKeyboard.register(thrust, ship.moveUp);
        myKeyboard.register(leftTilt, ship.rotateLeft);
        myKeyboard.register(rightTilt, ship.rotateRight);
    }

    function run() {
        lastTimeStamp = performance.now();
        cancelNextRequest = false;
        requestAnimationFrame(gameLoop);
    }

    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game, MyGame.objects, MyGame.render, MyGame.graphics, MyGame.input, MyGame.levels));