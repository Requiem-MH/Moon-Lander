//Creates a Explosion particle
MyGame.systems.Explosion = function(spec) {
    'use strict';
    let nextName = 1;
    let particles = {};

    //Creates new particle
    function create() {
        let size = Random.nextGaussian(spec.size.mean, spec.size.stdev);
        let p = {
                center: { x: spec.center.x, y: spec.center.y },
                size: { x: size, y: size},
                direction: Random.nextCircleVector(),
                speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev),
                rotation: 0,
                lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),
                alive: 0
            };

        return p;
    }

    //Updates states of all particles and  removes if needed
    function update(elapsedTime) {
        let removeMe = [];

        // Time in seconds
        elapsedTime = elapsedTime / 1000;
        
        Object.getOwnPropertyNames(particles).forEach(function(value) {
            let particle = particles[value];
    
            // Update how long it has been alive
            particle.alive += elapsedTime;

            // Update its center
            particle.center.x += (elapsedTime * particle.speed * particle.direction.x);
            particle.center.y += (elapsedTime * particle.speed * particle.direction.y);

            // Rotate proportional to its speed
            particle.rotation += particle.speed / 500;

            // If the lifetime has expired, identify it for removal
            if (particle.alive > particle.lifetime) {
                removeMe.push(value);
            }
        });

        // Remove all of the expired particles
        for (let particle = 0; particle < removeMe.length; particle++) {
            delete particles[removeMe[particle]];
        }
        removeMe.length = 0;

         // Generate some new particles and assign unique name to each
        for (let particle = 0; particle < 1; particle++) {
            particles[nextName++] = create();
        }
    }

    function setPosition(x, y) {
        spec.center.x = x;
        spec.center.y = y;
    }

    let api = {
        update: update,
        setPosition : setPosition,
        get particles() { return particles; }
    };

    return api;
}
