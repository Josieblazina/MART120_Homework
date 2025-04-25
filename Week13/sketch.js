let player;
let obstacles = [];
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
  
  movePlayer();
  drawPlayer();
  
  moveObstacles();
  drawObstacles();
  
  checkWinCondition();
  displayWinMessage();
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
  // Add a new moving obstacle at mouse position
  // Create a shape with random vertices
  let vertices = [];
  let sides = floor(random(3, 7)); // Between 3 and 6 sides
  let radius = random(15, 40);
  
  for (let j = 0; j < sides; j++) {
    let angle = map(j, 0, sides, 0, TWO_PI);
    let vx = cos(angle) * radius;
    let vy = sin(angle) * radius;
    vertices.push({x: vx, y: vy});
  }
  
  // Add the new obstacle to the array
  obstacles.push({
    pos: createVector(mouseX, mouseY),
    vertices: vertices,
    color: color(random(255), random(255), random(255)),
    velocity: p5.Vector.random2D().mult(random(0.5, 3)),
    rotation: 0,
    rotationSpeed: random(-0.03, 0.03)
  });
}

function createObstacles() {
  // Create at least 5 obstacles with different sizes and colors
  for (let i = 0; i < 5; i++) {
    // Array of vertices to create custom shapes
    let vertices = [];
    let sides = floor(random(3, 7)); // Between 3 and 6 sides
    let radius = random(15, 40);
    
    for (let j = 0; j < sides; j++) {
      let angle = map(j, 0, sides, 0, TWO_PI);
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;
      vertices.push({x: x, y: y});
    }
    
    obstacles.push({
      pos: createVector(random(width), random(height)),
      vertices: vertices,
      color: color(random(255), random(255), random(255)),
      velocity: p5.Vector.random2D().mult(random(0.5, 3)),
      rotation: 0,
      rotationSpeed: random(-0.03, 0.03)
    });
  }
}

function moveObstacles() {
  for (let obs of obstacles) {
    obs.pos.add(obs.velocity);
    obs.rotation += obs.rotationSpeed;
    
    // Wrap around screen (come back on other side)
    if (obs.pos.x > width + 50) obs.pos.x = -50;
    else if (obs.pos.x < -50) obs.pos.x = width + 50;
    
    if (obs.pos.y > height + 50) obs.pos.y = -50;
    else if (obs.pos.y < -50) obs.pos.y = height + 50;
  }
}

function drawObstacles() {
  for (let obs of obstacles) {
    push();
    translate(obs.pos.x, obs.pos.y);
    rotate(obs.rotation);
    
    fill(obs.color);
    beginShape();
    for (let v of obs.vertices) {
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
    pop();
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
  
  // Add a label
  fill(0);
  textSize(12);
  text("EXIT", exitZone.x + 2, exitZone.y + 30);
}

function checkWinCondition() {
  if (!win && 
      player.x > exitZone.x &&
      player.y > exitZone.y &&
      player.y < exitZone.y + exitZone.h) {
    win = true;
  }
}

function displayWinMessage() {
  if (win) {
    textSize(32);
    fill(0);
    text("You Win!", width / 2 - 70, height / 2);
    noLoop(); // stop the game
  }
}