let score = 0;

let star;
let mario;
let marioX = 0;
let marioY = 0;
let marioRight = true;
let marioVel = 0;
let jumping = false;
let song;
let jumpSound;

let goomba;
let goombaRight = false;
let goombaUp = false;
let goombaX;
let goombaY;
let goombaYSpeed;
let goombaXSpeed;
let goombaAlive = true;
let goombaTimer = 0;

let black = true;
let red = false;
let green = false;
let blue = false;
let purple = false;
let starDrawing = false;

var then = Date.now();


function setup(){
    createCanvas(600,600);
    background(240);

    star = loadImage("star.png");
    mario = loadImage("mario.png");
    soundFormats('mp3');
    song = loadSound("star.mp3");
    jumpSound = loadSound("mariojump.mp3");
    goomba = loadImage("goomba.png");

    marioX = 0;
    marioY = height-40;

    goombaX = width;
    goombaY = height - 40;

    goombaXSpeed = Math.random()*200;
    goombaYSpeed = Math.random()*200;
}

function draw(){
    var now = Date.now();
    var delta = now-then;

    updateMario(delta/1000);
    if(goombaAlive){
        updateGoomba(delta/1000);
    }else{
        goombaTimer+=delta;
        if(goombaTimer >= 1500){
            goombaX = Math.random()*width;
            goombaY = Math.random()*height;
            goombaAlive = true;
        }
    }

    if(collisionDetection()){
        goombaAlive = false;
        goombaX = -40;
        goombaY = -40;
        score++;
    }
    
    setupButtons();

    fill(240);
    noStroke();
    rect(width-230,18,230,27);
    textSize(24);
    stroke(0);
    fill(0);
    strokeWeight(1);
    text("Goomba's Killed: " + score,width-230,40);

    then = now;
}

function mouseDragged(){
    if(!starDrawing){
        setStrokeAndFill();
        strokeWeight(10);
        point(mouseX,mouseY);
    }else{
        noStroke();
        image(star,mouseX,mouseY,40,40);
        if(!song.isPlaying()){
            song.play();
        }
    }
}

function mouseReleased(){
    song.stop();
}

function mousePressed(){
    //button row
    if(mouseY <60 && mouseY > 10){
        //red button
        if(mouseX < 60 && mouseX >10){
            makeAllColorsFalse();
            red = true;
        }
        //green button
        else if(mouseX <120 && mouseX >70){
            makeAllColorsFalse();
            green = true;
        }
        //blue button
        else if(mouseX <180 && mouseX >130){
            makeAllColorsFalse();
            blue = true;
        }
        //purple button
        else if(mouseX <240 && mouseX >190){
            makeAllColorsFalse();
            purple = true;
        }
        //black button
        else if(mouseX <300 && mouseX >250){
            makeAllColorsFalse();
            black = true;
        }
        //star button 
        else if(mouseX <360 && mouseX >310){
            makeAllColorsFalse();
            starDrawing = true;
        }
    }
}

function keyPressed(){
    if(keyCode == 32 && !jumping){
        jumpSound.play();
        if(keyIsDown(88)){
            marioVel = -600;
        }else{
            marioVel = -300;
        }
        marioY -=1;
        jumping = true;
    }
}

function setupButtons(){
    stroke(0);
    strokeWeight(2);
    //red
    fill(200,0,0);
    rect(10,10,50,50);
    //green
    fill(0,200,0);
    rect(70,10,50,50);
    //blue
    fill(0,0,200);
    rect(130,10,50,50);
    //purple
    fill(200,0,200);
    rect(190,10,50,50);
    //black
    fill(0);
    rect(250,10,50,50);
    //star
    fill(255);
    rect(310,10,50,50);
    image(star,318,12,50,50);
}

function makeAllColorsFalse(){
    red = false;
    green = false;
    blue = false;
    purple = false;
    black = false;
    starDrawing = false;
}

function setStrokeAndFill(){
    if(red){
        stroke(200,0,0);
        fill(200,0,0);
    }else if(green){
        stroke(0,200,0);
        fill(0,200,0);
    }else if(blue){
        stroke(0,0,200);
        fill(0,0,200);
    }else if(purple){
        stroke(200,0,200);
        fill(200,0,200);
    }else if(black){
        stroke(0);
        fill(0);
    }else if(starDrawing){
        noStroke();
    }
}

function updateMario(modifier){
    noStroke();
    fill(240);
    rect(marioX-4,marioY-4,48,48);
    let speed = 200;
    if(keyIsDown(88)){
        speed *=1.5;
    }
    if(keyIsDown(LEFT_ARROW) && marioX >0){
        marioX -= speed*modifier;
    }

    else if(keyIsDown(RIGHT_ARROW) && marioX<width-40){
        marioX += speed*modifier;
    }

    if(jumping && marioY < height-40){
        marioY += marioVel*modifier;
        marioVel += 7;
    }else if(jumping){
        jumping = false;
        marioY = height - 40;
    }

    image(mario,marioX,marioY,40,40);
}

function updateGoomba(modifier){
    //rect(goombaX,goombaY,40,40);
    if(!goombaRight){
        goombaX -= goombaXSpeed*modifier;
    }else{
        goombaX += goombaXSpeed*modifier;
    }

    if(goombaX<=0){
        goombaRight = true;
        goombaXSpeed = Math.random()*200+(score*10);
    }else if(goombaX>=width-40){
        goombaRight = false;
        goombaXSpeed = Math.random()*200+(score*10);
    }

    if(!goombaUp){
        goombaY -= goombaYSpeed*modifier;
    }else{
        goombaY += goombaYSpeed*modifier;
    }

    if(goombaY<=0){
        goombaUp = true;
        goombaYSpeed = Math.random()*200 + (score*10);
    }else if(goombaY>=height-40){
        goombaUp = false;
        goombaYSpeed = Math.random()*200 + (score*10);
    }
    
    image(goomba,goombaX,goombaY,40,40);
}

function collisionDetection(){
    let l2x = marioX;
    let l2y = marioY;
    let r2x = marioX+40;
    let r2y = marioY+40;

    let l1x = goombaX;
    let l1y = goombaY;
    let r1x = goombaX + 40;
    let r1y = goombaY + 40;

    if(l1x > r2x || l2x > r1x){
        return false;
    }else if(l1y > r2y || l2y > r1y){
        return false;
    }
    return true;
}