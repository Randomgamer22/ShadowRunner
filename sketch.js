var player,player_running,player_jumping,ground,groundImage,player_collided;
var obstaclesArray = [],obstacleGroup,obstacle1Image,obstacle2Image,obstacleImages;
var gameState, score;

function preload() {
    player_running = loadAnimation("tile000.png", "tile002.png", "tile003.png", "tile004.png", "tile005.png", "tile006.png", "tile007.png");
    player_jumping = loadAnimation("tile008.png");
    player_collided = loadAnimation("tile000.png");
    groundImage = loadImage("ground.png")
    obstacle1Image = loadImage("obstacle1.png");
    obstacle2Image = loadImage("obstacle2.png");
}

function setup() {
    createCanvas(windowWidth,windowHeight);

    player = createSprite(50,windowHeight-75,10,10);
    player.addAnimation("running", player_running);
    player.addAnimation("jumping",player_jumping);
    player.addAnimation("collided",player_collided);
    player.scale = 0.4;
    player.setCollider("rectangle",0,0,70,140);

    ground = createSprite(0,windowHeight-30,10,10);
    ground.addImage(groundImage);
    ground.scale = 0.75;
    ground.x = 100;
    ground.velocityX = -4;
    ground.setCollider("rectangle",0,15,ground.width,ground.height-30);

    player.depth = ground.depth + 1;

    obstacleImages = [obstacle1Image,obstacle2Image];
    obstacleGroup = new Group(); 

    gameState = "play";
    score = 0;
}

function draw() {
    background(150);
    fill("black");
    textStyle(BOLD);
    textFont('8514oem');
    text("Score: " + score, windowWidth-100, 50);

    camera.x = player.x;

    if(gameState === "play"){

        score = score + Math.round(getFrameRate() / 60);

        if(ground.x < -200){
            ground.x = 100;
        }

        player.velocityY += 0.5;

        if ((keyDown("space") || touches.length > 0) && player.y > windowHeight - 74) {
            player.velocityY = -12;
        }

        if (player.y < windowHeight-74) {
            player.changeAnimation("jumping", player_jumping);
        } else {
            player.changeAnimation("running", player_running);
        }

        spawnObstacles();

        for(var i=0;i<obstaclesArray.length;i++){
            if(player.isTouching(obstaclesArray[i])){
                gameState = "end"
            }
        }
    }else{
        player.velocityY = 0;
        player.changeAnimation("collided", player_collided);
        ground.velocityX = 0;
        obstacleGroup.setVelocityXEach(0)
        obstacleGroup.setLifetimeEach(-1);

        fill("black");
        textStyle(BOLD);
        textFont('8514oem');
        text("Game Over",(windowWidth/2)-30,(windowHeight/2)-20);
        text("Press 'r' to resart",(windowWidth/2)-50,windowHeight/2);

        if((keyDown("r") || touches.length > 0)){
            gameState = "play"
            obstacleGroup.destroyEach();
            ground.velocityX = -4;
            player.y = windowHeight-75;
            score = 0;
        }
    }

    player.collide(ground);
    drawSprites();
}

function spawnObstacles() {
    if(frameCount % 100 === 0){
        var obstacle = createSprite(windowWidth,windowHeight-80,10,10);
        obstacle.scale = 0.4;
        var rand = Math.round(random(0,1));
        if(rand === 0){
            obstacle.addImage(obstacleImages[0]);
            obstacle.setCollider("rectangle",0,0,45,80);
        }
        else if (rand === 1) {
            obstacle.addImage(obstacleImages[1]);
            obstacle.setCollider("rectangle",0,10,140,80);
        }
        obstacle.velocityX = -4;
        obstacle.lifetime = (windowWidth/obstacle.velocityX)+10;
        obstaclesArray.push(obstacle);
        obstacleGroup.add(obstacle);
        
    }
}
