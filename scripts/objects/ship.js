//Creates a lander object with state managing functions
MyGame.objects.Ship = function(spec) {

    //Prepare ship image
    let imageReady = false;
    let image = new Image();

    image.onload = function() {
        imageReady = true;
    };

    image.src = spec.imageSrc;

    //Make thruster have sound
    let thrusterSound = new sound("assets/sounds/thruster2.mp3");

    //Make thruster particles
    let thrusterFire = MyGame.systems.Thruster({
        center: { x: spec.center.x, y: spec.center.y + spec.size.height / 2 }, 
        angle: 0,
        size: { mean: 15, stdev: .75 },
        speed: { mean: 50, stdev: 25 },
        lifetime: { mean: 0.1, stdev: 0.2 }
        },
        MyGame.graphics);
    
    let thrusterSmoke = MyGame.systems.Thruster({
            center: { x: spec.center.x, y: spec.center.y + spec.size.height / 2 },
            angle: 0,
            size: { mean: 10, stdev: .75 },
            speed: { mean: 50, stdev: 25 },
            lifetime: { mean: 0.09, stdev: 0.2 }
        },
        MyGame.graphics);

    //Ready renderers for thruster particles
    let renderFire = MyGame.render.ParticleSystem(thrusterFire, MyGame.graphics, 'assets/images/fire.png');
    let renderSmoke = MyGame.render.ParticleSystem(thrusterSmoke, MyGame.graphics, 'assets/images/smoke-2.png');
    
    //Function to rotate ship left
    function rotateLeft(elapsedTime) {
        spec.angle -= Math.PI / 180;
    }

    //Function to rotate ship right
    function rotateRight(elapsedTime) {
        spec.angle += Math.PI / 180;
    }

    //Function to move ship up (activate thruster)
    function moveUp(elapsedTime) {
        if (spec.fuel > 0) {
            spec.engineOn = true;
            spec.velocity.x += spec.thrust * Math.sin(spec.angle);
            spec.velocity.y -= spec.thrust * Math.cos(-spec.angle);
            spec.fuel -= 0.05;
        }
    }

    //Function to detect collision
    function detectCollision(pt1, pt2) {
        let v1 = { x: pt2.x - pt1.x, y: pt2.y - pt1.y };
        let v2 = { x: pt1.x - spec.circle.center.x, y: pt1.y - spec.circle.center.y };
        let b = -2 * (v1.x * v2.x + v1.y * v2.y);
        let c =  2 * (v1.x * v1.x + v1.y * v1.y);
        let d = Math.sqrt(b * b - 2 * c * (v2.x * v2.x + v2.y * v2.y - spec.circle.radius * spec.circle.radius));
        if (isNaN(d)) { // no intercept
            return false;
        }
        // These represent the unit distance of point one and two on the line
        let u1 = (b - d) / c;  
        let u2 = (b + d) / c;
        if (u1 <= 1 && u1 >= 0) {  // If point on the line segment
            return true;
        }
        if (u2 <= 1 && u2 >= 0) {  // If point on the line segment
            return true;
        }
        return false;
    }

    //Flag function for renderer to know when to show thruster
    function setEngine(bool) {
        spec.engineOn = bool;
    }

    //Update ship stats
    function update(elapsedTime, gravity) {
        //Update Ship Stats
        spec.center.x += spec.velocity.x;
        spec.center.y += spec.velocity.y;
        spec.velocity.y += gravity;
        spec.circle.center.x = spec.center.x;
        spec.circle.center.y = spec.center.y;

        //Update Thruster Stats
        let radius = spec.size.width / 2;
        thrusterFire.setPosition(spec.center.x - radius * Math.sin(spec.angle), spec.center.y + radius * Math.cos(spec.angle));
        thrusterSmoke.setPosition(spec.center.x - radius * Math.sin(spec.angle), spec.center.y + radius * Math.cos(spec.angle));
        thrusterFire.setAngle(spec.angle);
        thrusterSmoke.setAngle(spec.angle);
        thrusterSmoke.update(elapsedTime);
        thrusterFire.update(elapsedTime);

        //If thruster is on, play sound
        if (spec.engineOn) {
            thrusterSound.play();
        } else {
            thrusterSound.stop();
        }
    }

    //Set ship velocity
    function setVelocity(x, y) {
        spec.velocity.x = x;
        spec.velocity.y = y;
    }

    //Get ship angle in degrees
    function angleDegree() {

        let deg = (spec.angle * 180 / Math.PI) % 360;
        if (spec.angle < 0) {
            spec.angle += 2 * Math.PI;
        }
        if (spec.angle > 360) {
            spec.angle -= 2 * Math.PI;
        }
        return Math.round(deg);
    }

    let api = {
        rotateLeft: rotateLeft,
        rotateRight: rotateRight,
        moveUp : moveUp,
        update : update,
        detectCollision : detectCollision,
        setEngine : setEngine,
        setVelocity : setVelocity,
        angleDegree : angleDegree,
        thrusterSound : thrusterSound,
        get imageReady() {return imageReady; },
        get image() {return image; },
        get angle() {return spec.angle; },
        get center() { return spec.center; },
        get size() { return spec.size; },
        get velocity() { return spec.velocity; },
        get circle() { return spec.circle; },
        get fuel() { return spec.fuel; },
        get engineOn() { return spec.engineOn; },
        get renderFire() { return renderFire; },
        get renderSmoke() { return renderSmoke; }
    };

    return api;
}