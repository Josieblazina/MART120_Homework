let player;
let obstacles = [];
let staticObstacle = null;
let exitZone;
let win = false;

function setup() {
  createCanvas(600, 400);
  createPlayer();
  createObstacles();
  createExitZone();
}

function draw() {
  background(220);
  drawBorders();
  drawExitZone();
  displayWinMessage();
  movePlayer();
  drawPlayer();
  moveObstacles();
  drawObstacles();
  drawStaticObject();
}

function createPlayer() {
  player = createVector(50, height / 2);
}

function movePlayer() {
  let speed = 2;
  if (keyIsDown(LEFT_ARROW)) player.x -= speed;
  if (keyIsDown(RIGHT_ARROW)) player.x += speed;
  if (keyIsDown(UP_ARROW)) player.y -= speed;
  if (keyIsDown(DOWN_ARROW)) player.y += speed;

  // constrain to screen
  player.x = constrain(player.x, 0, width);
  player.y = constrain(player.y, 0, height);
}

function drawPlayer() {
  fill(0, 0, 255);
  ellipse(player.x, player.y, 20, 20);
}

function mousePressed() {
  // only allow one static object
  if (!staticObstacle) {
    staticObstacle = { x: mouseX - 15, y: mouseY - 15 };
  }
}

function drawStaticObject() {
  if (staticObstacle) {
    fill(100);
    rect(staticObstacle.x, staticObstacle.y, 30, 30);
  }
}

function createObstacles() {
  for (let i = 0; i < 3; i++) {
    obstacles.push({
      pos: createVector(random(width), random(height)),
      size: random(20, 50),
      color: color(random(255), random(255), random(255)),
      velocity: p5.Vector.random2D().mult(random(0.5, 2))
    });
  }
}

function moveObstacles() {
  for (let obs of obstacles) {
    obs.pos.add(obs.velocity);

    // wrap around screen
    if (obs.pos.x > width) obs.pos.x = 0;
    else if (obs.pos.x < 0) obs.pos.x = width;
    if (obs.pos.y > height) obs.pos.y = 0;
    else if (obs.pos.y < 0) obs.pos.y = height;
  }
}

function drawObstacles() {
  for (let obs of obstacles) {
    fill(obs.color);
    ellipse(obs.pos.x, obs.pos.y, obs.size);
  }
}

function drawBorders() {
  stroke(0);
  strokeWeight(4);
  noFill();
  rect(0, 0, width, height);
}

function createExitZone() {
  exitZone = {
    x: width - 40,
    y: height / 2 - 30,
    w: 30,
    h: 60
  };
}

function drawExitZone() {
  fill(0, 255, 0);
  noStroke();
  rect(exitZone.x, exitZone.y, exitZone.w, exitZone.h);
}

function displayWinMessage() {
  if (win) {
    textSize(32);
    fill(0);
    text("You Win!", width / 2 - 70, height / 2);
    noLoop(); // stop the game
  } else if (
    player.x > exitZone.x &&
    player.y > exitZone.y &&
    player.y < exitZone.y + exitZone.h
  ) {
    win = true;
  }
}