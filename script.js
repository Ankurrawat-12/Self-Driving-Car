const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 500;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 1400;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2, carCanvas.width*0.9, 5);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 15);
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50,"DUMMY", 5),
    new Car(road.getLaneCenter(2), -200, 30, 50, "DUMMY", 5),
    new Car(road.getLaneCenter(3), 0, 30, 50, "DUMMY", 5),
    new Car(road.getLaneCenter(0), 10, 30, 50, "DUMMY", 5),
    new Car(road.getLaneCenter(4), 99, 30, 50, "DUMMY", 5),
];
car.draw(carCtx);


animate();

function animate() {
    for(let i = 0; i < traffic.length; i++){
        traffic[i].update(road.boarders, [car]);
    }
    car.update(road.boarders, traffic);

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;
    carCtx.save();
    carCtx.translate(0, -car.y + carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i = 0; i < traffic.length; i++){
        traffic[i].draw(carCtx, "red");
    }

    car.draw(carCtx, "blue");
    carCtx.restore();


    Visualizer.drawNetwork(networkCtx, car.brain);
    requestAnimationFrame(animate);
}