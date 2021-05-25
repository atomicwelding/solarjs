/**
 * todo
 *  - draw the sun
 *  - draw the earth
 */

// init
let can = document.getElementById('system');
let ctx = can.getContext('2d');

can.width = 1200;
can.height = 800;

let camX = 0;
let camY = 0;

// options
const optOrbit = _ => document.getElementById('orbit').checked;

document.getElementById('plus').addEventListener('click', _ => cropfactor += 0.10);
document.getElementById('minus').addEventListener('click', _ => cropfactor =  cropfactor <= 0.25 ? 0.25 : cropfactor-0.10);

window.addEventListener('keypress', e => {
    if(e.key === 'q') camX += 50;
    else if(e.key === 'd') camX -= 50;
    else if(e.key === 'z') camY -= 50;
    else if(e.key === 's') camY += 50;
    else if(e.key === 'm') cropfactor =  cropfactor <= 0.25 ? 0.25 : cropfactor-0.10;
    else if(e.key === 'l') cropfactor += 0.10;

    console.log(e.key);
});

// maths objects and functions
let cropfactor = 1;

const cart = {
    O: {
        x: can.width/2,
        y: can.height/2
    },

    transX: x => cart.O.x + x,
    transY: y => cart.O.y - y,
    transXtoA: (a,x) => cart.transX(a) + x,
    transYtoA: (a,y) => cart.transY(a) - y,
}

// objects' system
class Planet {
    constructor(x, y, radius, distance, angle, speed, color) {
        this.x = x;
        this.y = y; 
        
        this.begRadius = radius;
        this.radius = radius/cropfactor;
        
        this.begDistance = distance;
        this.distance = distance/cropfactor;
        
        this.angle = angle;
        this.speed = speed;
        this.color = color;
    }

    draw() {
        if(optOrbit()) this.orbit();

        ctx.beginPath();
        ctx.arc(cart.transX(this.x+camX), cart.transY(this.y+camY), this.radius, 0, 2*Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.radius = this.begRadius/cropfactor;
        this.distance = this.begDistance/cropfactor;

        this.x = this.distance*Math.cos(this.angle * Math.PI/180);
        this.y = this.distance*Math.sin(this.angle * Math.PI/180);

        this.angle += this.speed;
    }

    orbit() {
        ctx.beginPath();
        ctx.arc(cart.O.x + camX, cart.O.y - camY, this.distance, 0, 2*Math.PI);
        ctx.setLineDash([5, 15]);
        ctx.strokeStyle = "#fff";
        ctx.stroke();
    } 
}

class Satellite extends Planet {
    constructor(x, y, planet, radius, distance, angle, speed, color) {
        super(x, y, radius, distance, angle, speed, color);
        this.planet = planet;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(cart.transX(this.planet.x + this.x + camX), cart.transY(this.planet.y + this.y + camY), this.radius, 0, 2*Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.radius = this.begRadius/cropfactor;
        this.distance = this.begDistance/cropfactor;

        this.x = this.distance*Math.cos(this.angle * Math.PI/180);
        this.y = this.distance*Math.sin(this.angle * Math.PI/180);

        this.angle += this.speed;
    }
} 

class Star extends Planet {

    constructor(x, y, radius, distance, angle, speed, color) {
        super(x, y, radius, distance, angle, speed, color);
    }

    draw() {
        ctx.beginPath();
        ctx.arc(cart.transX(this.x+camX), cart.transY(this.y+camY), this.radius, 0, 2*Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    
    update() {
        this.radius = this.begRadius/cropfactor;
    }

    orbit() {
        return;
    }
}

let sun = new Star(0, 0, 250, 0, 0, 0, '#ebe134');
let mercury = new Planet(0, 0, 3, 50 + sun.radius, 0, 0.1, '#fee');
let venus = new Planet(0, 0, 9, mercury.distance + 40, 45, 0.07, '#eb8f34');
let earth = new Planet(0, 0, 10, venus.distance + 50, 240, 0.058, '#39b0e3');
let mars = new Planet(0, 0, 5, earth.distance + 60, 192, 0.048, '#e72222');
let jupiter = new Planet(0, 0, 110, mars.distance + 300, 260,0.026, '#f59c53');
let saturn = new Planet(0, 0, 90, jupiter.distance + 400, 289, 0.018, '#f2f2bd');
let uranus = new Planet(0, 0, 37, saturn.distance + 800, 156, 0.012, '#b4edf0');
let neptune = new Planet(0, 0, 39, uranus.distance + 1000, 90, 0.01, '#50dee6');

let moon = new Satellite(0, 0, earth, 2, earth.radius + 3, 0, 0.1, '#eee');
let phobos = new Satellite(0, 0, mars, 0.015, mars.radius + 3, 0, 0.004, '#fcc');


let planets = [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune];
let satellites = [moon, phobos];

// loop
setInterval( _ => {
    ctx.clearRect(0, 0, can.width, can.height);

    sun.update();
    sun.draw();

    for(let p in planets) {
        planets[p].update();
        planets[p].draw();
    }

    for(let s in satellites) {
        satellites[s].update();
        satellites[s].draw();
    }
    
}, 50);