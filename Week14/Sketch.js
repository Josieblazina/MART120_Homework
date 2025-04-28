// Shape class for player
class Player {
    constructor(x, y, size, color) {
      this.pos = createVector(x, y);
      this.size = size;
      this.color = color;
    }
    
    display() {
      fill(this.color);
      ellipse(this.pos.x, this.pos.y, this.size, this.size);
    }
    
    move() {
      let speed = 2;
      if (keyIsDown(LEFT_ARROW)) this.pos.x -= speed;
      if (keyIsDown(RIGHT_ARROW)) this.pos.x += speed;
      if (keyIsDown(UP_ARROW)) this.pos.y -= speed;
      if (keyIsDown(DOWN_ARROW)) this.pos.y += speed;
      
      // constrain to screen
      this.pos.x = constrain(this.pos.x, 0, width);
      this.pos.y = constrain(this.pos.y, 0, height);
    }
  }
  
  // Shape class for obstacles
  class Obstacle {
    constructor(x, y, size, color) {
      this.pos = createVector(x, y);
      this.size = size;
      this.color = color;
      this.vertices = [];
      this.rotation = 0;
      this.rotationSpeed = random(-0.03, 0.03);
      this.velocity = p5.Vector.random2D().mult(random(0.5, 3));
      
      // Create vertices
      let sides = floor(random(3, 7)); // Between 3 and 6 sides
      for (let j = 0; j < sides; j++) {
        let angle = map(j, 0, sides, 0, TWO_PI);
        let vx = cos(angle) * this.size;
        let vy = sin(angle) * this.size;
        this.vertices.push({x: vx, y: vy});
      }
    }
    
    display() {
      push();
      translate(this.pos.x, this.pos.y);
      rotate(this.rotation);
      
      fill(this.color);
      beginShape();
      for (let v of this.vertices) {
        vertex(v.x, v.y);
      }
      endShape(CLOSE);
      pop();
    }
    
    move() {
      this.pos.add(this.velocity);
      this.rotation += this.rotationSpeed;
      
      // Wrap around screen (come back on other side)
      if (this.pos.x > width + 50) this.pos.x = -50;
      else if (this.pos.x < -50) this.pos.x = width + 50;
      
      if (this.pos.y > height + 50) this.pos.y = -50;
      else if (this.pos.y < -50) this.pos.y = height + 50;
    }
  }
  
  // Shape class for exit zone
  class ExitZone {
    constructor(x, y, width, height, color) {
      this.x = x;
      this.y = y;
      this.w = width;
      this.h = height;
      this.color = color;
    }
    
    display() {
      fill(this.color);
      noStroke();
      rect(this.x, this.y, this.w, this.h);
      
      // Add a label
      fill(0);
      textSize(12);
      text("EXIT", this.x + 2, this.y + 30);
    }
  }
  
  let player;
  let obstacles = [];
  let exitZone;
  let win = false;
  
  function setup() {
    createCanvas(600, 400);
    
    // Create player object with x, y, size, and color
    player = new Player(50, height / 2, 20, color(0, 0, 255));
    
    // Create exit zone object
    exitZone = new ExitZone(width - 40, height / 2 - 30, 30, 60, color(0, 255, 0));
    
    // Create obstacle objects
    createObstacles();
  }
  
  function draw() {
    background(220);
    drawBorders();
    
    // Display exit zone
    exitZone.display();
    
    // Move and display player
    player.move();
    player.display();
    
    // Move and display obstacles
    for (let obs of obstacles) {
      obs.move();
      obs.display();
    }
    
    checkWinCondition();
    displayWinMessage();
  }
  
  function createObstacles() {
    // Create at least 3 obstacles with different positions, sizes, and colors
    obstacles.push(new Obstacle(200, 100, 25, color(255, 0, 0)));
    obstacles.push(new Obstacle(350, 250, 35, color(255, 165, 0)));
    obstacles.push(new Obstacle(150, 300, 20, color(128, 0, 128)));
    
    // Add a couple more for gameplay
    obstacles.push(new Obstacle(400, 150, 30, color(0, 255, 255)));
    obstacles.push(new Obstacle(250, 200, 40, color(255, 255, 0)));
  }
  
  function mousePressed() {
    // Add a new obstacle at mouse position
    obstacles.push(new Obstacle(mouseX, mouseY, random(15, 40), color(random(255), random(255), random(255))));
  }
  
  function drawBorders() {
    stroke(0);
    strokeWeight(4);
    noFill();
    rect(0, 0, width, height);
  }
  
  function checkWinCondition() {
    if (!win && 
        player.pos.x > exitZone.x &&
        player.pos.y > exitZone.y &&
        player.pos.y < exitZone.y + exitZone.h) {
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