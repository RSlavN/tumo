//Basic setup
function setup(){
    createCanvas(400,400)
    Game.addCommonBalloon()
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
//P5 main

function mousePressed(){
    if(isLooping() == false){
        Game.score = 0
        loop()
        interval = setInterval(() =>{
            Game.sendStatistics()
        }, 5000);
    }
    Game.checkIfBalloonBurst()
}

let interval = setInterval(() =>{
    Game.sendStatistics()
}, 5000);

function draw(){
    background('skyblue')
    for(const balloon of Game.balloons){
        balloon.display()
        balloon.move(Game.score)
        //lose condition
        if(balloon.y < balloon.size/-2 && balloon.color != "black"){  
            noLoop()
            clearInterval(interval)
            Game.balloons.length = 0             
            background('hsl(160, 100%, 50%)')
            textSize(60)
            fill('white')
            text("FINISH", 110, 200)
            textSize(40)
            text("Your final score: " + Game.score, 20, 250)
            if (Game.score >= Game.highscore){
                Game.highscore = Game.score
            }
            textSize(35)
            text("Your highscore: " + Game.highscore, 40, 300)
            Game.score = ''
        }
    }
//Score display
    textSize(32)
    fill('black')
    text(Game.score, 20, 40)
//Balloon spawner
    if(frameCount % 30 == 0){
        if(getRandomInt(3) != 2){
        Game.addCommonBalloon()}else{
        Game.addRareBalloon()
        }
    }
    if(frameCount % 75 == 0){    
        if(getRandomInt(6) != 5){
            Game.addEvilBalloon()}else{
            Game.addRandomBalloon()
            }        
    }    
}
//game class
class Game{
static balloons = []
static commonPop = 0
static uniqPop = 0
static angryPop = 0
static rPop = 0
static score = 0
static highscore = 0

static sendStatistics(){
    let statistics = {
        commonBurst: this.commonPop,
        uBurst: this.uniqPop,
        rBurst: this.rPop,
        aBurst: this.angryPop,
        score: this.score,
    }
    fetch("/statistic", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(statistics)
    });
}

static addCommonBalloon(){
    let balloon = new CommonBalloon("blue", 50)
    this.balloons.push(balloon)
} 
static addRareBalloon(){
    let balloon = new RareBalloon("green", 35)
    this.balloons.push(balloon)
}
static addEvilBalloon(){
    let balloon = new EvilBalloon("black", 50)
    this.balloons.push(balloon)
}
static addRandomBalloon(){
    let balloon = new RandomBalloon("purple", 60)
    this.balloons.push(balloon)
}
//balloon popper
static checkIfBalloonBurst(){
    this.balloons.forEach((balloon, index) => {
        let distance = dist(balloon.x, balloon.y, mouseX, mouseY)
        if (distance <= balloon.size/2){
            if (distance <= balloon.size * 0.3){
                balloon.burst(index, 3)
            }else{
                balloon.burst(index, 1)
            }  
        }
    })
}
}
//basic balloon class
class CommonBalloon{
constructor(color, size){
this.x = random(width);
this.y = random(height - 10, height + 50);
this.color = color
this.size = size
}

display(){
    fill(this.color)
    ellipse(this.x, this.y, this.size)
    line(this.x, this.y + this.size/2, this.x, this.y + this.size*2)
    fill('red')
    ellipse(this.x, this.y, this.size * 0.3)
}

move(score){ 
    this.y -= (1 + score * 0.002)
}

burst(index, score){
    Game.balloons.splice(index, 1)
    Game.score += score
    Game.commonPop += 1
}

}
//small green balloon class
class RareBalloon extends CommonBalloon{
    constructor(color, size){
        super(color, size)
    }
    burst(index, score){
        Game.balloons.splice(index, 1)
        Game.score += score * 5
        Game.uniqPop += 1
    }
}
//evil balloon class
class EvilBalloon extends CommonBalloon{
    constructor(color, size){
        super(color, size)
    }
    burst(index, score){
        Game.balloons.splice(index, 1)
        Game.score -= score * 5
        Game.angryPop += 1
    }
//random balloon class    
}
class RandomBalloon extends CommonBalloon{
    constructor(color, size){
        super(color, size)
    }
    burst(index, score){
        Game.balloons.splice(index, 1)
        Game.score += score * getRandomInt(15)
        Game.uPop += 1
    }
}