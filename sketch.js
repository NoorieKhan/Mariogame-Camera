var PLAY = 1;
var MID = 2;
var END = 0;
var gameState = PLAY;

var mario, mario_running, mario_collided;
var ground, invisibleGround, groundImage;

var bricksGroup, brickImage;
var obstaclesGroup, obstacleImage, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var coin, goldImage, coinGroup;
var score=0;

var gameOver, restart;

var life, count;
var lifeImg;

function preload(){
  bg=loadImage("bg.png")
  mario_running =   loadAnimation("mario00.png","mario01.png","mario02.png","mario03.png");
  mario_collided = loadAnimation("collided.png");
  
  groundImage = loadImage("ground2.png");
  
  brickImage = loadImage("brick.png");
  
  obstacleImage = loadAnimation("obstacle1.png","obstacle2.png","obstacle3.png","obstacle4.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  goldImage = loadImage("gcoin.png");
  
  lifeImg=loadImage("Heart.png");
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 350);
  life = createSprite(20, 20, 10, 10);
  life.addImage("lives",lifeImg);
  life.scale=0.15;
  
  count = 5;
  
  mario = createSprite(50,295,20,50),
  
  mario.addAnimation("running",mario_running);
  mario.addAnimation("collided", mario_collided);
  mario.scale = 2;
  ground = createSprite(200,330,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(1);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,300,400,10);
  invisibleGround.visible = false;

  bricksGroup = new Group();
  obstaclesGroup = new Group();
  fill(0);
  textSize(24);
  textFont("Charcoal");
  score = 0;
}

function draw() {
  background(bg);
  text("Score: "+ score, 480,30);

  if (gameState===PLAY){
    
    play();
    if(obstaclesGroup.isTouching(mario)){
      
      count = count-1;
      if(count>0){   
        gameState=MID;
        
        replay();
        
      }
      else {
        gameState = END;
       
      }
    }
    
    
  }
  if (gameState === END) {
    camera.position.x=mario.x+100;
    background("darkgrey");
    replay();
    strokeWeight(10);
    stroke("gold");
    fill("red");
    textSize(50);
    textFont("Georgia");
    text("You died", 200, 200);
    textSize(20);
    text("Your score:"+score, 150, 270);
    count = 0;
  }
  if(mousePressedOver(restart)) {
    if (gameState===END){
      count = 5;
    }
     
          reset();
        }
  
  
  text(":"+count, 40, 20);
    
  drawSprites();
}

function spawnbricks() {
  if (frameCount % 60 === 0) {
    var brick = createSprite(600,120,40,10);
    brick.y = Math.round(random(150,180));
    brick.addImage(brickImage);
    brick.scale = 1;
    brick.velocityX = -3;
    brick.lifetime = 200;
    brick.depth = mario.depth;
    mario.depth = mario.depth + 1;
    
    bricksGroup.add(brick);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,270,10,40);
    obstacle.velocityX = -(6);
    obstacle.addAnimation("obstacles",obstacleImage)       
    obstacle.scale = 1;
    obstacle.lifetime = 250;
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  bricksGroup.destroyEach();
  
  mario.changeAnimation("running",mario_running);
  
  score = 0;
}
function play(){
  
  ground.velocityX = -(7);
  
    if(keyDown("space") && mario.y >= 250) {
      mario.velocityY = -12;
      jumpSound.play();
    }
    if(score>0 && score%10 === 0){
       checkPointSound.play() 
      
    }
    mario.velocityY = mario.velocityY + 0.5
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    for (var i = 0; i < bricksGroup.length; i++) {
    
      if(bricksGroup.get(i).isTouching(mario)){
      bricksGroup.get(i).remove()
      score =score+1;
      coin = createSprite(100, 150, 10, 10)
      coin.addImage(goldImage);
      coin.scale=0.1;
      coin.velocityY=-2;
      coin.lifetime=20;
    }
    }
    mario.collide(invisibleGround);
    spawnbricks();
    spawnObstacles();
  
  
}
function replay(){
  gameOver.visible = true;
    restart.visible = true;
    
    ground.velocityX = 0;
    mario.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    bricksGroup.setVelocityXEach(0);
    
    bricksGroup.destroyEach();
    mario.changeAnimation("collided",mario_collided);
    
    obstaclesGroup.setLifetimeEach(-1);
    bricksGroup.setLifetimeEach(-1);
    
}