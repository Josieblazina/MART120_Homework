function setup() {
    createCanvas(400, 400);
  }
  
  function draw() {
    background(220);
  }
  let player;
  let obstacles = [];
  let staticObstacle = null;
  let exitZone;
  let win = false;
  
  function setup() {
    createCanvas(600, 400);
    player = createVector(50, height / 2);
    
    // 2 ran
    for (let i = 0; i < 3; i++) {
      obstacles.push({
        pos: createVector(random(width), random(height)),
        size: random(20, 50),
        color: color(random(255), random(255), random(255)),
        velocity: p5.Vector.random2D().mult(random(0.5, 2))
      });
    }
    
    // exit 
    exitZone = {
      x: width - 40,
      y: height / 2 - 30,
      w: 30,
      h: 60
    };
  }
  
  function draw() {
    background(220);
    
    
    fill(0, 255, 0);
    rect(exitZone.x, exitZone.y, exitZone.w, exitZone.h);
    
    if (win) {
      textSize(32);
      fill(0);
      text("You Win!", width / 2 - 70, height / 2);
      return;
    }
    
    // move player
    handlePlayerMovement();
    
    
    fill(0, 0, 255);
    ellipse(player.x, player.y, 20, 20);
    
    // obstacles
    for (let obs of obstacles) {
      fill(obs.color);
      ellipse(obs.pos.x, obs.pos.y, obs.size);
      
      obs.pos.add(obs.velocity);
      
      // wrap around screen
      if (obs.pos.x > width) obs.pos.x = 0;
      else if (obs.pos.x < 0) obs.pos.x = width;
      if (obs.pos.y > height) obs.pos.y = 0;
      else if (obs.pos.y < 0) obs.pos.y = height;
    }
    
    // static obstacle
    if (staticObstacle) {
      fill(100);
      rect(staticObstacle.x, staticObstacle.y, 30, 30);
    }
  
    // win
    if (player.x > exitZone.x &&
        player.y > exitZone.y &&
        player.y < exitZone.y + exitZone.h) {
      win = true;
    }
  }
  
  function handlePlayerMovement() {
    let speed = 2;
    if (keyIsDown(LEFT_ARROW)) player.x -= speed;
    if (keyIsDown(RIGHT_ARROW)) player.x += speed;
    if (keyIsDown(UP_ARROW)) player.y -= speed;
    if (keyIsDown(DOWN_ARROW)) player.y += speed;
    
    // keep player on screen
    if (player.x > width) player.x = width;
    else if (player.x < 0) player.x = 0;
    if (player.y > height) player.y = height;
    else if (player.y < 0) player.y = 0;
  }
  
  function mousePressed() {
    // static
    if (!staticObstacle) {
      staticObstacle = { x: mouseX - 15, y: mouseY - 15 };
    }
  }