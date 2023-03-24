const teslaCanvas = document.getElementById("carCanvas");
teslaCanvas.width = 400;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 500;

const teslaCtx = teslaCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(teslaCanvas.width/2, teslaCanvas.width*0.9);
const N = 500;
const cars = generateCars(N);
let bestCar = cars[0];
if(localStorage.getItem("bestAI")){
    for(let i =0; i< cars.length; i++){
        cars[i].brain = JSON.parse(localStorage.getItem("bestAI"));
        if(i != 0){
            NeuralNetwork.mutate(cars[i].brain, 0.1);
        }
    }
}
const traffic = [
    new Tesla(road.getLaneCenter(1), -100, 30, 50, "BOT", 2),
    new Tesla(road.getLaneCenter(3), -100, 30, 50, "BOT", 2),
    new Tesla(road.getLaneCenter(5), -100, 30, 50, "BOT", 2),

    new Tesla(road.getLaneCenter(0), -300, 30, 50, "BOT", 2),
    new Tesla(road.getLaneCenter(2), -300, 30, 50, "BOT", 2),
    new Tesla(road.getLaneCenter(4), -300, 30, 50, "BOT", 2),

    new Tesla(road.getLaneCenter(0), -500, 30, 50, "BOT", 2),
    new Tesla(road.getLaneCenter(1), -500, 30, 50, "BOT", 2),
    new Tesla(road.getLaneCenter(2), -500, 30, 50, "BOT", 2),
    new Tesla(road.getLaneCenter(3), -500, 30, 50, "BOT", 2),

    new Tesla(road.getLaneCenter(5), -700, 30, 50, "BOT", 2),
    new Tesla(road.getLaneCenter(4), -700, 30, 50, "BOT", 2),
    new Tesla(road.getLaneCenter(3), -700, 30, 50, "BOT", 2),
    new Tesla(road.getLaneCenter(2), -700, 30, 50, "BOT", 2),

    new Tesla(road.getLaneCenter(5), -900, 30, 50, "BOT", 2),
    new Tesla(road.getLaneCenter(3), -900, 30, 50, "BOT", 2),
    new Tesla(road.getLaneCenter(2), -900, 30, 50, "BOT", 2),
    new Tesla(road.getLaneCenter(1), -900, 30, 50, "BOT", 2),
    new Tesla(road.getLaneCenter(0), -900, 30, 50, "BOT", 2),

    new Tesla(road.getLaneCenter(5), -1100, 30, 50, "BOT", 2),
    new Tesla(road.getLaneCenter(4), -1100, 30, 50, "BOT", 2),
    new Tesla(road.getLaneCenter(3), -1100, 30, 50, "BOT", 2),
    new Tesla(road.getLaneCenter(1), -1100, 30, 50, "BOT", 2),
    new Tesla(road.getLaneCenter(0), -1100, 30, 50, "BOT", 2),
];

// tesla.draw(ctx);

animate();

function save(){
    localStorage.setItem("bestAI", JSON.stringify(bestCar.brain));
}

function remove(){
    localStorage.removeItem("bestAI");
}

function generateCars(N){
    const cars = [];
    for(let i = 0; i < N; i++){
        cars.push(
            new Tesla(road.getLaneCenter(1), 100,30,50,"AI")
        );
    }
    return cars;
}

function animate(time){
    for(let i = 0; i < traffic.length; i++){
        traffic[i].update(road.borders, []);
    }
    for(let i = 0; i < cars.length; i++){
        cars[i].update(road.borders, traffic);
    }
    
    bestCar = cars.find(c => c.y == Math.min(...cars.map(c => c.y)));

    teslaCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    teslaCtx.save();
    teslaCtx.translate(0, -bestCar.y + teslaCanvas.height * 0.7);

    road.draw(teslaCtx);
    for(let i = 0; i < traffic.length; i++){
        traffic[i].draw(teslaCtx, "red");
    }

    teslaCtx.globalAlpha = 0.2;
    for(let i = 0; i < cars.length; i++){
        cars[i].draw(teslaCtx, "blue");
    }
    teslaCtx.globalAlpha = 1;
    bestCar.draw(teslaCtx,"blue", true);

    teslaCtx.restore();
    networkCtx.lineDashOffset = -time / 75;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}