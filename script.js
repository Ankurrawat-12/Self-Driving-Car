const canvas = document.getElementById("myCanvas");
canvas.width = 500;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width/2, canvas.width*0.9, 5);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "KEYS", 15);
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50,"DUMMY", 5),
    new Car(road.getLaneCenter(2), -200, 30, 50, "DUMMY", 5),
    new Car(road.getLaneCenter(3), 0, 30, 50, "DUMMY", 5),
    new Car(road.getLaneCenter(0), 10, 30, 50, "DUMMY", 5),
    new Car(road.getLaneCenter(4), 99, 30, 50, "DUMMY", 5),
];
car.draw(ctx);


animate();

function animate() {
    for(let i = 0; i < traffic.length; i++){
        traffic[i].update(road.boarders, [car]);
    }
    car.update(road.boarders, traffic);

    canvas.height = window.innerHeight;
    ctx.save();
    ctx.translate(0, -car.y + canvas.height*0.7);

    road.draw(ctx);
    for(let i = 0; i < traffic.length; i++){
        traffic[i].draw(ctx, "red");
    }

    car.draw(ctx, "blue");
    ctx.restore();

    requestAnimationFrame(animate);
}