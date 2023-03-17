let noOfLanes = 7;
const carCanvas = document.getElementById("carCanvas");
carCanvas.width = noOfLanes * 100;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 500;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2, carCanvas.width*0.9, noOfLanes);

let N = 100;
const cars = generateCars(N);
let bestCar = cars[0];

if(localStorage.getItem("bestBrain")){
    for(let i = 0;i < cars.length; i++){
        cars[i].brain = JSON.parse(
            localStorage.getItem("bestBrain")
        );
        if(i != 0){
            NeuralNetwork.mutate(cars[i].brain, 0.1);
        }
    }
    
}

const car = new Car(road.getLaneCenter(0), 0, 30, 50, "KEYS", 20);
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50,"DUMMY", 3),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 3),
    new Car(road.getLaneCenter(3), -100, 30, 50, "DUMMY", 3),
    new Car(road.getLaneCenter(5), -80, 30, 50, "DUMMY", 3),
    new Car(road.getLaneCenter(7), -330, 30, 50, "DUMMY", 3),
    new Car(road.getLaneCenter(3), 0, 30, 50, "DUMMY", 4),
    new Car(road.getLaneCenter(4), -888, 30, 50, "DUMMY", 2),
];
traffic.push(car);


animate();

function save(){
        localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain)
    );
    console.log("Saved Brain: -" + bestCar.brain);
}

function discard(){
    localStorage.removeItem("bestBrain");
    console.log("Deleted Brain: -" + bestCar.brain);
}

function changeLanes(){
    if(noOfLanes <= 6){
        noOfLanes++;
    }
    else{
        noOfLanes = 2;
    }
}

function changeCars(){
    if(N < 150){
        N += 10;
    }
    else{
        N = 1;
    }
}


function generateCars(N){
    const cars = [];
    for(let i = 1; i <= N; i++){
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 5));
    }
    return cars;
}


function animate(time) {
    for(let i = 0; i < traffic.length; i++){
        traffic[i].update(road.boarders, []);
    }
    for(let i = 0; i < cars.length; i++){
        cars[i].update(road.boarders, traffic);
    }

    car.update(road.boarders, []);
    bestCar = cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        )
    );

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;
    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i = 0; i < traffic.length; i++){
        traffic[i].draw(carCtx, "red");
    }

    carCtx.globalAlpha = 0.2;
    for(let i = 0; i < cars.length; i++){
        cars[i].draw(carCtx, "blue");
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, "blue", true);

    car.draw(carCtx, "green");
    carCtx.restore();

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,cars[0].brain);
    requestAnimationFrame(animate);
}